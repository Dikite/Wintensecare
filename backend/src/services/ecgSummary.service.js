// backend/src/services/ecgSummary.service.js

exports.computeECGSummary = (signal, samplingRate) => {
  if (!Array.isArray(signal) || signal.length < samplingRate) {
    return {
      avgHR: 0,
      minHR: 0,
      maxHR: 0,
      rrVar: 0,
      pvcCount: 0,
      quality: 0
    }
  }

  // 1️⃣ Normalize signal
  const abs = signal.map(v => Math.abs(v))
  const threshold = Math.max(...abs) * 0.6

  // 2️⃣ Detect peaks
  const peakIndices = []
  for (let i = 1; i < abs.length - 1; i++) {
    if (
      abs[i] > threshold &&
      abs[i] > abs[i - 1] &&
      abs[i] > abs[i + 1]
    ) {
      peakIndices.push(i)
    }
  }

  if (peakIndices.length < 2) {
    return {
      avgHR: 0,
      minHR: 0,
      maxHR: 0,
      rrVar: 0,
      pvcCount: 0,
      quality: 40
    }
  }

  // 3️⃣ RR intervals (seconds)
  const rrIntervals = []
  for (let i = 1; i < peakIndices.length; i++) {
    const diff = (peakIndices[i] - peakIndices[i - 1]) / samplingRate
    rrIntervals.push(diff)
  }

  // 4️⃣ Heart rate (BPM)
  const heartRates = rrIntervals.map(rr => Math.round(60 / rr))

  const avgHR = Math.round(
    heartRates.reduce((a, b) => a + b, 0) / heartRates.length
  )

  return {
    avgHR,
    minHR: Math.min(...heartRates),
    maxHR: Math.max(...heartRates),
    rrVar: Math.round(
      Math.sqrt(
        rrIntervals.reduce((a, b) => a + Math.pow(b - avgHR / 60, 2), 0) /
        rrIntervals.length
      ) * 1000
    ),
    pvcCount: 0,
    quality: 75
  }
}
