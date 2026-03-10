"use client";
 
import { useEffect, useState } from "react";
import { api } from "@/lib/api/api";
import type {
  StressHistoryItem,
  StressPoint,
  StressRange,
} from "@/types/stress";
import { buildStressPoints } from "@/lib/utils/stressUtils";
 
export function useStress(
  deviceId?: string,
  defaultRange: StressRange = "1d"
) {
  const [range, setRange] = useState<StressRange>(defaultRange);
  const [points, setPoints] = useState<StressPoint[]>([]);
  const [latest, setLatest] = useState<StressPoint | null>(null);
  const [loading, setLoading] = useState(true);
  const [infoMessage, setInfoMessage] = useState("");
 
  useEffect(() => {
    if (!deviceId) {
      setLoading(false);
      setPoints([]);
      setLatest(null);
      setInfoMessage("No device selected");
      return;
    }
 
    let alive = true;
 
    const fetchData = async () => {
      try {
        const res = await api<StressHistoryItem[]>(
          `/api/stress/history?deviceId=${deviceId}&range=${range}`
        );
 
        if (!alive) return;
 
        if (!res || res.length === 0) {
          setPoints([]);
          setLatest(null);
          setInfoMessage("No stress data available");
          return;
        }
 
        /* ---------- normalize ---------- */
        const normalized = res.map((r) => {
  const ts = new Date(r.createdAt).getTime();
 
  return {
    ts,
    value: r.value,
    level: r.level,
  };
});
 
        normalized.sort((a, b) => a.ts - b.ts);
 
        /* ---------- range filter ---------- */
     const processed = buildStressPoints(normalized, range);
 
setPoints(processed);
 
// latest actual measurement (not aggregated)
const latestActual = normalized.length
  ? {
      ...normalized[normalized.length - 1],
      label: new Date(normalized[normalized.length - 1].ts).toLocaleTimeString(
        "en-GB",
        { hour: "2-digit", minute: "2-digit", hour12: false }
      ),
    }
  : null;
 
setLatest(latestActual);
 
setInfoMessage(processed.length ? "" : "No data in this range");
 
setInfoMessage(processed.length ? "" : "No data in this range");
      } catch (err) {
        console.error("Stress fetch error", err);
        setInfoMessage("Failed to load stress data");
      } finally {
        if (alive) setLoading(false);
      }
    };
 
    setLoading(true);
    setPoints([]);
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
    infoMessage,
  };
}
 
 