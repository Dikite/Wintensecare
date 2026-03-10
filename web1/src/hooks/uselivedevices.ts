"use client";
 
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api/api";
 
/* ======================================================
   TYPES
====================================================== */
 
export type LiveDevice = {
  deviceId: string;
  deviceName: string;
 
  heartRate: number | null;
  heartRateAt: string | null;
 
  spo2: number | null;
  spo2At: string | null;
 
  systolic: number | null;
  diastolic: number | null;
  bpAt: string | null;
 
  temperature: number | null;
  temperatureAt: string | null;
 
  stress: number | null;
  stressAt: string | null;
};
 
/* ======================================================
   HOOK
====================================================== */
 
export function useLiveDevices() {
  const [devices, setDevices] = useState<LiveDevice[]>([]);
 
  const activeRef = useRef(true);
 
  // keeps stable device objects
  const deviceMapRef = useRef<Record<string, LiveDevice>>({});
 
  useEffect(() => {
    activeRef.current = true;
 
    async function load() {
      try {
        const incoming = await api<LiveDevice[]>("/live");
        if (!activeRef.current) return;
 
        const map = deviceMapRef.current;
 
        /* ---------------- MERGE DEVICES ---------------- */
        incoming.forEach((d) => {
          const existing = map[d.deviceId];
 
          if (!existing) {
            // new device
            map[d.deviceId] = { ...d };
          } else {
            // mutate existing object (keeps identity)
            Object.assign(existing, d);
          }
        });
 
        /* ---------------- REMOVE DEAD DEVICES ---------------- */
        Object.keys(map).forEach((id) => {
          if (!incoming.find((d) => d.deviceId === id)) {
            delete map[id];
          }
        });
 
        /* ⭐ CRITICAL FIX
           create NEW ARRAY reference
           so React effects re-run (ECG depends on this)
        */
        setDevices([...Object.values(map)]);
 
      } catch (err) {
        console.error("Live devices fetch failed:", err);
      }
    }
 
    load();
 
    const interval = setInterval(load, 2000);
 
    return () => {
      activeRef.current = false;
      clearInterval(interval);
    };
  }, []);
 
  return devices;
}
 