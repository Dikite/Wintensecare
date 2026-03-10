import { api } from "@/lib/api/api";
 
/* ===== TYPES (copied exactly from your page) ===== */
 
export type User = {
  id?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
};
 
export type Device = {
  id: string;
  name: string;
  type: string;
  createdAt: string;
};
 
export type TelemetryItem = {
  id: string;
  deviceId: string;
  heartRate: number;
  steps: number;
  battery: number;
  createdAt: string;
};
 
export type Alert = {
  id: string;
  deviceId: string;
  metric: string;
  value: number;
  severity: "CRITICAL" | "WARNING";
  acknowledged: boolean;
  createdAt: string;
};
 
export type ECGSession = {
  id: string;
  deviceId: string;
  signal: number[];
  samplingRate: number;
  durationMs: number;
  createdAt: string;
};
 
/* ===== API FUNCTIONS ===== */
 
export const DashboardAPI = {
  getMe: () => api<User>("/users/me"),
 
  getDevices: () => api<Device[]>("/devices"),
 
  getTelemetry: (did: string) =>
    api<TelemetryItem[]>(`/telemetry?deviceId=${did}`),
 
  getHR1h: (did: string) =>
    api<{ summary: { avgHeartRate: number } }>(
      `/telemetry/history?deviceId=${did}&range=1h`
    ),
 
  getSteps1d: (did: string) =>
    api<{ summary: { steps: number } }>(
      `/telemetry/history?deviceId=${did}&range=1d`
    ),
 
  getECG: (did: string) =>
    api<ECGSession[]>(`/vitals/ecg?deviceId=${did}`),
 
  getAlerts: () => api<Alert[]>("/alerts"),
 
  acknowledgeAlert: (id: string) =>
    api(`/alerts/${id}/ack`, { method: "POST" }),
 
  logout: () =>
    api("/auth/logout", { method: "POST" }),
};
 
 