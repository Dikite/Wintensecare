import prisma from "../../config/prisma.js";
import { updateSnapshot } from "../../utils/updateSnapshot.js";

export const addBP = async (req, res) => {
  try {
    const { deviceId, systolic, diastolic, pulse, measuredAt } = req.body;

    if (!deviceId || !systolic || !diastolic || !measuredAt) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let measuredTime = new Date(measuredAt);

    // ✅ validate date
    if (isNaN(measuredTime.getTime())) {
      return res.status(400).json({ error: "Invalid measuredAt" });
    }

    // 🚫 block future timestamps
    const now = Date.now();
    const ALLOW_DRIFT = 5 * 1000; // 5 sec tolerance

    if (measuredTime.getTime() > now + ALLOW_DRIFT) {
      return res.status(400).json({
        error: "Future timestamps are not allowed"
      });
    }

    // ✅ store
    const bp = await prisma.bloodPressure.create({
      data: {
        deviceId,
        systolic,
        diastolic,
        pulse,
        measuredAt: measuredTime,
      },
    });

    // 🔒 freshness rule (5 min for live snapshot)
    const FIVE_MIN = 5 * 60 * 1000;

    if (now - measuredTime.getTime() <= FIVE_MIN) {
      await updateSnapshot(deviceId, {
        systolic,
        diastolic,
        measuredAt: measuredTime
      });
    } else {
      console.log("Old BP sync → skip live update");
    }

    res.json({ success: true, data: bp });

  } catch (err) {
    console.error("BP ingest error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getLatestBP = async (req, res) => {
  const { deviceId } = req.query;

  const data = await prisma.bloodPressure.findFirst({
    where: { deviceId },
    orderBy: { measuredAt: "desc" },
  });

  res.json(data);
};
export const getBPHistory = async (req, res) => {
  const { deviceId, days = 7 } = req.query;

  const start = new Date();
  start.setDate(start.getDate() - Number(days));

  const data = await prisma.bloodPressure.findMany({
    where: {
      deviceId,
      measuredAt: { gte: start },
    },
    orderBy: { measuredAt: "asc" },
  });

  res.json(data);
};
