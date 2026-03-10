import type { SleepSession, SleepRange } from "@/types/sleep";

export function rangeToDays(range: SleepRange) {
  if (range === "1d") return 1;
  if (range === "1w") return 7;
  if (range === "2w") return 14;
  return 30; // 1m
}

function dateKey(d: Date) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function buildMonthlyGroupedBars(sessions: SleepSession[]) {
  // group by week number (last 30 days)
  const map = new Map<string, { deep: number; light: number; rem: number; awake: number; total: number }>();

  for (const s of sessions) {
    const d = new Date(s.startTime);
    const weekKey = `W${Math.ceil(d.getDate() / 7)}`; // W1..W5

    const prev = map.get(weekKey) || { deep: 0, light: 0, rem: 0, awake: 0, total: 0 };

    map.set(weekKey, {
      deep: prev.deep + (s.deepMinutes || 0),
      light: prev.light + (s.lightMinutes || 0),
      rem: prev.rem + (s.remMinutes || 0),
      awake: prev.awake + (s.awakeMinutes || 0),
      total: prev.total + (s.totalMinutes || 0),
    });
  }

  return Array.from(map.entries()).map(([label, v]) => ({
    key: label,
    label,
    deep: v.deep,
    light: v.light,
    rem: v.rem,
    awake: v.awake,
    total: v.total,
  }));
}

export function buildFixedSleepBars(
  sessions: SleepSession[],
  range: SleepRange
) {
  const days = rangeToDays(range);

  // group sessions by date (based on startTime date)
  const map = new Map<string, SleepSession>();

  for (const s of sessions) {
    const d = new Date(s.startTime);
    map.set(dateKey(d), s);
  }

  // build last N days ending today
  const out: Array<{
    key: string;
    label: string;
    deep: number;
    light: number;
    rem: number;
    awake: number;
    total: number;
    startTime?: string;
    endTime?: string;
  }> = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    const key = dateKey(d);
    const s = map.get(key);

    const label =
      range === "1w"
        ? d.toLocaleDateString("en-US", { weekday: "short" }) // Sun Mon...
        : d.toLocaleDateString("en-US", { month: "short", day: "numeric" }); // Jan 22

    out.push({
      key,
      label,
      deep: s?.deepMinutes ?? 0,
      light: s?.lightMinutes ?? 0,
      rem: s?.remMinutes ?? 0,
      awake: s?.awakeMinutes ?? 0,
      total: s?.totalMinutes ?? 0,
      startTime: s?.startTime,
      endTime: s?.endTime,
    });


    
  }

  return out;
}
