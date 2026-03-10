import type { TemperaturePoint, TemperatureRange } from "@/types/temperature";
 
/* ================= STATUS ================= */
 
export function getTemperatureStatus(value?: number) {
  if (value == null) return "—";
  if (value < 30) return "Very Low";
  if (value < 33) return "Low";
  if (value < 35) return "Below Normal";
  if (value <= 37.5) return "Normal";
  return "High";
}
 
 
/* ================= FIXED POINT BUILDER ================= */
 
export function buildFixedTemperaturePoints(
  points: TemperaturePoint[],
  range: TemperatureRange
) {
  if (!points.length) return [];
 
  const sorted = [...points].sort((a, b) => a.ts - b.ts);
 
  // anchor to latest available data
  const latestTs = sorted[sorted.length - 1].ts;
  const baseDay = new Date(latestTs);
  baseDay.setHours(0, 0, 0, 0);
  const base = baseDay.getTime();
 
  /* ---------- LIVE ---------- */
  if (
    range === "30m" ||
    range === "1h" ||
    range === "8h" ||
    range === "1d"
  ) {
    return sorted.map(p => ({
      ...p,
      label:
        range === "1d"
          ? new Date(p.ts).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              hour12: false,
            })
          : new Date(p.ts).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
    }));
  }
 
  const days = range === "1w" ? 7 : 30;
  let lastValue: number | undefined;
 
  return Array.from({ length: days }, (_, i) => {
    const dayStart = base - (days - 1 - i) * 86400000;
    const dayEnd = dayStart + 86400000;
 
    const match = [...sorted]
      .reverse()
      .find(p => p.ts >= dayStart && p.ts < dayEnd);
 
    // 🔥 forward-fill logic
    if (match?.value != null) {
      lastValue = match.value;
    }
 
    return {
      ts: dayStart,
      measuredAt: match?.measuredAt,
      value: lastValue,   // ✅ THIS IS THE FIX
      label:
        range === "1w"
          ? new Date(dayStart).toLocaleDateString("en-GB", {
              weekday: "short",
            })
          : new Date(dayStart).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            }),
    };
  });
}
 
export function aggregateTemperatureByRange(
  points: TemperaturePoint[],
  range: TemperatureRange
): TemperaturePoint[] {
  if (!points.length) return [];
 
  const now = Date.now();
 
   let aggregated: TemperaturePoint[] = [];
 
  // 🔹 30 minutes
  if (range === "30m") {
    return points.filter(p => p.ts >= now - 30 * 60 * 1000);
  }
 
  // 🔹 1 hour
  if (range === "1h") {
    return points.filter(p => p.ts >= now - 60 * 60 * 1000);
  }
 
  // 🔹 8 hours
  if (range === "8h") {
    points = points.filter(p => p.ts >= now - 8 * 60 * 60 * 1000);
  }
 
  // 🔹 Today (00 → 23)
  if (range === "1d") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
 
    const start = today.getTime();
    const end = start + 86400000;
 
    points = points.filter(p => p.ts >= start && p.ts < end);
  }
 
if (range === "8h" || range === "1d") {
  const hourlyMap = new Map<number, number[]>();
 
  points.forEach(p => {
    const d = new Date(p.ts);
    d.setMinutes(0, 0, 0);
    const hourTs = d.getTime();
 
    if (!hourlyMap.has(hourTs)) hourlyMap.set(hourTs, []);
    hourlyMap.get(hourTs)!.push(p.value);
  });
 
  aggregated = Array.from(hourlyMap.entries())
    .map(([ts, values]) => ({
      ts,
      measuredAt: ts,
      value: Number(
        (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
      ),
    }))
    .sort((a, b) => a.ts - b.ts);
 
  return aggregated;
}
 
  // DAILY AVG → 1w
  if (range === "1w") {
    const dailyMap = new Map<number, number[]>();
 
    points.forEach(p => {
      const d = new Date(p.ts);
      d.setHours(0, 0, 0, 0);
      const dayTs = d.getTime();
 
      if (!dailyMap.has(dayTs)) dailyMap.set(dayTs, []);
      dailyMap.get(dayTs)!.push(p.value);
    });
 
    aggregated = Array.from(dailyMap.entries())
      .map(([ts, values]) => ({
        ts,
        measuredAt: ts,
        value: Number(
          (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
        ),
      }))
      .sort((a, b) => a.ts - b.ts);
  }
 
  return aggregated;
}
 
 