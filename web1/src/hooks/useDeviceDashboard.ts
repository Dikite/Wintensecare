// hooks/useDeviceDashboard.ts
"use client";
 
import { useEffect, useState } from "react";
import { api } from "../lib/api/api";

export function useDeviceDashboard(deviceId?: string) {
  const [data, setData] = useState<any>(null);
 
  useEffect(() => {
    if (!deviceId) return;
 
    let alive = true;
 
    api(`/devices/${deviceId}/dashboard`).then(res => {
      if (alive) setData(res);
    });
 
    return () => {
      alive = false;
    };
  }, [deviceId]);
 
  return data;
}
 
 