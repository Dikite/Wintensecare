export type Severity = "normal" | "warning" | "critical";
 
export function getVitalSeverity(type: string, value: number): Severity {
  switch (type) {
    case "hr":
      if (value > 120 || value < 40) return "critical";
      if (value > 100) return "warning";
      return "normal";
 
    case "spo2":
      if (value < 90) return "critical";
      if (value < 95) return "warning";
      return "normal";
 
    case "temp":
      if (value > 38.5) return "critical";
      if (value > 37.5) return "warning";
      return "normal";
 
    case "stress":
      if (value > 85) return "critical";
      if (value > 60) return "warning";
      return "normal";
 
    default:
      return "normal";
  }
}
 
 