export type SpO2Range = "30m" | "1h" | "8h" | "1d" | "7d";
 
export type SpO2Point = {
  ts: string;
  avg: number;
  min: number;
  max: number;
  drops: number;
};
 
 