import prisma from "../config/prisma.js";
import { startWorkout, endWorkout } from "../services/workout.service.js";
import { getWeeklyStats } from "../services/workout.stats.js";

// START
export async function start(req, res) {
  const { deviceId, type } = req.body;
  const session = await startWorkout(req.user.id, deviceId, type || "cardio");
  res.json(session);
}

export async function getExercises(req, res) {
  const exercises = await prisma.exercise.findMany({
    orderBy: { name: "asc" }
  });

  res.json(exercises);
}

// END
export async function end(req, res) {
  const { deviceId } = req.body;
  const session = await endWorkout(deviceId);
  res.json(session);
}

// LIVE
export async function live(req, res) {
  const { deviceId } = req.params;

  const session = await prisma.workoutSession.findFirst({
    where: { deviceId, status: "ACTIVE" }
  });

  if (!session) return res.json(null);

  // latest telemetry only
  const latest = await prisma.telemetry.findFirst({
    where: { workoutSessionId: session.id },
    orderBy: { measuredAt: "desc" }
  });

  // average HR from DB
  const avg = await prisma.telemetry.aggregate({
    where: { workoutSessionId: session.id },
    _avg: { heartRate: true }
  });

  const duration = Math.floor(
    (Date.now() - new Date(session.startTime)) / 1000
  );

  const avgHR = Math.round(avg._avg.heartRate || 0);
  const calories = Math.round(duration / 60 * avgHR * 0.12);

  return res.json({
    sessionId: session.id,
    heartRate: latest?.heartRate || 0,
    steps: latest?.steps || 0,
    duration,
    avgHR,
    calories
  });
}

// WEEKLY
export async function weeklyStats(req, res) {
  const data = await getWeeklyStats(req.user.id);
  res.json(data);
}

// HISTORY
export async function history(req, res) {
  const sessions = await prisma.workoutSession.findMany({
    where: { userId: req.user.id },
    orderBy: { startTime: "desc" },
    take: 30
  });

  res.json(sessions);
}

// SET
export async function addSet(req, res) {
  const { sessionId, exerciseId, reps, weight } = req.body;

  const set = await prisma.workoutSet.create({
    data: { sessionId, exerciseId, reps, weight }
  });

  res.json(set);
}

export async function createExercise(req, res) {
  try {
    const { name, muscleGroup } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Invalid name" });
    }

    if (!muscleGroup || typeof muscleGroup !== "string") {
      return res.status(400).json({ error: "Invalid muscleGroup" });
    }

    const ex = await prisma.exercise.create({
      data: { name, muscleGroup }
    });

    res.json(ex);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
