import prisma from '../../config/prisma.js';

const { eCGSummary } = prisma;

export async function getECGSummaryHistory(req, res) {
  try {
    const { deviceId, range = "1h" } = req.query;

    if (!deviceId) {
      return res.status(400).json({ message: "deviceId required" });
    }

    const now = new Date();

    const from =
      range === "30m" ? new Date(now - 30 * 60 * 1000) :
      range === "1h"  ? new Date(now - 60 * 60 * 1000) :
      range === "6h"  ? new Date(now - 6 * 60 * 60 * 1000) :
      new Date(now - 60 * 60 * 1000);

    const rows = await prisma.eCGSummary.findMany({
      where: {
        deviceId,
        measuredAt: { gte: from }
      },
      orderBy: { measuredAt: "asc" }
    });

    res.json({
      range,
      points: rows.map(r => ({
        ts: r.measuredAt,
        avgHR: r.avgHR,
        minHR: r.minHR,
        maxHR: r.maxHR,
        quality: r.quality
      }))
    });

  } catch (err) {
    console.error("ECG summary error:", err);
    res.status(500).json({
      message: "Failed to fetch ECG summary",
      error: err.message
    });
  }
}

