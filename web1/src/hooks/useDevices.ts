import { useEffect, useState } from "react";
import { api } from "@/lib/api/api";
 
type Device = {
  id: string;
  name?: string;
};
 
export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    async function load() {
      try {
        const res = await api<Device[]>("/devices"); // ← typed
 
        setDevices(res ?? []);
      } catch (err) {
        console.error("Failed to load devices", err);
        setDevices([]);
      } finally {
        setLoading(false);
      }
    }
 
    load();
  }, []);
 
  return { devices, loading };
}
 
 