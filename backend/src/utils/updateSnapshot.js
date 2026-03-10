import prisma from "../config/prisma.js";
import { io } from "../server.js";

export async function updateSnapshot(deviceId, data) {
  if (!deviceId) return null;

  const FIVE_MIN = 5 * 60 * 1000;
  const now = Date.now();

  // ---------- REQUIRE measuredAt FOR METRIC UPDATES ----------
  const measuredTime = data.measuredAt
    ? new Date(data.measuredAt)
    : null;

  if (measuredTime && isNaN(measuredTime.getTime())) {
    console.log("Invalid measuredAt → skipping snapshot update");
    return null;
  }

  // ---------- STALE CHECK ----------
  if (measuredTime) {
    const measured = measuredTime.getTime();
    if (now - measured > FIVE_MIN) {
      console.log("OLD DATA → not updating live snapshot");
      return null;
    }
  }

  const payload = {};

  // ---------- METRIC LEVEL UPDATE ----------
  if (data.heartRate !== undefined) {
    payload.heartRate = data.heartRate;
    payload.heartRateAt = measuredTime ?? new Date();
  }

  if (data.spo2 !== undefined) {
    payload.spo2 = data.spo2;
    payload.spo2At = measuredTime ?? new Date();
  }

  if (data.temperature !== undefined) {
    payload.temperature = data.temperature;
    payload.temperatureAt = measuredTime ?? new Date();
  }

  if (data.stress !== undefined) {
    payload.stress = data.stress;
    payload.stressAt = measuredTime ?? new Date();
  }

  if (data.systolic !== undefined || data.diastolic !== undefined) {
    if (data.systolic !== undefined) {
      payload.systolic = data.systolic;
    }

    if (data.diastolic !== undefined) {
      payload.diastolic = data.diastolic;
    }

    payload.bpAt = measuredTime ?? new Date();
  }

  // ---------- PREVENT EMPTY UPDATE ----------
  if (Object.keys(payload).length === 0) {
    console.log("No valid metric provided → skipping snapshot update");
    return null;
  }

  // ---------- UPSERT ----------
  const snapshot = await prisma.deviceVitalsSnapshot.upsert({
    where: { deviceId },
    update: payload,
    create: {
      deviceId,
      ...payload,
    },
  });

  // ---------- REALTIME EMIT ----------
  io.to(deviceId).emit("vitals-update", snapshot);

  return snapshot;
}