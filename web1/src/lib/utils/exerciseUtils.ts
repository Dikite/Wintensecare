import { WorkoutSession } from "@/types/exercise";

export const secondsToMinutes = (sec?: number) =>
  sec ? Math.round(sec / 60) : 0;

export const secondsToHours = (sec?: number) =>
  sec ? +(sec / 3600).toFixed(1) : 0;


/* =========================
   DAY VIEW → TODAY (HOURLY)
========================= */
export function buildExerciseDayData(
  sessions: WorkoutSession[]
) {
  const today = new Date().toISOString().slice(0, 10);

  const hours = Array.from({ length: 24 }, (_, h) => ({
    label: `${h.toString().padStart(2, "0")}:00`,
    cardio: 0,
    strength: 0,
    walk: 0,
  }));

  sessions.forEach((s) => {
    if (!s.startTime.startsWith(today)) return;

    const hour = new Date(s.startTime).getHours();
    const mins = s.duration / 60;

    if (s.type === "gym") hours[hour].strength += mins;
    else if (s.type === "walk" || s.type === "run")
      hours[hour].walk += mins;
    else hours[hour].cardio += mins;
  });

  return hours;
}

/* =========================
   WEEK VIEW → LAST 7 DAYS
========================= */
export function buildExerciseWeekData(
  sessions: WorkoutSession[]
) {
  const today = new Date();
  const days: any[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    days.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString(undefined, {
        weekday: "short",
      }),
      cardio: 0,
      strength: 0,
      walk: 0,
    });
  }

  sessions.forEach((s) => {
    const day = days.find(
      (d) => d.key === s.startTime.slice(0, 10)
    );
    if (!day) return;

    const mins = s.duration / 60;

    if (s.type === "gym") day.strength += mins;
    else if (s.type === "walk" || s.type === "run")
      day.walk += mins;
    else day.cardio += mins;
  });

  return days;
}
