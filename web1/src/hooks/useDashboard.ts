"use client";
 
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "@/navigation";
import { api } from "@/lib/api/api";
import { clearToken } from "@/lib/api/auth";
import type {
  User,
  Device,
  TelemetryItem,
  LatestTelemetry,
  Alert,
  ECGSession,
} from "@/types/dashboard";
import { getLatestTelemetry } from "@/lib/utils/getLatestTelemetry";
 
 
 
export function useDashboard()  {
  const router = useRouter();
 
  const [user, setUser] = useState<User | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
  const [latestTelemetry, setLatestTelemetry] =
    useState<LatestTelemetry | null>(null);
  const [dailySteps, setDailySteps] = useState<number | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuView, setMenuView] = useState<"user" | "device">("user");
  const [avgHeartRate1h, setAvgHeartRate1h] = useState<number | null>(null);
  const [currentECG, setCurrentECG] = useState<number | null>(null);
  const [latestECGTime, setLatestECGTime] = useState<string | null>(null);
 
  const [devices, setDevices] = useState<Device[]>([]);
 
  // deviceId debug
  useEffect(() => {
    const did = typeof window !== "undefined" && localStorage.getItem("deviceId");
    if (!did) {
      console.warn("⚠️ deviceId missing – dashboard will be empty");
    } else {
      console.log("✅ deviceId found:", did);
    }
  }, []);
 
  // clock
  const [currentTime, setCurrentTime] = useState<string>(() =>
    new Date().toLocaleTimeString()
  );
  useEffect(() => {
    const t = setInterval(
      () => setCurrentTime(new Date().toLocaleTimeString()),
      1000
    );
    return () => clearInterval(t);
  }, []);
  const currentDate = new Date().toLocaleDateString();
 
  // init
  useEffect(() => {
    let mounted = true;
 
    async function init() {
      try {
        const me = await api<User>("/users/me");
        if (!mounted) return;
        setUser(me);
 
        const devicesRes = await api<Device[]>("/devices");
        setDevices(devicesRes);
 
        // read stored deviceId
        let did = typeof window !== "undefined" && localStorage.getItem("deviceId");
 
        // no devices
        if (devicesRes.length === 0) {
          console.warn("⚠️ No devices found for this user");
          setDevice(null);
          setLatestTelemetry(null);
          return;
        }
 
        // choose device if missing or invalid
        const deviceExists = devicesRes.some((d) => d.id === did);
 
        if (!did || !deviceExists) {
          did = devicesRes[0].id;
          localStorage.setItem("deviceId", did);
        }
 
        const selectedDevice = devicesRes.find((d) => d.id === did) || null;
        setDevice(selectedDevice);
 
       
 
 
        const alertsRes = await api<Alert[]>("/alerts");
        setAlerts(alertsRes);
      } catch (err) {
        clearToken();
        router.replace("/login");
      }
    }
 
    init();
 
    return () => {
      mounted = false;
    };
  }, [router]);
 
  // refresh function (exposed and used by interval)
  const refreshLiveData = useCallback(async () => {
  if (!device?.id) return;
 
  try {
    const history = await api<TelemetryItem[]>(
      `/telemetry?deviceId=${device.id}`
    );
 
    const latest = getLatestTelemetry(history);
    setLatestTelemetry(latest as LatestTelemetry | null);
 
    const alertsRes = await api<Alert[]>("/alerts");
 
    setAlerts(
      alertsRes.filter(
        (a) => !a.acknowledged && a.deviceId === device.id
      )
    );
 
  } catch (e) {
    console.error("Live refresh failed", e);
  }
}, [device?.id]);
 
useEffect(() => {
  if (!device?.id) return;
 
  async function loadDeviceData() {
    try {
      const did = device.id;
 
      const history = await api<TelemetryItem[]>(
        `/telemetry?deviceId=${did}`
      );
      const latest = getLatestTelemetry(history);
      setLatestTelemetry(latest as LatestTelemetry | null);
 
      const hrSummary = await api<{
        summary: { avgHeartRate: number };
      }>(`/telemetry/history?deviceId=${did}&range=1h`);
 
      setAvgHeartRate1h(hrSummary.summary.avgHeartRate);
 
      const stepsRes = await api<{ summary: { steps: number } }>(
        `/telemetry/history?deviceId=${did}&range=1d`
      );
 
      setDailySteps(stepsRes.summary.steps);
 
      const ecgSessions = await api<ECGSession[]>(
        `/vitals/ecg?deviceId=${did}`
      );
 
      const latestECG = ecgSessions
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )[0];
 
      const latestValue = latestECG?.signal.at(-1);
 
      setCurrentECG(latestValue ?? null);
      setLatestECGTime(latestECG?.createdAt ?? null);
 
      const alertsRes = await api<Alert[]>("/alerts");
 
      setAlerts(
        alertsRes.filter(
          (a) => !a.acknowledged && a.deviceId === did
        )
      );
 
    } catch (err) {
      console.error("Failed loading device data", err);
    }
  }
 
  loadDeviceData();
}, [device?.id]);
 
 
  // interval refresh when device changes
  useEffect(() => {
    if (!device?.id) return;
 
    const t = setInterval(() => {
      refreshLiveData();
    }, 15000);
 
    return () => clearInterval(t);
  }, [device?.id, refreshLiveData]);
 
  // actions
  async function acknowledgeAlert(id: string) {
    await api(`/alerts/${id}/ack`, { method: "POST" });
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  }
 
  async function logout() {
    try {
      await api("/auth/logout", { method: "POST" });
    } catch {}
    clearToken();
    if (typeof window !== "undefined") localStorage.removeItem("deviceId");
 
    // stop dashboard activity
    setDevice(null);
    setLatestTelemetry(null);
    setAlerts([]);
 
    router.replace("/login");
  }
 
  const activeAlerts = alerts.filter((a) => !a.acknowledged);
  const vitalAlerts = activeAlerts.filter(
    (a) => a.metric === "HEART_RATE" || a.metric === "BATTERY"
  );
 
 
 
  return {
    // state
    user,
    device,
    devices,
    latestTelemetry,
    dailySteps,
    alerts,
    menuOpen,
    menuView,
    avgHeartRate1h,
    currentECG,
    latestECGTime,
    currentTime,
    currentDate,
   
    activeAlerts,
    vitalAlerts,
    // setters/actions
    setMenuOpen,
    setMenuView,
    acknowledgeAlert,
    logout,
    refreshLiveData,
    setDevice,
  } as const;
}
 
 