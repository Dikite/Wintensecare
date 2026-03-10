export type TelemetryPoint = {
  ts: string; // ISO string or numeric string from backend
  steps: number;
};

export type TelemetryResponse = {
  range: string;
  points: TelemetryPoint[];
  summary: {
    steps: number;
  };
};

export const ranges = [
  { label: "30M", value: "30m" },
  { label: "1H", value: "1h" },
  { label: "8H", value: "8h" },
  { label: "1D", value: "1d" },
  { label: "1W", value: "7d" },
] as const;

export type Range = (typeof ranges)[number]["value"];