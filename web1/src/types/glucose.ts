export type GlucosePoint = {
  ts: number;          // chart timestamp
  glucose: number;
};

export type GlucoseHistoryItem = {
  id: string;
  deviceId: string;
  glucose: number;
  measuredAt: string;
  createdAt: string;
};

/* Ranges (BP-style) */
export const ranges = [
  { label: "30M", value: "30m" },
  { label: "1H", value: "1h" },
  { label: "8H", value: "8h" },
  { label: "1D", value: "1d" },
  { label: "1W", value: "1w" },
] as const;

export type GlucoseRange = (typeof ranges)[number]["value"];
