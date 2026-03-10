import prisma from "../../config/prisma.js";
import { computeECGSummary } from "../../services/ecgSummary.service.js";
import { normalizeECG } from "../../utils/ecgNormalize.js";
import { io } from "../../server.js";

const { eCG, eCGSummary } = prisma;

const FIVE_MIN = 5 * 60 * 1000;

export async function createECG(req, res) {
  try {
    const { deviceId, signal, samplingRate, durationMs, measuredAt } = req.body;

    if (
      !deviceId ||
      !Array.isArray(signal) ||
      signal.length < 10 ||
      !samplingRate ||
      !durationMs ||
      !measuredAt
    ) {
      return res.status(400).json({ message: "Invalid ECG data" });
    }

    const measuredTime = new Date(measuredAt);

    if (isNaN(measuredTime.getTime())) {
      return res.status(400).json({ message: "Invalid measuredAt" });
    }

    const now = Date.now();
    const ALLOW_DRIFT = 5 * 1000;

    // 🚫 future timestamps
    if (measuredTime.getTime() > now + ALLOW_DRIFT) {
      return res.status(400).json({
        message: "Future timestamps not allowed",
      });
    }



    // normalize
    const normalizedSignal = normalizeECG(signal);
    const summary = computeECGSummary(normalizedSignal, samplingRate);

    // ✅ store ECG
    const ecgRow = await prisma.eCG.create({
      data: {
        deviceId,
        lead: "I",
        unit: "mV",
        samplingRate,
        paperSpeed: 25,
        gain: 10,
        signal: normalizedSignal,
        durationMs,
        quality: summary.quality,
        measuredAt: measuredTime,
      },
    });

    // summary
    await prisma.eCGSummary.create({
      data: {
        deviceId,
        window: "1m",
        avgHR: summary.avgHR,
        minHR: summary.minHR,
        maxHR: summary.maxHR,
        rrVar: summary.rrVar,
        pvcCount: summary.pvcCount,
        quality: summary.quality,
        measuredAt: measuredTime,
      },
    });

    // 🧹 delete ECG older than 5 min
    await prisma.eCG.deleteMany({
      where: {
        deviceId,
        measuredAt: {
          lt: new Date(now - FIVE_MIN),
        },
      },
    });

    // 🔥 emit live only if fresh
    io.to(deviceId).emit("ecg-update", {
      signal: normalizedSignal,
      samplingRate,
      durationMs,
      avgHR: summary.avgHR,
      measuredAt: measuredTime,
    });

    res.status(201).json({ message: "ECG stored & streamed" });
  } catch (err) {
    console.error("ECG error:", err);
    res.status(500).json({ message: "ECG failed", error: err.message });
  }
}




export async function getECGHistory(req, res) {
  try {
    const { deviceId, limit = 5 } = req.query;

    const data = await eCG.findMany({
      where: { deviceId },
      orderBy: { measuredAt: "desc" },

      take: Number(limit),
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
}


export async function getLatestECG(req, res) {
  const { deviceId } = req.params;

  const ecg = await prisma.eCG.findFirst({
    where: { deviceId },
  orderBy: { measuredAt: "desc" }

  });

  res.json(ecg);
}
