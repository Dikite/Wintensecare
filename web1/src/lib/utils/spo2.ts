import type { SpO2Point, SpO2Range } from "@/types/spo2";
 
type SpO2ChartPoint = {
  ts: number;
  value: number | null;
  err: [number, number];
  min: number | null;
  max: number | null;
};
 
function clamp(v?: number | null, min = 70, max = 100) {
  if (v == null) return null;
  return Math.max(min, Math.min(max, v));
}
 
function getTs(ts: string | number) {
  return typeof ts === "number" ? ts : Date.parse(ts);
}
 
function hourBucket(ts: number) {
  const d = new Date(ts);
 
  return new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    d.getHours(),
    0,
    0,
    0
  ).getTime();
}
 
function dayBucket(ts: number) {
  const d = new Date(ts);
 
  return Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    0,
    0,
    0,
    0
  );
}
 
export function buildSpO2ChartData(
  points: SpO2Point[],
  range: SpO2Range
): SpO2ChartPoint[] {
 
  if (!points?.length) return [];
 
  const sorted = [...points].sort((a,b)=>getTs(a.ts)-getTs(b.ts));
 
  const now = Date.now();
 
  /* ---------- 30m ---------- */
  if (range === "30m") {
    return sorted
      .filter(p => getTs(p.ts) >= now - 30 * 60 * 1000)
      .map(p => {
        const min = clamp(p.min);
        const max = clamp(p.max);
        const value = clamp(p.avg ?? p.max ?? p.min);
 
        return {
          ts: getTs(p.ts),
          value,
          err: [value! - min!, max! - value!] as [number,number],
          min,
          max
        };
      });
  }
 
  /* ---------- 1h ---------- */
  if (range === "1h") {
    return sorted
      .filter(p => getTs(p.ts) >= now - 60 * 60 * 1000)
      .map(p => {
        const min = clamp(p.min);
        const max = clamp(p.max);
        const value = clamp(p.avg ?? p.max ?? p.min);
 
        return {
          ts: getTs(p.ts),
          value,
          err: [value! - min!, max! - value!] as [number,number],
          min,
          max
        };
      });
  }
 
  /* ---------- 8h hourly avg ---------- */
  if (range === "8h") {
 
    const start = now - 8 * 60 * 60 * 1000;
 
    const map = new Map<number,SpO2Point[]>();
 
    for(const p of sorted){
      const ts = getTs(p.ts);
      if(ts < start) continue;
 
      const bucket = hourBucket(ts);
 
      if(!map.has(bucket)) map.set(bucket,[]);
      map.get(bucket)!.push(p);
    }
 
    return Array.from(map.entries()).map(([ts,values])=>{
 
      const min = Math.min(...values.map(v=>clamp(v.min)!));
      const max = Math.max(...values.map(v=>clamp(v.max)!));
 
      const avg = Math.round(
        values.reduce((s,v)=>s+clamp(v.avg ?? v.max ?? v.min)!,0)/values.length
      );
 
      return {
        ts,
        value: avg,
        err:[avg-min,max-avg] as [number,number],
        min,
        max
      };
 
    }).sort((a,b)=>a.ts-b.ts);
  }
 
  /* ---------- 1d today hourly ---------- */
 
  if(range==="1d"){
 
    const start = new Date();
    start.setHours(0,0,0,0);
 
    const map = new Map<number,SpO2Point[]>();
 
    for(const p of sorted){
 
      const ts = getTs(p.ts);
      if(ts < start.getTime()) continue;
 
      const bucket = hourBucket(ts);
 
      if(!map.has(bucket)) map.set(bucket,[]);
      map.get(bucket)!.push(p);
 
    }
 
    return Array.from(map.entries()).map(([ts,values])=>{
 
      const min = Math.min(...values.map(v=>clamp(v.min)!));
      const max = Math.max(...values.map(v=>clamp(v.max)!));
 
      const avg = Math.round(
        values.reduce((s,v)=>s+clamp(v.avg ?? v.max ?? v.min)!,0)/values.length
      );
 
      return {
        ts,
        value: avg,
        err:[avg-min,max-avg] as [number,number],
        min,
        max
      };
 
    }).sort((a,b)=>a.ts-b.ts);
  }
 
  /* ---------- 7d daily ---------- */
 
  if(range==="7d"){
 
    const start = new Date();
    start.setHours(0,0,0,0);
    start.setDate(start.getDate()-6);
 
    const map = new Map<number,SpO2Point[]>();
 
    for(const p of sorted){
 
      const ts = getTs(p.ts);
      if(ts < start.getTime()) continue;
 
      const bucket = dayBucket(ts);
 
      if(!map.has(bucket)) map.set(bucket,[]);
      map.get(bucket)!.push(p);
 
    }
 
    return Array.from(map.entries()).map(([ts,values])=>{
 
      const min = Math.min(...values.map(v=>clamp(v.min)!));
      const max = Math.max(...values.map(v=>clamp(v.max)!));
 
      const avg = Math.round(
        values.reduce((s,v)=>s+clamp(v.avg ?? v.max ?? v.min)!,0)/values.length
      );
 
      return {
        ts,
        value: avg,
        err:[avg-min,max-avg] as [number,number],
        min,
        max
      };
 
    }).sort((a,b)=>a.ts-b.ts);
  }
 
  return [];
}
 