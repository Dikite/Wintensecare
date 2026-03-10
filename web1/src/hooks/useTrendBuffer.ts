"use client";
 
import { useEffect, useRef, useState } from "react";
 
type Point = { t: number; v: number };
 
const MAX_POINTS = 40;
const TICK_MS = 1000;
const BASELINE = 0;
 
export function useTrendBuffer(
  value: number | null,
  deviceId: string | null
) {
  const [data, setData] = useState<Point[]>([]);
  const lastValueRef = useRef<number | null>(null);
 
  /* ✅ RESET when device changes */
  useEffect(() => {
    lastValueRef.current = null;
 
    setData(
      Array.from({ length: MAX_POINTS }, (_, i) => ({
        t: i,
        v: BASELINE,
      }))
    );
  }, [deviceId]);
 
  /* store latest value */
  useEffect(() => {
    if (value != null) {
      lastValueRef.current = value;
    }
  }, [value]);
 
  /* timeline */
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const v =
          lastValueRef.current ??
          prev[prev.length - 1]?.v ??
          BASELINE;
 
        return [...prev.slice(1), { t: Date.now(), v }];
      });
    }, TICK_MS);
 
    return () => clearInterval(interval);
  }, []);
 
  return data;
}
 