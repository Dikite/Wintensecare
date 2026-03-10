"use client";
 
import { useEffect, useState } from "react";
import { api } from "@/lib/api/api";
import type { BPHistoryItem, BPPoint, BPRange } from "@/types/bp";
 
/* ================= RANGE HELPERS ================= */
 
function getRangeMs(range: BPRange) {
  switch (range) {
    case "30m":
      return 30 * 60 * 1000;
    case "1h":
      return 60 * 60 * 1000;
    case "1d":
      return 24 * 60 * 60 * 1000;
    case "1w":
      return 7 * 24 * 60 * 60 * 1000;
    case "1m":
      return 30 * 24 * 60 * 60 * 1000;
    default:
      return 24 * 60 * 60 * 1000;
  }
}
 
/**
 * IMPORTANT:
 * Always fetch a little MORE data than required
 * to avoid backend cutoff + timezone issues
 */
function getFetchDays(range: BPRange) {
  if (range === "1m") return 31;
  if (range === "1w") return 8;
  if (range === "1d") return 2;
  return 1; // 30m / 1h
}
 
/* ================= HELPERS ================= */
 
// keep latest record if measuredAt duplicates exist
function dedupeByMeasuredAt(items: BPHistoryItem[]) {
  const map = new Map<string, BPHistoryItem>();
 
  for (const item of items) {
    const prev = map.get(item.measuredAt);
    if (!prev || new Date(item.createdAt) > new Date(prev.createdAt)) {
      map.set(item.measuredAt, item);
    }
  }
 
  return Array.from(map.values());
}
 
// aggregate → one BP reading per day (latest)
function aggregateDaily(points: BPPoint[]) {
  const map = new Map<string, BPPoint>();
 
  for (const p of points) {
    const dayKey = new Date(p.ts).toISOString().slice(0, 10);
    const prev = map.get(dayKey);
    if (!prev || p.ts > prev.ts) {
      map.set(dayKey, p);
    }
  }
 
  return Array.from(map.values()).sort((a, b) => a.ts - b.ts);
}
 
/* ================= HOOK ================= */
 
export function useBP(
  deviceId?: string,
  defaultRange: BPRange = "1d"
) {
  const [range, setRange] = useState<BPRange>(defaultRange);
  const [points, setPoints] = useState<BPPoint[]>([]);
  const [latest, setLatest] = useState<BPPoint | null>(null);
  const [loadingBP, setLoadingBP] = useState(true);
  const [infoMessage, setInfoMessage] = useState("");
 
  useEffect(() => {
    if (!deviceId) {
      setPoints([]);
      setLatest(null);
      setLoadingBP(false);
      return;
    }
 
    let alive = true;
 
    const fetchData = async () => {
      try {
        const days = getFetchDays(range);
        const now = Date.now();
 
        const res = await api<BPHistoryItem[]>(
          `/vitals/bp/history?deviceId=${deviceId}&days=${days}`
        );
 
        if (!alive) return;
 
        if (!res?.length) {
          setPoints([]);
          setLatest(null);
          setInfoMessage("No BP data available");
          return;
        }
 
        const deduped = dedupeByMeasuredAt(res);
 
        const allPoints: BPPoint[] = deduped
          .map(item => ({
            ts: new Date(item.createdAt).getTime(),
            systolic: item.systolic,
            diastolic: item.diastolic,
            pulse: item.pulse,
          }))
          .sort((a, b) => a.ts - b.ts);
 
        setLatest(allPoints[allPoints.length - 1]);
 
        let chartPoints: BPPoint[] = [];
 
        if (["30m", "1h", "1d"].includes(range)) {
          chartPoints = allPoints.filter(
            p => p.ts >= now - getRangeMs(range)
          );
        } else if (range === "1w") {
          chartPoints = aggregateDaily(
            allPoints.filter(
              p => p.ts >= now - 7 * 24 * 60 * 60 * 1000
            )
          );
        } else if (range === "1m") {
          chartPoints = aggregateDaily(
            allPoints.filter(
              p => p.ts >= now - 30 * 24 * 60 * 60 * 1000
            )
          );
        }
 
        setPoints(chartPoints);
        setInfoMessage(
          chartPoints.length ? "" : "No BP data in this time range"
        );
      } finally {
        if (alive) setLoadingBP(false);
      }
    };
 
    setLoadingBP(true);
    fetchData();
 
    const interval = setInterval(fetchData, 15000);
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, [deviceId, range]);
 
  return {
    range,
    setRange,
    points,
    latest,
    loadingBP,
    infoMessage,
  };
}
 
 
 