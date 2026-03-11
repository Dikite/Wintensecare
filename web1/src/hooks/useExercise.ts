"use client";
 
import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api/api";
import {
  WeeklyWorkoutStats,
  LiveWorkoutData,
  WorkoutType,
  WorkoutSession,
  Exercise,
} from "@/types/exercise";
 
export function useExercise(deviceId?: string) {
  const [weeklyStats, setWeeklyStats] =
    useState<WeeklyWorkoutStats | null>(null);
 
  const [live, setLive] =
    useState<LiveWorkoutData | null>(null);
 
  const [history, setHistory] =
    useState<WorkoutSession[]>([]);
 
const todayStats = useMemo(() => {
  const now = new Date();
 
  return history.reduce((acc, session) => {
    const start = new Date(session.startTime);
 
    const isToday =
      start.getFullYear() === now.getFullYear() &&
      start.getMonth() === now.getMonth() &&
      start.getDate() === now.getDate();
 
    if (isToday) {
      const end = session.endTime ? new Date(session.endTime) : new Date();
 
      const minutes =
        (end.getTime() - start.getTime()) / 60000;
 
      acc[session.type] =
        (acc[session.type] || 0) + Math.round(minutes);
    }
 
    return acc;
  }, {} as Record<WorkoutType, number>);
}, [history]);
 
  const [exercises, setExercises] =
    useState<Exercise[]>([]);
 
  const isLive = !!live?.sessionId;
 
  const [liveLoading, setLiveLoading] = useState(true);
 
  /* ================= WEEKLY STATS ================= */
  useEffect(() => {
    api<WeeklyWorkoutStats>("/workout/stats/week")
      .then(setWeeklyStats)
      .catch(() => setWeeklyStats(null));
  }, []);
 
  /* ================= HISTORY ================= */
  useEffect(() => {
    api<WorkoutSession[]>("/workout/history")
      .then(setHistory)
      .catch(() => setHistory([]));
  }, []);
 
  /* ================= EXERCISES ================= */
  useEffect(() => {
    api<Exercise[]>("/workout/exercise")
      .then(setExercises)
      .catch(() => setExercises([]));
  }, []);
 
 /* ================= LIVE POLLING ================= */
useEffect(() => {
  if (!deviceId) return;
 
  let interval: NodeJS.Timeout;
 
  const fetchLive = async () => {
    try {
      const data = await api<LiveWorkoutData | null>(
        `/workout/live/${deviceId}`
      );
      setLive(data);
    } catch {
      setLive(null);
    } finally {
      setLiveLoading(false); // ✅ mark ready after first call
    }
  };
 
  // ✅ fetch immediately (NO 3s delay)
  fetchLive();
 
  // ✅ then start polling
  interval = setInterval(fetchLive, 3000);
 
  return () => clearInterval(interval);
}, [deviceId]);
 
  /* ================= ACTIONS ================= */
  const startWorkout = (type: WorkoutType) =>
    api("/workout/start", {
      method: "POST",
      body: JSON.stringify({ deviceId, type }),
    });
 
  const endWorkout = async () => {
    await api("/workout/end", {
      method: "POST",
      body: JSON.stringify({ deviceId }),
    });
    setLive(null); // ✅ STOP LIVE MODE
  };
 
  const addSet = (data: {
    sessionId: string;
    exerciseId: string;
    reps: number;
    weight: number;
  }) =>
    api("/workout/set", {
      method: "POST",
      body: JSON.stringify(data),
    });
 
  const createExercise = async (data: {
    name: string;
    muscleGroup: string;
  }) => {
    const ex = await api<Exercise>("/workout/exercise", {
      method: "POST",
      body: JSON.stringify(data),
    });
 
    // ✅ refresh dropdown immediately
   setExercises((prev) => {
  // prevent duplicates
  if (prev.some((e) => e.id === ex.id)) return prev;
  return [...prev, ex];
});
 
  };
 
  return {
    weeklyStats,
    history,
    live,
    exercises,
    isLive,
    liveLoading,
    startWorkout,
    endWorkout,
    addSet,
    createExercise,
    todayStats,
  };
}
 
 