import type { BPPoint, BPRange } from "@/types/bp";
 
export function buildFixedBPPoints(
  points: BPPoint[],
  range: BPRange
) {
  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
 
  const sorted = [...points].sort((a, b) => a.ts - b.ts);
 
  function avgBP(points: BPPoint[]) {
  if (!points.length) return null;
 
  const sum = points.reduce(
    (acc, p) => {
      acc.s += p.systolic;
      acc.d += p.diastolic;
      acc.p += p.pulse;
      return acc;
    },
    { s: 0, d: 0, p: 0 }
  );
 
  return {
    systolic: Math.round(sum.s / points.length),
    diastolic: Math.round(sum.d / points.length),
    pulse: Math.round(sum.p / points.length),
  };
}
 
  /* ================= TIME BASED (30m / 1h ) ================= */
 if (range === "30m" || range === "1h") {
  return sorted.map((p) => ({
 
   
    ts: p.ts,
    measuredAt: p.ts,
    systolic: p.systolic,
    diastolic: p.diastolic,
    pulse: p.pulse,
    label: new Date(p.ts).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  }));
}
 
if (range === "1d") {
  const result: any[] = [];
 
  for (let h = 0; h < 24; h++) {
    const start = todayStart + h * 3600000;
    const end = start + 3600000;
 
    const bucket = sorted.filter(p => p.ts >= start && p.ts < end);
    const avg = avgBP(bucket);
 
    result.push({
      ts: start,
      measuredAt: bucket.at(-1)?.ts,
      label: `${String(h).padStart(2, "0")}:00`,
     systolic: avg ? avg.systolic : null,
diastolic: avg ? avg.diastolic : null,
pulse: avg ? avg.pulse : null,
    });
  }
 
  return result;
}
  /* ================= WEEK (LAST 7 DAYS, NO FUTURE) ================= */
 if (range === "1w") {
  const result: any[] = [];
 
  for (let i = 6; i >= 0; i--) {
    const d = new Date(todayStart);
    d.setDate(d.getDate() - i);
 
    const start = d.getTime();
    const end = start + 86400000;
 
    const bucket = sorted.filter(p => p.ts >= start && p.ts < end);
    const avg = avgBP(bucket);
 
    result.push({
      ts: start,
      measuredAt: bucket.at(-1)?.ts,
      label: d.toLocaleDateString("en-GB", { weekday: "short" }),
      systolic: avg ? avg.systolic : null,
diastolic: avg ? avg.diastolic : null,
pulse: avg ? avg.pulse : null,
    });
  }
 
  return result;
}
  /* ================= MONTH (LAST 30 DAYS, STOP AT TODAY) ================= */
 const result: any[] = [];
 
for (let i = 29; i >= 0; i--) {
  const d = new Date(todayStart);
  d.setDate(d.getDate() - i);
 
  const start = d.getTime();
  const end = start + 86400000;
 
  const bucket = sorted.filter(p => p.ts >= start && p.ts < end);
  const avg = avgBP(bucket);
 
  result.push({
    ts: start,
    measuredAt: bucket.at(-1)?.ts,
    label: d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    }),
  systolic: avg ? avg.systolic : null,
diastolic: avg ? avg.diastolic : null,
pulse: avg ? avg.pulse : null,
  });
}
 
return result;
}
 