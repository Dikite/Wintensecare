import prisma from '../config/prisma.js';
import { evaluateAlerts } from '../services/alert.service.js';
import { updateSnapshot } from "../utils/updateSnapshot.js";
import { startWorkout, endWorkout } from '../services/workout.service.js';

// ---------- CREATE TELEMETRY ----------
async function createTelemetry(req, res) {
const { deviceId, heartRate, steps, battery, measuredAt } = req.body;

if (!deviceId || heartRate == null || steps == null || battery == null || !measuredAt) {
  return res.status(400).json({ message: "All fields required" });
}

let measuredTime = new Date(measuredAt);

if (isNaN(measuredTime.getTime())) {
  return res.status(400).json({ message: "Invalid measuredAt" });
}

const now = Date.now();
const ALLOW_DRIFT = 5 * 1000; // 5 seconds

if (measuredTime.getTime() > now + ALLOW_DRIFT) {
  return res.status(400).json({
    message: "Future timestamps are not allowed"
  });
}


  const device = await prisma.device.findFirst({
    where: { id: deviceId, userId: req.user.id }
  });

  if (!device) {
    return res.status(403).json({ message: "Device not allowed" });
  }

  // create telemetry
  const telemetry = await prisma.telemetry.create({
    data: { deviceId, heartRate, steps, battery,measuredAt: measuredTime }
  });
 // 🔒 Only update LIVE if telemetry is recent
const nowTime = Date.now();
const FIVE_MIN = 5 * 60 * 1000;

if (nowTime - measuredTime.getTime() <= FIVE_MIN) {
  await updateSnapshot(deviceId, {
    heartRate: heartRate,
    measuredAt: measuredTime
  });
} else {
  console.log("Old telemetry sync → skip live update");
}


  // =================================
  // WORKOUT HANDLING
  // =================================

  let activeSession = await prisma.workoutSession.findFirst({
    where: { deviceId, status: "ACTIVE" }
  });

const last3Min = new Date(measuredTime.getTime() - 3 * 60 * 1000);

const recent = await prisma.telemetry.findMany({
  where: {
    deviceId,
    measuredAt: { gte: last3Min, lte: measuredTime }
  }
});

  const candidates = recent.filter(
    t => t.heartRate > 110 && t.steps > 5
  );

  if (candidates.length >= 3 && !activeSession) {
    await startWorkout(req.user.id, deviceId, "cardio");

    // re-fetch
    activeSession = await prisma.workoutSession.findFirst({
      where: { deviceId, status: "ACTIVE" }
    });
  }

// -------- ATTACH TELEMETRY TO SESSION ----------
if (activeSession) {
  // attach telemetry row to workout
  await prisma.telemetry.update({
    where: { id: telemetry.id },
    data: { workoutSessionId: activeSession.id }
  });

  // update activity timestamp
  await prisma.workoutSession.update({
    where: { id: activeSession.id },
    data: { lastTelemetryAt: measuredTime }
  });
}



  await evaluateAlerts(deviceId, req.user.id);

  return res.status(201).json(telemetry);
}


// ---------- GET RAW TELEMETRY ----------
async function getTelemetry(req, res) {
  const { deviceId, limit = 50 } = req.query;

  if (!deviceId) {
    return res.status(400).json({ message: 'deviceId is required' });
  }

  const device = await prisma.device.findFirst({
    where: {
      id: deviceId,
      userId: req.user.id,
    },
  });

  if (!device) {
    return res.status(403).json({ message: 'Device not found or access denied' });
  }

  const telemetry = await prisma.telemetry.findMany({
    where: { deviceId },
    orderBy: { measuredAt: 'desc' },
    take: Number(limit),
  });

  return res.json(telemetry);
}

// ---------- RANGE UTILITY ----------
function getRangeStart(range) {
  const now = new Date();

  switch (range) {
    case '30m':
      return new Date(now.getTime() - 30 * 60 * 1000);
    case '1h':
      return new Date(now.getTime() - 60 * 60 * 1000);
    case '8h':
      return new Date(now.getTime() - 8 * 60 * 60 * 1000);
    case '1d':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    default:
      return null;
  }
}

// ---------- TELEMETRY HISTORY ----------
async function getTelemetryHistory(req, res) {
  const { deviceId, range } = req.query;

  if (!deviceId || !range) {
    return res.status(400).json({ message: 'deviceId and range are required' });
  }

  const startTime = getRangeStart(range);
  if (!startTime) {
    return res.status(400).json({ message: 'Invalid range value' });
  }

  const device = await prisma.device.findFirst({
    where: {
      id: deviceId,
      userId: req.user.id,
    },
  });

  if (!device) {
    return res.status(403).json({ message: 'Device not found or access denied' });
  }

  const telemetry = await prisma.telemetry.findMany({
    where: {
      deviceId,
      measuredAt: { gte: startTime },
    },
    orderBy: { measuredAt: 'asc' },
  });

  if (telemetry.length === 0) {
    return res.json({
      range,
      points: [],
      summary: {
        avgHeartRate: 0,
        maxHeartRate: 0,
        minHeartRate: 0,
        steps: 0,
        battery: null,
      },
    });
  }

  let hrSum = 0;
  let maxHr = telemetry[0].heartRate;
  let minHr = telemetry[0].heartRate;
  let totalSteps = 0;

  telemetry.forEach(t => {
    hrSum += t.heartRate;
    maxHr = Math.max(maxHr, t.heartRate);
    minHr = Math.min(minHr, t.heartRate);
    totalSteps += t.steps;
  });

  const avgHr = Math.round(hrSum / telemetry.length);
  const lastBattery = telemetry[telemetry.length - 1].battery;

  const points = telemetry.map(t => ({
    ts: t.measuredAt,
    heartRate: t.heartRate,
  }));

  return res.json({
    range,
    points,
    summary: {
      avgHeartRate: avgHr,
      maxHeartRate: maxHr,
      minHeartRate: minHr,
      steps: totalSteps,
      battery: lastBattery,
    },
  });
}

// ---------- EXPORTS ----------
export {
  createTelemetry,
  getTelemetry,
  getTelemetryHistory,
};
