"use client";
 
import { useEffect, useState } from "react";
import { api } from "@/lib/api/api";
import type {
  GlucoseHistoryItem,
  GlucosePoint,
  GlucoseRange,
} from "@/types/glucose";
import { getFetchDays, getRangeMs } from "@/lib/utils/glucoseRange";
 
export function useGlucose(
  deviceId?: string,
  defaultRange: GlucoseRange = "1h"
) {
  const [range, setRange] = useState<GlucoseRange>(defaultRange);
  const [points, setPoints] = useState<GlucosePoint[]>([]);
  const [latest, setLatest] = useState<GlucosePoint | null>(null);
 
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [infoMessage, setInfoMessage] = useState("");
 
  useEffect(() => {
    if (!deviceId) return;
 
    let alive = true;
 
    const fetchData = async () => {
      try {
        // only big loading first time
        if (initialLoad) setLoading(true);
 
        const days = getFetchDays(range);
        const now = Date.now();
 
        const res = await api<GlucoseHistoryItem[]>(
          `/vitals/glucose/history?deviceId=${deviceId}&days=${days}`
        );
 
        if (!alive) return;
 
        if (!res || res.length === 0) {
          setPoints([]);
          setLatest(null);
          setInfoMessage("No glucose data available");
          return;
        }
 
        const allPoints: GlucosePoint[] = res
          .map(r => ({
            ts: new Date(r.createdAt).getTime(),
            glucose: r.glucose,
          }))
          .sort((a, b) => a.ts - b.ts);
 
        
 
       let chartPoints: GlucosePoint[] = [];

if (range === "1d") {
  const nowDate = new Date();
  const todayStart = new Date(
    nowDate.getFullYear(),
    nowDate.getMonth(),
    nowDate.getDate()
  ).getTime();

  chartPoints = allPoints.filter(p => p.ts >= todayStart);
} else {
  const cutoff = now - getRangeMs(range);
  chartPoints = allPoints.filter(p => p.ts >= cutoff);
}

// ✅ IMPORTANT — update chart points
setPoints(chartPoints);

// ✅ Latest only inside selected range
setLatest(
  chartPoints.length
    ? chartPoints[chartPoints.length - 1]
    : null
);

setInfoMessage(
  chartPoints.length ? "" : "No glucose data in this range"
);
      } catch (err) {
        console.error(err);
      } finally {
        if (alive) {
          setLoading(false);
          setInitialLoad(false);
        }
      }
    };
 
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
    loading,
    initialLoad,
    infoMessage,
  };
}
 