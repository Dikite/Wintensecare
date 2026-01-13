const prisma = require('../../config/prisma');
const { computeECGSummary } = require('../../services/ecgSummary.service');

exports.createECG = async (req, res) => {
  console.log("BODY RECEIVED:", req.body);

  const { deviceId, signal, samplingRate, durationMs } = req.body;

  if (
    !deviceId ||
    !Array.isArray(signal) ||
    signal.length < 10 ||
    !samplingRate ||
    !durationMs
  ) {
    return res.status(400).json({ message: "Invalid ECG data" });
  }

  // 1️⃣ Save raw ECG
  await prisma.eCG.create({
    data: {
      deviceId,
      signal,
      samplingRate,
      durationMs
    }
  });

  // 2️⃣ Compute summary
  const summary = computeECGSummary(signal, samplingRate);

  // 3️⃣ Save summary
  await prisma.eCGSummary.create({
    data: {
      deviceId,
      window: "1m",
      avgHR: summary.avgHR,
      minHR: summary.minHR,
      maxHR: summary.maxHR,
      rrVar: summary.rrVar,
      pvcCount: summary.pvcCount,
      quality: summary.quality
    }
  });

  res.status(201).json({ message: "ECG stored & summarized" });
};

exports.getECGHistory = async (req, res) => {
  const { deviceId, limit = 5 } = req.query;

  const data = await prisma.eCG.findMany({
    where: { deviceId },
    orderBy: { createdAt: "desc" },
    take: Number(limit)
  });

  res.json(data);
};
