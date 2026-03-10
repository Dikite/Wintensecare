import prisma from "../../config/prisma.js";


export const insertGlucose = async (req, res) => {
  try {
    const {
      deviceId,
      glucose,
      measuredAt,
      unit = "mg/dL",
      mealContext = null,
      source = "DEVICE",
    } = req.body;

    const userId = req.user.id;

    if (!deviceId || glucose == null) {
      return res.status(400).json({ error: "deviceId and glucose required" });
    }

    const value = Number(glucose);
    if (isNaN(value)) {
      return res.status(400).json({ error: "Invalid glucose value" });
    }

    if (value < 20 || value > 600) {
      return res.status(400).json({ error: "Glucose out of range" });
    }

    if (!["mg/dL", "mmol/L"].includes(unit)) {
      return res.status(400).json({ error: "Invalid unit" });
    }

    const device = await prisma.device.findFirst({
      where: { id: deviceId, userId },
    });

    if (!device) {
      return res.status(403).json({ error: "Invalid device" });
    }

    // 🔒 timestamp validation
    let measuredTime = measuredAt ? new Date(measuredAt) : new Date();

    if (isNaN(measuredTime.getTime())) {
      return res.status(400).json({ error: "Invalid measuredAt" });
    }

    const now = Date.now();
    const ALLOW_DRIFT = 5 * 1000; // 5 sec tolerance

    if (measuredTime.getTime() > now + ALLOW_DRIFT) {
      return res.status(400).json({
        error: "Future timestamps are not allowed",
      });
    }

    const row = await prisma.glucoseReading.create({
      data: {
        deviceId,
        userId,
        glucose: value,
        unit,
        mealContext,
        source,
        measuredAt: measuredTime,
      },
    });

    res.json(row);
  } catch (e) {
    console.error("insert glucose error", e);
    res.status(500).json({ error: "insert failed" });
  }
};


export const getLatestGlucose = async (req, res) => {
  try {
    const { deviceId } = req.query;
    const userId = req.user.id;

    if (!deviceId) {
      return res.status(400).json({ error: "deviceId required" });
    }

    const row = await prisma.glucoseReading.findFirst({
      where: {
        deviceId,
        userId,
      },
      orderBy: { measuredAt: "desc" },
    });

    res.json(row);
  } catch (e) {
    res.status(500).json({ error: "fetch failed" });
  }
};

export const getGlucoseHistory = async (req, res) => {
  try {
    const { deviceId, days = 1 } = req.query;
    const userId = req.user.id;

    if (!deviceId) {
      return res.status(400).json({ error: "deviceId required" });
    }

    const since = new Date();
    since.setDate(since.getDate() - Number(days));

    const rows = await prisma.glucoseReading.findMany({
      where: {
        deviceId,
        userId,
        measuredAt: { gte: since },
      },
      orderBy: { measuredAt: "asc" },
    });

    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "fetch failed" });
  }
};
