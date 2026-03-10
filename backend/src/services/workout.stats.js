import prisma from "../config/prisma.js";

export async function getWeeklyStats(userId) {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  const sessions = await prisma.workoutSession.findMany({
    where: {
      userId,
      status: "ENDED",
      startTime: { gte: weekStart }
    }
  });

  if (!sessions.length) {
    return {
      workouts: 0,
      totalCalories: 0,
      totalDuration: 0,
      avgHR: 0
    };
  }

  const workouts = sessions.length;

  const totalCalories = sessions.reduce((s, w) => s + (w.calories || 0), 0);

  const totalDuration = sessions.reduce((s, w) => s + (w.duration || 0), 0);

  const avgHR = Math.round(
    sessions.reduce((s, w) => s + (w.avgHR || 0), 0) / workouts
  );

  return {
    workouts,
    totalCalories,
    totalDuration,
    avgHR
  };
}
