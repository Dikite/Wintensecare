import cron from "node-cron";
import prisma from "../config/prisma.js";

const NO_DATA_LIMIT = 5 * 60;     // 5 minutes
const MAX_DURATION  = 3 * 60 * 60; // 3 hours

cron.schedule("* * * * *", async () => {
  const sessions = await prisma.workoutSession.findMany({
    where: { status: "ACTIVE" }
  });

  for (const s of sessions) {
    const now = Date.now();

    const duration =
      (now - new Date(s.startTime)) / 1000;

    // hard cap
    if (duration > MAX_DURATION) {
      await endSession(s, "MAX_DURATION");
      continue;
    }

    // inactivity stop
    if (s.lastTelemetryAt) {
      const sinceLast =
        (now - new Date(s.lastTelemetryAt)) / 1000;

      if (sinceLast > NO_DATA_LIMIT) {
        await endSession(s, "NO_TELEMETRY");
        continue;
      }
    }
  }
});

async function endSession(session, reason) {
  const endTime = new Date();

  const duration = Math.floor(
    (endTime - new Date(session.startTime)) / 1000
  );

  await prisma.workoutSession.update({
    where: { id: session.id },
    data: {
      status: "ENDED",
      endTime,
      duration,
      autoEnded: true,
      endReason: reason
    }
  });

  console.log("Auto-ended session:", session.id, reason);
}