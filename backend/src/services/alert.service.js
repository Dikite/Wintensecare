import prisma from '../config/prisma.js';
import { getUserPermission } from '../services/permission.service.js';


/**
 * Evaluate alerts after telemetry insert
 */
export const evaluateAlerts = async (deviceId, userId) => {

    // 🔐 check user alert permission
  const permission = await getUserPermission(userId);

  if (!permission.allowAlerts) 
    return; 
  // Fetch last 2 minutes telemetry

  const activeWorkout = await prisma.workoutSession.findFirst({
    where: {
      deviceId,
      status: "ACTIVE"
    }
  });
  const since = new Date(Date.now() - 2 * 60 * 1000);

  const telemetry = await prisma.telemetry.findMany({
    where: {
      deviceId,
      createdAt: { gte: since },
    },
    orderBy: { createdAt: 'asc' },
  });

  if (telemetry.length === 0) return;

  // ignore alerts for first 60 sec of workout
if (activeWorkout) {
  const workoutAge =
    Date.now() - new Date(activeWorkout.startTime).getTime();

  if (workoutAge < 60 * 1000) return;
}

// ---- HEART RATE CHECK ----
const avgHr =
  telemetry.reduce((sum, t) => sum + t.heartRate, 0) /
  telemetry.length;

const firstSteps = telemetry[0].steps;
const lastSteps = telemetry[telemetry.length - 1].steps;
const stepDelta = lastSteps - firstSteps;

const lastBattery = telemetry[telemetry.length - 1].battery;


// 🔴 CRITICAL: very high HR + no movement
if (avgHr > 180 && stepDelta < 10) {
  await createAlertOnce({
    userId,
    deviceId,
    metric: 'HEART_RATE',
    value: Math.round(avgHr),
    severity: 'CRITICAL',
    message: 'Sustained high heart rate without movement',
  });
}

// 🟠 WARNING: high HR but not exercising
else if (avgHr > 150 && stepDelta < 10 && !activeWorkout) {
  await createAlertOnce({
    userId,
    deviceId,
    metric: 'HEART_RATE',
    value: Math.round(avgHr),
    severity: 'WARNING',
    message: 'Elevated heart rate detected',
  });
}

// 🟢 during workout allow higher HR
else if (avgHr > 195 && activeWorkout) {
  await createAlertOnce({
    userId,
    deviceId,
    metric: 'HEART_RATE',
    value: Math.round(avgHr),
    severity: 'WARNING',
    message: 'Heart rate extremely high during workout',
  });
}


  // ---- BATTERY CHECK ----
  if (lastBattery < 15) {
    await createAlertOnce({
      userId,
      deviceId,
      metric: 'BATTERY',
      value: lastBattery,
      severity: 'WARNING',
      message: 'Device battery is low',
    });
  }
}

/**
 * Prevent duplicate open alerts
 */
async function createAlertOnce(data) {
  const existing = await prisma.alert.findFirst({
    where: {
      deviceId: data.deviceId,
      metric: data.metric,
      severity: data.severity,
      acknowledged: false,
    },
  });

  if (existing) return;

  await prisma.alert.create({ data });
}
