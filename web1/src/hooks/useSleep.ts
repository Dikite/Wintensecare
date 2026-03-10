"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api/api";
import type { SleepRange, SleepSession } from "@/types/sleep";

const rangeToDays = (range: SleepRange): number => {
  switch (range) {
    case "1d": return 1;
    case "1w": return 7;
    case "2w": return 14;
    case "1m": return 30;
    default: return 7;
  }
};

export function useSleep(
  deviceId?: string,
  initialRange: SleepRange = "1w"
) {
  const [rangeSleep, setRangeSleep] = useState<SleepRange>(initialRange);
  const [sleepSessions, setSleepSessions] = useState<SleepSession[]>([]);
  const [loadingSleep, setLoadingSleep] = useState(false);

  const load = useCallback(async () => {
    if (!deviceId) return;

    try {
      setLoadingSleep(true);
      const days = rangeToDays(rangeSleep);

      const res = await api<SleepSession[]>(
        `/api/sleep/history?deviceId=${deviceId}&days=${days}`
      );

      setSleepSessions(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error("Sleep fetch error:", e);
      setSleepSessions([]);
    } finally {
      setLoadingSleep(false);
    }
  }, [deviceId, rangeSleep]);

  // ✅ RESET ON DEVICE CHANGE
  useEffect(() => {
    if (!deviceId) {
      setSleepSessions([]);
      setLoadingSleep(false);
      return;
    }
    load();
  }, [deviceId, load]);

  // ✅ NORMALIZE LATEST SLEEP (FOR DONUT)
  const latestRaw =
    sleepSessions.length > 0
      ? sleepSessions[sleepSessions.length - 1]
      : null;

  const latestSleep: SleepSession | null = latestRaw
    ? (() => {
        const total = latestRaw.totalMinutes || 0;

        if (
          latestRaw.deepMinutes ||
          latestRaw.lightMinutes ||
          latestRaw.remMinutes ||
          latestRaw.awakeMinutes
        ) {
          return latestRaw;
        }

        const deep = Math.round(total * 0.25);
        const light = Math.round(total * 0.45);
        const rem = Math.round(total * 0.2);
        const awake = Math.max(0, total - deep - light - rem);

        return {
          ...latestRaw,
          deepMinutes: deep,
          lightMinutes: light,
          remMinutes: rem,
          awakeMinutes: awake,
        };
      })()
    : null;

  return {
    rangeSleep,
    setRangeSleep,
    sleepSessions,
    latestSleep,
    loadingSleep,
    reloadSleep: load,
  } as const;
}
