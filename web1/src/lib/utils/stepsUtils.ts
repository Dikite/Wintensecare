import type { TelemetryPoint, Range } from "@/types/steps";

/* Convert range -> milliseconds */
export function getRangeMs(range: Range): number {
  switch (range) {
    case "30m":
      return 30 * 60 * 1000;
    case "1h":
      return 60 * 60 * 1000;
    case "8h":
      return 8 * 60 * 60 * 1000;
    case "1d":
      return 24 * 60 * 60 * 1000;
    case "7d":
      return 7 * 24 * 60 * 60 * 1000;
    default:
      return 60 * 60 * 1000;
  }
}

/* Group raw telemetry points into hourly buckets (00:00 - 23:00).
   Returns array of { hour: "HH:00", steps } */
export function groupStepsByHour(points: TelemetryPoint[]) {
  const hours = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, "0")}:00`,
    steps: 0,
  }));

  points.forEach((p) => {
    const d = new Date(p.ts);
    const hr = d.getHours();
    hours[hr].steps += p.steps;
  });

  return hours;
}

/* Convert steps -> distance (km) and calories (kcal).
   These conversion factors are approximate and can be adjusted. */
export function stepsToDistanceKm(steps: number) {
  // avg step length ~0.8m → 0.0008 km per step
  return Number((steps * 0.0008).toFixed(2));
}

export function stepsToCalories(steps: number) {
  // rough: 0.04 kcal per step
  return Number((steps * 0.04).toFixed(1));
}

export function groupStepsByMinute(points: { ts: string; steps: number }[], range: "30m" | "1h") {
  const now = new Date();
  const minutes = range === "30m" ? 30 : 60;

  const buckets = Array.from({ length: minutes }, (_, i) => {
    const d = new Date(now.getTime() - (minutes - i - 1) * 60000);

    return {
      minute: d.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      steps: 0,
      ts: d.getTime(),
    };
  });

  points.forEach((p) => {
    const pt = new Date(p.ts).getTime();

    buckets.forEach((b) => {
      const bucketEnd = b.ts + 60000;

      if (pt >= b.ts && pt < bucketEnd) {
        b.steps += p.steps;
      }
    });
  });

  return buckets.map(({ minute, steps }) => ({ minute, steps }));
}
