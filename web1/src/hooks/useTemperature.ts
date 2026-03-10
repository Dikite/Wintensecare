"use client";
 
import { useEffect, useState } from "react";
import { api } from "@/lib/api/api";
import type {
  TemperatureHistoryItem,
  TemperaturePoint,
  TemperatureRange,
} from "@/types/temperature";
import { aggregateTemperatureByRange } from "@/lib/utils/temperatureUtils";
 
function rangeToBackend(range: TemperatureRange) {
  return range === "1w" ? "7d" : range;
}
 
function normalizeTemperature(
  items: TemperatureHistoryItem[]
): TemperaturePoint[] {
  const map = new Map<string, TemperatureHistoryItem>();
 
  for (const item of items) {
    const prev = map.get(item.measuredAt);
    if (!prev || new Date(item.createdAt) > new Date(prev.createdAt)) {
      map.set(item.measuredAt, item);
    }
  }
 
  return Array.from(map.values())
    .map(item => ({
      ts: new Date(item.measuredAt).getTime(),
      measuredAt: new Date(item.measuredAt).getTime(),
      value: item.value,
    }))
    .sort((a, b) => a.ts - b.ts);
}
 
export function useTemperature(
  deviceId?: string,
  initialRange: TemperatureRange = "1h"
) {
  const [rangeTemp, setRangeTemp] =
    useState<TemperatureRange>(initialRange);
 
  const [points, setPoints] = useState<TemperaturePoint[]>([]);
  const [latestTemp, setLatestTemp] =
    useState<TemperaturePoint | null>(null);
 
  const [loadingTemp, setLoadingTemp] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
 
  useEffect(() => {
    if (!deviceId) return;
 
    let alive = true;
 
    const fetchData = async () => {
      try {
        // only show big loading on first load
        if (initialLoad) setLoadingTemp(true);
 
        const res = await api<{
          success: boolean;
          data: TemperatureHistoryItem[];
        }>(
          `/api/temperature?deviceId=${deviceId}&range=${rangeToBackend(
            rangeTemp
          )}`
        );
 
        if (!alive) return;
 
       let items: TemperatureHistoryItem[] = [];
 
if (Array.isArray(res?.data)) {
  items = res.data;
} else if (res?.data) {
  items = [res.data]; // wrap single object into array
}
        if (!items.length) {
          setPoints([]);
          setLatestTemp(null);
          return;
        }
 
        const normalized = normalizeTemperature(items);
 
 
const aggregated = aggregateTemperatureByRange(
  normalized,
  rangeTemp
);
 
setPoints(aggregated);
 
// latest value
const latest =
  aggregated.length
    ? normalized
        .filter(p => p.ts >= aggregated[0].ts)
        .sort((a, b) => b.ts - a.ts)[0]
    : null;
 
setLatestTemp(latest ?? null);
 
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) {
          setLoadingTemp(false);
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
  }, [deviceId, rangeTemp]);
 
  return {
    rangeTemp,
    setRangeTemp,
    points,
    latestTemp,
    loadingTemp,
    initialLoad,
  };
}
 
 