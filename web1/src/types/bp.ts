export type BPPoint = {
  ts: number;
  systolic: number;
  diastolic: number;
  pulse: number;
};

export type BPResponse = {
  range: string;
  points: BPPoint[];
  summary: {
    minSystolic: number;
    avgSystolic: number;
    maxSystolic: number;

    minDiastolic: number;
    avgDiastolic: number;
    maxDiastolic: number;

    avgPulse: number;
  };
};

export type BPHistoryItem = {
  id: string;
  deviceId: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  measuredAt: string;
  createdAt: string;
};

/* Range types */
export const ranges = [
  { label: "30M", value: "30m" },
  { label: "1H", value: "1h" },
  { label: "1D", value: "1d" },
  { label: "1W", value: "1w" },
  { label: "1M", value: "1m" },
] as const;

export type BPRange = (typeof ranges)[number]["value"];
