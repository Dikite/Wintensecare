export type Snapshot = {
  heartRate: number;
  spo2: number;
  systolic: number;
  diastolic: number;
  temperature: number;
  stress: number;
  measuredAt: string;
};
 
export type Point = {
  t: number;
  v: number;
};
 
 