const prisma = require('../../config/prisma');

exports.getECGSummaryHistory = async (req, res) => {
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
      createdAt: { gte: from }
    },
    orderBy: { createdAt: "asc" }
  });

  res.json({
    range,
    points: rows.map(r => ({
      ts: r.createdAt,
      avgHR: r.avgHR,
      minHR: r.minHR,
      maxHR: r.maxHR,
      quality: r.quality
    }))
  });
};
