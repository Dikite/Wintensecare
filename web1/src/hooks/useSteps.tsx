"use client";
 
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api/api";
import type { TelemetryResponse, Range } from "@/types/steps";
import { getRangeMs, groupStepsByHour,
  groupStepsByMinute } from "@/lib/utils/stepsUtils";
 
export function useSteps(
  deviceId?: string,
  initialRange: Range = "1h"
) {
  const [rangestep, setRangestep] = useState<Range>(initialRange);
  const [data, setData] = useState<TelemetryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialLoad, setInitialLoad] = useState(true);
 
  const load = useCallback(async () => {
    if (!deviceId) return;
 
    try {
      if (!initialLoad) setLoading(true);
 
      const res = await api<any[]>(`/telemetry?deviceId=${deviceId}`);
 
      const now = Date.now();
      const windowMs = getRangeMs(rangestep);
 
      let points = (res || [])
        .map((p) => ({
          ts: p.measuredAt,
          steps: typeof p.steps === "number" ? p.steps : 0,
        }))
        .sort(
          (a, b) =>
            new Date(a.ts).getTime() - new Date(b.ts).getTime()
        );
 
     if (rangestep === "1d") {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
 
  points = points.filter(
    (p) => new Date(p.ts) >= startOfToday
  );
} else if (rangestep !== "7d") {
  points = points.filter(
    (p) =>
      new Date(p.ts).getTime() >= now - windowMs
  );
}
 
      const totalSteps = points.reduce(
        (sum, p) => sum + p.steps,
        0
      );
 
      setData({
        range: rangestep,
        points,
        summary: { steps: totalSteps },
      } as TelemetryResponse);
    } catch (e) {
      console.error("useSteps.load:", e);
      setData(null);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [deviceId, rangestep, initialLoad]);
 
  useEffect(() => {
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, [load]);
 
  const points = data?.points ?? [];
  const totalSteps = data?.summary?.steps ?? 0;
 
 const minuteData =
  rangestep === "30m" || rangestep === "1h"
    ? groupStepsByMinute(points, rangestep).filter(p => p.steps > 0)
    : [];
 
const hourlyData =
  rangestep === "8h" || rangestep === "1d"
    ? groupStepsByHour(points)
    : [];
 
  const startTime =
    points.length > 0
      ? new Date(points[0].ts).toLocaleTimeString("en-GB", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--";
 
  const endTime =
    points.length > 0
      ? new Date(
          points[points.length - 1].ts
        ).toLocaleTimeString("en-GB", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--";
 
      const latestTs =
  points.length > 0
    ? points[points.length - 1].ts
    : null;
     
 
  return {
    rangestep,
    setRangestep,
    data,
    points,
    totalSteps,
    loading,
    initialLoad,
    startTime,
    endTime,
    latestTs,
    minuteData,  
  hourlyData,  
 
  } as const;
}
 
 