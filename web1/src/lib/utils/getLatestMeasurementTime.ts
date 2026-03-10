export function getLatestMeasurementTime(
  ...times: (string | number | Date | null | undefined)[]
): Date | null {
  const timestamps = times
    .filter((t): t is string | number | Date => t !== null && t !== undefined)
    .map((t) => new Date(t).getTime())
    .filter((t) => !isNaN(t));

  if (timestamps.length === 0) return null;

  return new Date(Math.max(...timestamps));
}