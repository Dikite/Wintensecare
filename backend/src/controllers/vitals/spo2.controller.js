import prisma from "../../config/prisma.js";
import { updateSnapshot } from "../../utils/updateSnapshot.js";


export const ingestSpO2 = async (req, res) => {
  try {
    const { deviceId, value, perfusion, measuredAt } = req.body;

    if (!deviceId || value == null)
      return res.status(400).json({ error: "Missing data" });

    if (value < 70 || value > 100)
      return res.status(400).json({ error: "Invalid SpO2 value" });

    if (perfusion != null && (perfusion < 0 || perfusion > 100))
      return res.status(400).json({ error: "Invalid perfusion value" });

    let measuredTime = measuredAt ? new Date(measuredAt) : null;

    // ✅ Validate timestamp if provided
    if (measuredTime) {
      if (isNaN(measuredTime.getTime())) {
        return res.status(400).json({ error: "Invalid measuredAt" });
      }

      const now = Date.now();
      const ALLOW_DRIFT = 5 * 1000; // 5 seconds tolerance

      if (measuredTime.getTime() > now + ALLOW_DRIFT) {
        return res.status(400).json({
          error: "Future timestamps are not allowed"
        });
      }
    }

    // ✅ Store sample
    await prisma.spO2Sample.create({
      data: {
        deviceId,
        value,
        perfusion,
        createdAt: measuredTime || undefined
      }
    });

    // 🔒 Freshness check (5 min)
    if (measuredTime) {
      const now = Date.now();
      const FIVE_MIN = 5 * 60 * 1000;

      if (now - measuredTime.getTime() <= FIVE_MIN) {
        await updateSnapshot(deviceId, {
          spo2: value,
          measuredAt: measuredTime
        });
      } else {
        console.log("Old SpO2 sync → skip live");
      }
    } else {
      // If no measuredAt, assume real-time
      await updateSnapshot(deviceId, {
        spo2: value
      });
    }

    res.json({ success: true });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal error" });
  }
};



export const getSpO2Raw = async (req, res) => {
  try {
    const { deviceId, range = "10m" } = req.query;

    if (!deviceId) {
      return res.status(400).json({ error: "deviceId required" });
    }

    const now = Date.now();
    let from;

    switch (range) {
      case "30m":
        from = now - 30 * 60 * 1000;
        break;

      case "1h":
        from = now - 60 * 60 * 1000;
        break;

      case "8h":
        from = now - 8 * 60 * 60 * 1000;
        break;

      case "1d":
        from = now - 24 * 60 * 60 * 1000;
        break;

      case "7d":
        from = now - 7 * 24 * 60 * 60 * 1000;
        break;

      default:
        from = now - 10 * 60 * 1000; // fallback 10 minutes
    }

    const data = await prisma.spO2Sample.findMany({
      where: {
        deviceId,
        createdAt: { gte: new Date(from) }
      },
      orderBy: { createdAt: "desc" },
      take: 5000
    });

    res.json({
      range,
      count: data.length,
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
};


export const getSpO2Summary = async (req, res) => {
  try {
    const { deviceId, range = "1h" } = req.query;
    if (!deviceId) {
      return res.status(400).json({ error: "deviceId required" });
    }

    const now = Date.now();

    // 1️⃣ Determine time range
    let from;
    let bucketSize; // milliseconds

    switch (range) {
      case "30m":
        from = now - 30 * 60 * 1000;
        bucketSize = 5 * 60 * 1000; // 5m
        break;
      case "1h":
        from = now - 60 * 60 * 1000;
        bucketSize = 5 * 60 * 1000;
        break;
      case "8h":
        from = now - 8 * 60 * 60 * 1000;
        bucketSize = 30 * 60 * 1000; // 30m
        break;
      case "1d":
        from = now - 24 * 60 * 60 * 1000;
        bucketSize = 60 * 60 * 1000; // 1h
        break;
      case "7d":
        from = now - 7 * 24 * 60 * 60 * 1000;
        bucketSize = 6 * 60 * 60 * 1000; // 6h
        break;
      default:
        from = now - 60 * 60 * 1000;
        bucketSize = 5 * 60 * 1000;
    }

    // 2️⃣ Fetch raw data
const samples = await prisma.spO2Sample.findMany({
  where: {
    deviceId,
    createdAt: { gte: new Date(from) }
  },
  orderBy: { createdAt: "asc" },
  take: 5000
});

    // 3️⃣ Group into buckets
    const buckets = new Map();

    for (const s of samples) {
      const ts = new Date(s.createdAt).getTime();
      const bucketTs = Math.floor(ts / bucketSize) * bucketSize;

      if (!buckets.has(bucketTs)) {
        buckets.set(bucketTs, []);
      }
      buckets.get(bucketTs).push(s.value);
    }

    // 4️⃣ Build points
    const points = Array.from(buckets.entries()).map(([ts, values]) => ({
      ts: new Date(Number(ts)),
      avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
      min: Math.min(...values),
      max: Math.max(...values),
      drops: values.filter(v => v < 90).length
    }));

    res.json({
      range,
      resolution: `${bucketSize / 60000}m`,
      points
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
};


