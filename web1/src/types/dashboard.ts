export type User = {
  id?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
};
 
export type Device = {
  id: string;
  name: string;
  type: string;
  createdAt: string;
};
 
export type TelemetryItem = {
  id: string;
  deviceId: string;
  heartRate: number;
  steps: number;
  battery: number;
  createdAt: string;
   measuredAt: string;
};
 
export type LatestTelemetry = {
  deviceId: string;
  heartRate: number;
  steps: number;
  battery: number;
  createdAt: string;
   measuredAt: string;
};
 
export type Alert = {
  id: string;
  deviceId: string;
  metric: string;
  value: number;
  severity: "CRITICAL" | "WARNING";
  acknowledged: boolean;
  createdAt: string;
   measuredAt: string;
};
 
export type ECGSession = {
  id: string;
  deviceId: string;
  signal: number[];
  samplingRate: number;
  durationMs: number;
  createdAt: string;
   measuredAt: string;
};
 
 
export type SpO2Item = {
  id: string;
  deviceId: string;
  spo2: number;
  measuredAt: string;
};
 
export type BPItem = {
  id: string;
  deviceId: string;
  systolic: number;
  diastolic: number;
  measuredAt: string;
};
 
export type TemperatureItem = {
  id: string;
  deviceId: string;
  temperature: number;
  measuredAt: string;
};
 
export type StressItem = {
  id: string;
  deviceId: string;
  stressLevel: number;
  measuredAt: string;
};
 
export type GlucoseItem = {
  id: string;
  deviceId: string;
  glucose: number;
  measuredAt: string;
};
 
export type SleepSession = {
  id: string;
  deviceId: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  measuredAt: string;
};
 
 