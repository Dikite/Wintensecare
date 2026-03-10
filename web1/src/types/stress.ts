/* ================= RANGE TYPES ================= */

export const stressRanges = [
  { label: "30M", value: "30m" },
  { label: "1H", value: "1h" },
  { label: "8H", value: "8h" },
  { label: "1D", value: "1d" },
  { label: "1W", value: "1w" },
] as const;

export type StressRange = (typeof stressRanges)[number]["value"];

/* ================= API TYPES ================= */

export type StressHistoryItem = {
  id: string;
  deviceId: string;
  value: number;
  level: "LOW" | "MODERATE" | "HIGH";
  source: string | null;
  createdAt: string;
};

/* ================= CHART POINT ================= */

export type StressPoint = {
  ts: number;
  value?: number;
  level?: "LOW" | "MODERATE" | "HIGH";
  label: string;
};
