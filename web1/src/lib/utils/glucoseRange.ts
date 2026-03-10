import type { GlucosePoint, GlucoseRange } from "@/types/glucose";
 
/* ================= TYPES ================= */
 
export type GlucoseRangeBar = {
  label: string;
  min: number | null;
  max: number | null;
  avg: number | null;
  measuredAt?: number;
};
 
/* ================= RANGE MS ================= */
 
export function getRangeMs(range: GlucoseRange) {
  switch (range) {
    case "30m":
      return 30 * 60 * 1000;
    case "1h":
      return 60 * 60 * 1000;
    case "8h":
      return 8 * 60 * 60 * 1000;
    case "1d":
      return 24 * 60 * 60 * 1000;
    case "1w":
      return 7 * 24 * 60 * 60 * 1000;
    default:
      return 24 * 60 * 60 * 1000;
  }
}
 
/* ================= FETCH DAYS (BP STYLE) ================= */
/* 🔥 REQUIRED by useGlucose.ts — DO NOT REMOVE */
 
export function getFetchDays(range: GlucoseRange) {
  if (range === "1w") return 8; // timezone safe
  if (range === "1d") return 2;
  return 1;
}
 
/* ================= HELPERS ================= */
 
function average(values: number[]) {
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}
 
/* ================= RANGE BAR BUILDER ================= */
/* 🔥 BP-STYLE ROLLING IMPLEMENTATION */
 
export function buildGlucoseRangeBars(
  points: GlucosePoint[],
  range: GlucoseRange
): GlucoseRangeBar[] {
  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
 
  const sorted = [...points].sort((a, b) => a.ts - b.ts);
 
  /* ================= 30m / 1h ================= */
/* Raw readings – rolling */

if (range === "30m" || range === "1h") {
  return sorted.map((p) => ({
    label: new Date(p.ts).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    min: p.glucose,
    max: p.glucose,
    avg: p.glucose,
    measuredAt: p.ts,
  }));
}

 /* ================= 8h / 1d ================= */
/* HOURLY BUCKETS – BP STYLE */

/* ================= 8h (ROLLING) ================= */
if (range === "8h") {
  const result: GlucoseRangeBar[] = [];
  const now = new Date();

  const end = new Date(now);
  end.setMinutes(0, 0, 0);

  for (let i = 7; i >= 0; i--) {
    const d = new Date(end);
    d.setHours(end.getHours() - i);

    const hourStart = d.getTime();
    const hourEnd = hourStart + 60 * 60 * 1000;

    const hourPoints = sorted.filter(
      (p) => p.ts >= hourStart && p.ts < hourEnd
    );

    const values = hourPoints.map((p) => p.glucose);
    const latest = hourPoints.at(-1);

    result.push({
      label: d.toLocaleTimeString("en-GB", { hour: "2-digit" }),
      min: values.length ? Math.min(...values) : null,
      max: values.length ? Math.max(...values) : null,
      avg: values.length ? average(values) : null,
      measuredAt: latest?.ts,
    });
  }

  return result;
}

/* ================= 1d (TODAY ONLY 00–23) ================= */
if (range === "1d") {
  const result: GlucoseRangeBar[] = [];

  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  for (let hour = 0; hour <= 23; hour++) {
    const hourStart = new Date(todayStart);
    hourStart.setHours(hour, 0, 0, 0);

    const hourEnd = new Date(hourStart);
    hourEnd.setHours(hour + 1);

    const hourPoints = sorted.filter(
      (p) => p.ts >= hourStart.getTime() && p.ts < hourEnd.getTime()
    );

    const values = hourPoints.map((p) => p.glucose);
    const latest = hourPoints.at(-1);

    result.push({
      label: hour.toString().padStart(2, "0"), // 00–23
      min: values.length ? Math.min(...values) : null,
      max: values.length ? Math.max(...values) : null,
      avg: values.length ? average(values) : null,
      measuredAt: latest?.ts,
    });
  }

  return result;
} 
 
  /* ================= 1 WEEK ================= */
  /* LAST 7 DAYS – TODAY ALWAYS LAST */
 
  if (range === "1w") {
    const result: GlucoseRangeBar[] = [];
 
    for (let i = 6; i >= 0; i--) {
      const d = new Date(todayStart);
      d.setDate(d.getDate() - i);
 
      const dayStart = d.getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
 
      const dayPoints = sorted.filter(
  (p) => p.ts >= dayStart && p.ts < dayEnd
);
 
const values = dayPoints.map((p) => p.glucose);
const latest = dayPoints.at(-1);
 
 
      result.push({
  label: d.toLocaleDateString("en-GB", { weekday: "short" }),
  min: values.length ? Math.min(...values) : null,
  max: values.length ? Math.max(...values) : null,
  avg: values.length ? average(values) : null,
  measuredAt: latest?.ts, // ✅ REAL TIME
});
 
    }
 
    return result;
  }
 
  return [];
}
 
 