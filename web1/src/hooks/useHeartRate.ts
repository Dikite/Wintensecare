"use client";
 
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api/api";
import type {
  TelemetryPoint,
  TelemetryResponse,
  Alert,
  Range,
} from "@/types/heart";
import { getRangeMs, aggregateHeartRateByRange } from "@/lib/utils/range";


export function useHeartRate(
  deviceId?: string,
  initialRange: Range = "1h"
) {
  const [range, setRange] = useState<Range>(initialRange);
  const [data, setData] = useState<TelemetryResponse | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [liveLatest, setLiveLatest] =
    useState<TelemetryPoint | undefined>();
 
  const bufferRef = useRef<TelemetryPoint[]>([]);
 
  const load = useCallback(async () => {
    try {
      if (!deviceId) return;
 
      const res = await api<TelemetryResponse>(
        `/telemetry/history?deviceId=${deviceId}&range=${range}`
      );
 
      const now = Date.now();
      const windowMs = getRangeMs(range);
 
      const incoming = (res.points || []).map((p) => ({
        ...p,
        ts: new Date(p.ts).getTime(),
      }));
 
      // 🔄 Merge + dedupe
      const merged = [...bufferRef.current, ...incoming]
        .filter(
          (p, i, arr) =>
            arr.findIndex((x) => x.ts === p.ts) === i
        )
        .filter((p) => p.ts >= now - windowMs)
        .sort((a, b) => a.ts - b.ts);
 
      bufferRef.current = merged;
 
      const processedPoints = aggregateHeartRateByRange(
  merged,
  range
);
 
      const values = processedPoints.map((p) => p.heartRate);
 
      setData({
        range,
        points: processedPoints,
        summary: values.length
          ? {
              minHeartRate: Math.min(...values),
              maxHeartRate: Math.max(...values),
              avgHeartRate: Math.round(
                values.reduce((a, b) => a + b, 0) /
                  values.length
              ),
            }
          : {
              minHeartRate: 0,
              maxHeartRate: 0,
              avgHeartRate: 0,
            },
      });
 
      const realLatest = merged.at(-1);
      setLiveLatest(realLatest);
 
   if (
  realLatest &&
  realLatest.heartRate > 120 &&
  !alerts.some(a => a.createdAt === new Date(realLatest.ts).toISOString())
) {
  setAlerts(prev => [
    ...prev,
    {
      id: crypto.randomUUID(),
      createdAt: new Date(realLatest.ts).toISOString(),
      severity: "CRITICAL",
    },
  ]);
}
    } catch {
      // silent fail
    }
  }, [deviceId, range]);
 
  // 🔥 Reset buffer when device changes
useEffect(() => {
  bufferRef.current = [];
  setData(null);
  setAlerts([]);
  setLiveLatest(undefined); // ✅ ADD THIS
}, [deviceId]);
 
  useEffect(() => {
    load();
    const timer = setInterval(load, 20000);
    return () => clearInterval(timer);
  }, [load]);
 
  const criticalAlertTimes = alerts
    .filter((a) => a.severity === "CRITICAL")
    .map((a) => new Date(a.createdAt).getTime());
 
  return {
    range,
    data,
    alerts,
    latest: liveLatest,
    criticalAlertTimes,
    setRange,
    reload: load,
  } as const;
}
 