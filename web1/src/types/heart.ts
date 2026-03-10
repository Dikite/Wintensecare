export type TelemetryPoint = {
  ts: number; // backend timestamp (ms or ISO numeric)
  heartRate: number;
};

export type TelemetryResponse = {
  range: string;
  points: TelemetryPoint[];
  summary: {
    minHeartRate: number;
    avgHeartRate: number;
    maxHeartRate: number;
  };
};

export type Alert = {
  id: string;
  createdAt: string;
  severity: "CRITICAL" | "WARNING";
};

/* Range types */
export const ranges = [
  { label: "30M", value: "30m" },
  { label: "1H", value: "1h" },
  { label: "8H", value: "8h" },
  { label: "1D", value: "1d" },
  { label: "1W", value: "7d" },
] as const;

export type Range = (typeof ranges)[number]["value"];