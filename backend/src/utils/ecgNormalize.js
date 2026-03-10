// utils/ecgNormalize.js
export function normalizeECG(signal) {
  const MAX_MV = 2;   // hard medical limit
  const MIN_MV = -2;

  return signal.map(v => {
    if (typeof v !== "number" || isNaN(v)) return 0;
    return Math.max(MIN_MV, Math.min(MAX_MV, v));
  });
}
