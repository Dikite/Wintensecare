import prisma from "../config/prisma.js";

export async function startWorkout(userId, deviceId, type = "cardio") {
  const active = await prisma.workoutSession.findFirst({
    where: { deviceId, status: "ACTIVE" }
  });

  if (active) return active;

  return prisma.workoutSession.create({
    data: {
      userId,
      deviceId,
      type,
      startTime: new Date(),
      status: "ACTIVE"
    }
  });
}

export async function endWorkout(deviceId) {
  const session = await prisma.workoutSession.findFirst({
    where: { deviceId, status: "ACTIVE" }
  });

  if (!session) return null;

  const telemetry = await prisma.telemetry.findMany({
    where: { workoutSessionId: session.id },
    orderBy: { createdAt: "asc" }
  });

  // no telemetry
  if (!telemetry.length) {
    return prisma.workoutSession.update({
      where: { id: session.id },
      data: {
        status: "ENDED",
        endTime: new Date(),
        duration: Math.floor(
          (Date.now() - new Date(session.startTime)) / 1000
        )
      }
    });
  }

  const hrValues = telemetry.map(t => t.heartRate);

  const avgHR = Math.round(
    hrValues.reduce((a, b) => a + b, 0) / hrValues.length
  );

  const maxHR = Math.max(...hrValues);

  const duration = Math.floor(
    (Date.now() - new Date(session.startTime)) / 1000
  );

  const stepsDelta =
    telemetry[telemetry.length - 1].steps - telemetry[0].steps;

  const { z1, z2, z3, z4, z5 } = calculateZones(telemetry);

  const calories = Math.round(duration / 60 * avgHR * 0.12);

  return prisma.workoutSession.update({
    where: { id: session.id },
    data: {
      status: "ENDED",
      endTime: new Date(),
      duration,
      avgHR,
      maxHR,
      calories,
      zone1: z1,
      zone2: z2,
      zone3: z3,
      zone4: z4,
      zone5: z5,
      stepsDelta
    }
  });
}

export function calculateZones(telemetry) {
  let z1 = 0, z2 = 0, z3 = 0, z4 = 0, z5 = 0;

  for (const t of telemetry) {
    const hr = t.heartRate;

    if (hr < 110) z1++;
    else if (hr < 130) z2++;
    else if (hr < 150) z3++;
    else if (hr < 170) z4++;
    else z5++;
  }

  return { z1, z2, z3, z4, z5 };
}
