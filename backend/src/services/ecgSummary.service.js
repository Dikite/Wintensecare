// backend/src/services/ecgSummary.service.js

export function computeECGSummary(signal, samplingRate) {
  if (!signal || signal.length < samplingRate * 2) {
    return {
      avgHR: 0,
      minHR: 0,
      maxHR: 0,
      rrVar: 0,
      pvcCount: 0,
      quality: 30
    };
  }

  // TEMP: simple peak spacing with refractory
  const peaks = [];
  const threshold = 0.6; // mV
  const refractory = Math.floor(0.25 * samplingRate);

  for (let i = 1; i < signal.length - 1; i++) {
    if (
      signal[i] > threshold &&
      signal[i] > signal[i - 1] &&
      signal[i] > signal[i + 1] &&
      (peaks.length === 0 || i - peaks.at(-1) > refractory)
    ) {
      peaks.push(i);
    }
  }

  if (peaks.length < 2) {
    return { avgHR: 0, minHR: 0, maxHR: 0, rrVar: 0, pvcCount: 0, quality: 40 };
  }

  const rr = peaks.slice(1).map((p, i) => (p - peaks[i]) / samplingRate);
  const hr = rr.map(r => Math.round(60 / r));

  return {
    avgHR: Math.round(hr.reduce((a, b) => a + b, 0) / hr.length),
    minHR: Math.min(...hr),
    maxHR: Math.max(...hr),
    rrVar: 0,
    pvcCount: 0,
    quality: 60
  };
}
