export type TemperatureRange =
  | "30m"
  | "1h"
  | "8h"
  | "1d"
  | "1w"
 
 
export type TemperatureHistoryItem = {
  id: string;
  deviceId: string;
  value: number;
  unit: "C" | "F";
  measuredAt: string;
  createdAt: string;
};
 
export type TemperaturePoint = {
  ts: number;          // x-axis (measuredAt)
  value: number;
  measuredAt: number; // tooltip
};
 
 