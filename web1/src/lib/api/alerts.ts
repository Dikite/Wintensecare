import { api } from "./api";
 
export interface Alert {
  id: string;
  deviceId: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  message?: string;
}
 
export const getAlerts = () =>
  api<Alert[]>("/alerts");
 
export const acknowledgeAlert = (alertId: string) =>
  api<void>(`/alerts/${alertId}/ack`, {
    method: "POST",
  });
 
 