export type SleepRange = "1d" | "1w" | "2w" | "1m";

export type SleepSession = {
  id: string;
  deviceId: string;
  startTime: string;
  endTime: string;
  totalMinutes: number;
  deepMinutes: number;
  lightMinutes: number;
  remMinutes: number;
  awakeMinutes: number;
  avgHR: number;
  avgSpO2: number;
  createdAt: string;
};
