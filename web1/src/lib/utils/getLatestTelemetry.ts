import type { TelemetryItem } from "@/types/dashboard";

export function getLatestTelemetry(history: TelemetryItem[] | undefined | null) {
  if (!history || !history.length) return null;

  return (
    history
      .slice()
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      .at(-1) ?? null
  );
}