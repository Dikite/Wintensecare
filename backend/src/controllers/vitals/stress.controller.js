import prisma from "../../config/prisma.js";
import { updateSnapshot } from "../../utils/updateSnapshot.js";
// POST /api/stress



export async function createStress(req, res) {
  try {
    const { deviceId, value, level, source, measuredAt } = req.body;

 if (!deviceId || value === undefined || !measuredAt) {
  return res.status(400).json({
    message: "deviceId, value and measuredAt required",
  });
}

    let measuredTime = measuredAt ? new Date(measuredAt) : null;

    // ✅ validate timestamp if provided
    if (measuredTime) {
      if (isNaN(measuredTime.getTime())) {
        return res.status(400).json({ message: "Invalid measuredAt" });
      }

      const now = Date.now();
      const ALLOW_DRIFT = 5 * 1000; // 5 sec tolerance

      if (measuredTime.getTime() > now + ALLOW_DRIFT) {
        return res.status(400).json({
          message: "Future timestamps are not allowed"
        });
      }
    }

    // ✅ insert
   const stress = await prisma.stress.create({
  data: {
    deviceId,
    value,
    level: level || null,
    source: source || "device",
    measuredAt: measuredTime ?? new Date(),
  },
});

    // 🔒 live snapshot only if recent
    if (measuredTime) {
      const now = Date.now();
      const FIVE_MIN = 5 * 60 * 1000;

      if (now - measuredTime.getTime() <= FIVE_MIN) {
        await updateSnapshot(deviceId, {
          stress: value,
          measuredAt: measuredTime
        });
      } else {
        console.log("Old stress sync → skip live");
      }
    } else {
      // if no measuredAt → assume live
      await updateSnapshot(deviceId, {
        stress: value
      });
    }

    res.json(stress);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create stress" });
  }
}
//
// GET latest records
// /api/stress/latest?deviceId=abc123
//
export async function getLatestStress(req, res) {
  try {
    const deviceId = req.query.deviceId;

    if (!deviceId) {
      return res.status(400).json({ message: "deviceId required" });
    }

    const data = await prisma.stress.findMany({
      where: { deviceId },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stress" });
  }
}

//
// GET history with range
// /api/stress/history?deviceId=abc123&range=1h
//
export async function getStressHistory(req, res) {
  try {
    const deviceId = req.query.deviceId;
    const range = req.query.range || "1d";

    if (!deviceId) {
      return res.status(400).json({ message: "deviceId required" });
    }

    let diff;
switch (range) {
  case "30m": diff = 30 * 60 * 1000; break;
  case "1h":  diff = 60 * 60 * 1000; break;
  case "8h":  diff = 8 * 60 * 60 * 1000; break;
  case "1d":  diff = 24 * 60 * 60 * 1000; break;
  case "1w":  diff = 7 * 24 * 60 * 60 * 1000; break;
  case "1m":  diff = 30 * 24 * 60 * 60 * 1000; break;
  default:    diff = 24 * 60 * 60 * 1000;
}


    const fromTime = new Date(Date.now() - diff);

    const data = await prisma.stress.findMany({
      where: {
        deviceId,
        createdAt: { gte: fromTime },
      },
      orderBy: { createdAt: "asc" },
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "failed to fetch stress history" });
  }
}