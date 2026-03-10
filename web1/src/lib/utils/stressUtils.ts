import type { StressPoint, StressRange } from "@/types/stress";
 
/* ================= RANGE → MS ================= */
 
export function getStressRangeMs(range: StressRange) {
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
 
/* ================= HOURLY BUCKETS (ROLLING) ================= */
 
function getLastHourBuckets(hours: number) {
  const now = new Date();
  now.setMinutes(0, 0, 0);
 
  return Array.from({ length: hours }, (_, i) => {
    const d = new Date(now);
    d.setHours(now.getHours() - (hours - 1 - i));
 
    return {
      ts: d.getTime(),
      values: [] as number[],
      level: null as StressPoint["level"] | null,
    };
  });
}
 
/* ================= BUILD STRESS POINTS ================= */
 
export function buildStressPoints(
 raw: { ts: number; value: number; level: StressPoint["level"] }[],
  range: StressRange
): StressPoint[] {
  const sorted = [...raw].sort((a, b) => a.ts - b.ts);
 
  const now = Date.now();
 
/* ---------- FILTER RANGE ---------- */
 
if (range === "30m") {
  return sorted
    .filter(p => p.ts >= now - 30 * 60 * 1000)
    .map(p => ({
      ts: p.ts,
      value: p.value,
      level: p.level,
      label: new Date(p.ts).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    }));
}
 
if (range === "1h") {
  return sorted
    .filter(p => p.ts >= now - 60 * 60 * 1000)
    .map(p => ({
      ts: p.ts,
      value: p.value,
      level: p.level,
      label: new Date(p.ts).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    }));
}
 
 
 
  /* ---------- 8h (ROLLING) ---------- */
if (range === "8h") {
  const buckets = getLastHourBuckets(8);
 
 for (const p of sorted.filter(p => p.ts >= now - getStressRangeMs(range))) {
    const d = new Date(p.ts);
    d.setMinutes(0, 0, 0);
 
    const idx = buckets.findIndex(
      (b) => b.ts === d.getTime()
    );
 
    if (idx === -1) continue;
 
    buckets[idx].values.push(p.value);
    buckets[idx].level = p.level;
  }
 
  return buckets.map((b) => ({
    ts: b.ts,
    value:
      b.values.length > 0
        ? b.values.reduce((a, c) => a + c, 0) / b.values.length
        : null,
    level: b.level,
    label: new Date(b.ts).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      hour12: false,
    }),
  }));
}
 
/* ---------- 1d (TODAY 00–23 FIXED) ---------- */
if (range === "1d") {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
 
  const buckets = Array.from({ length: 24 }, (_, hour) => {
    const d = new Date(today);
    d.setHours(hour, 0, 0, 0);
 
    return {
      ts: d.getTime(),
      values: [] as number[],
      level: null as StressPoint["level"] | null,
    };
  });
 
 for (const p of sorted.filter(p => p.ts >= now - getStressRangeMs(range))) {
    const d = new Date(p.ts);
    d.setMinutes(0, 0, 0);
 
    const idx = buckets.findIndex(
      (b) => b.ts === d.getTime()
    );
 
    if (idx === -1) continue;
 
    buckets[idx].values.push(p.value);
    buckets[idx].level = p.level;
  }
 
  return buckets.map((b) => ({
    ts: b.ts,
    value:
      b.values.length > 0
        ? b.values.reduce((a, c) => a + c, 0) / b.values.length
        : null,
    level: b.level,
    label: new Date(b.ts).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      hour12: false,
    }),
  }));
}
 
  /* ---------- 1w (LAST 7 DAYS, TODAY LAST) ---------- */
  const today = new Date();
  today.setHours(0, 0, 0, 0);
 
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
 
    return {
      ts: d.getTime(),
      values: [] as number[],
    };
  });
 
  for (const p of sorted.filter(p => p.ts >= now - getStressRangeMs(range))) {
    const d = new Date(p.ts);
    d.setHours(0, 0, 0, 0);
 
    const idx = days.findIndex(
      (day) => day.ts === d.getTime()
    );
 
    if (idx !== -1) {
      days[idx].values.push(p.value);
    }
  }
 
  return days.map((d) => ({
    ts: d.ts,
    value:
      d.values.length > 0
        ? d.values.reduce((a, b) => a + b, 0) / d.values.length
        : null,
    label: new Date(d.ts).toLocaleDateString("en-GB", {
      weekday: "short",
    }),
  }));
}
 
/* ================= STRESS STATUS ================= */
 
export function getStressStatus(value?: number | null) {
  if (value == null)
    return { label: "No Data", color: "default" as const };
 
  if (value < 40)
    return { label: "Low Stress", color: "success" as const };
 
  if (value < 70)
    return { label: "Moderate Stress", color: "warning" as const };
 
  return { label: "High Stress", color: "error" as const };
}
 
 