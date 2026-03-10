import type { Range, TelemetryPoint } from "@/types/heart";

/* Convert range to milliseconds */
export function getRangeMs(range: Range): number {
  switch (range) {
    case "30m":
      return 30 * 60 * 1000;
    case "1h":
      return 60 * 60 * 1000;
    case "8h":
      return 8 * 60 * 60 * 1000;
    case "1d":
      return 24 * 60 * 60 * 1000;
    case "7d":
      return 7 * 24 * 60 * 60 * 1000;
    default:
      return 60 * 60 * 1000;
  }
}

/* Suggested tick counts for the X axis per range */
export function getTickCount(range: Range): number {
  switch (range) {
    case "30m":
      return 6; // every ~5 min
    case "1h":
      return 6; // every ~10 min
    case "8h":
      return 8; // hourly-ish
    case "1d":
      return 6; // every 4 hours
    case "7d":
      return 7; // daily
    default:
      return 6;
  }
}

/* Aggregate heart rate based on range */
export function aggregateHeartRateByRange(
  points: TelemetryPoint[],
  range: Range
): TelemetryPoint[] {
  if (!points || points.length === 0) return [];

  // RAW → 30m, 1h
  if (range === "30m" || range === "1h") {
    return points;
  }

  // HOURLY AVG → 8h, 1d
 /* ================= 8h (ROLLING HOURLY AVG) ================= */
if (range === "8h") {
  const hourlyMap = new Map<number, number[]>();

  for (const p of points) {
    const d = new Date(p.ts);
    d.setMinutes(0, 0, 0);
    const hourTs = d.getTime();

    if (!hourlyMap.has(hourTs)) hourlyMap.set(hourTs, []);
    hourlyMap.get(hourTs)!.push(p.heartRate);
  }

  return Array.from(hourlyMap.entries())
    .map(([ts, values]) => ({
      ts,
      heartRate: Math.round(
        values.reduce((sum, v) => sum + v, 0) / values.length
      ),
    }))
    .sort((a, b) => a.ts - b.ts);
}


/* ================= 1d (TODAY – ONLY HOURS WITH DATA) ================= */
if (range === "1d") {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = today.getTime();
  const end = start + 24 * 60 * 60 * 1000;

  const hourlyMap = new Map<number, number[]>();

  for (const p of points) {
    if (p.ts < start || p.ts >= end) continue;

    const d = new Date(p.ts);
    d.setMinutes(0, 0, 0);
    const hourTs = d.getTime();

    if (!hourlyMap.has(hourTs)) hourlyMap.set(hourTs, []);
    hourlyMap.get(hourTs)!.push(p.heartRate);
  }

  return Array.from(hourlyMap.entries())
    .map(([ts, values]) => ({
      ts,
      heartRate: Math.round(
        values.reduce((sum, v) => sum + v, 0) / values.length
      ),
    }))
    .sort((a, b) => a.ts - b.ts);
}

  // DAILY AVG → 7d
  if (range === "7d") {
    const dailyMap = new Map<number, number[]>();

    for (const p of points) {
      const d = new Date(p.ts);
      d.setHours(0, 0, 0, 0);
      const dayTs = d.getTime();

      if (!dailyMap.has(dayTs)) dailyMap.set(dayTs, []);
      dailyMap.get(dayTs)!.push(p.heartRate);
    }

    return Array.from(dailyMap.entries())
      .map(([ts, values]) => ({
        ts,
        heartRate: Math.round(
          values.reduce((sum, v) => sum + v, 0) / values.length
        ),
      }))
      .sort((a, b) => a.ts - b.ts);
  }

  return points;
}