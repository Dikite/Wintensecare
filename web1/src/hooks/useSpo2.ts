"use client";
 
import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api/api";
import type { SpO2Point, SpO2Range } from "@/types/spo2";
 
export function useSpO2(
  deviceId?: string,
  defaultRange: SpO2Range = "1h"
) {
  const [rangeSpO2, setRangeSpO2] = useState<SpO2Range>(defaultRange);
  const [pointsspo2, setPointsspo2] = useState<SpO2Point[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [latestSpO2, setLatestSpO2] = useState<SpO2Point | null>(null);
 
  const aliveRef = useRef(true);
 
  useEffect(() => {
    if (!deviceId) return;
 
    aliveRef.current = true;
 
    const fetchData = async () => {
      try {
 
        if (initialLoad) setLoading(true);
 
        const res = await api<{ data: SpO2Point[] }>(
          `/vitals/spo2/raw?deviceId=${deviceId}&range=${rangeSpO2}`
        );
 
        if (!aliveRef.current) return;
 
       const points = (res.data || []).map((p: any) => ({
  ts: p.createdAt,
  avg: p.value,
  min: p.value,
  max: p.value,
  drops: 0
}));
 
        setPointsspo2(points);
 
        const latest = points.reduce((acc, p) => {
          if (!acc) return p;
          return new Date(p.ts).getTime() > new Date(acc.ts).getTime() ? p : acc;
        }, points[0] ?? null);
 
        setLatestSpO2(latest);
 
      } finally {
        if (!aliveRef.current) return;
        setLoading(false);
        setInitialLoad(false);
      }
    };
 
    fetchData();
 
    const interval = setInterval(fetchData, 15000);
 
    return () => {
      aliveRef.current = false;
      clearInterval(interval);
    };
 
  }, [deviceId, rangeSpO2]);
 
  return {
    rangeSpO2,
    setRangeSpO2,
    pointsspo2,
    loading,
    initialLoad,
    latestSpO2,
  };
}
 