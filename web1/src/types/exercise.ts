/* ================================
   WORKOUT / EXERCISE TYPES
================================ */

export type WorkoutType =
  | "cardio"
  | "hiit"
  | "walk"
  | "run"
  | "gym";

export type WorkoutSession = {
  id: string;
  type: WorkoutType;
  status: "ACTIVE" | "ENDED";
  duration: number;
  avgHR: number;
  maxHR?: number;
  calories: number;
  startTime: string;
  endTime?: string;
};

export type WeeklyWorkoutStats = {
  workouts: number;
  totalCalories: number;
  totalDuration: number; // seconds
  avgHR: number;
};

export type LiveWorkoutData = {
  sessionId: string;
  type: WorkoutType;        // ✅ ADD THIS
  heartRate?: number | null;
  steps?: number | null;
  duration?: number | null;
  avgHR?: number | null;
  calories?: number | null;
};

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  createdAt?: string | null; 
};

export type WorkoutSet = {
  id: string;
  sessionId: string;
  exerciseId: string;
  reps: number;
  weight: number;
  createdAt?: string;
};

