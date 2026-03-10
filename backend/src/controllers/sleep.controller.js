import prisma from "../config/prisma.js";

export const upsertSleep = async (req, res) => {
  try {
    const {
      deviceId,
      startTime,
      endTime,
      deep,
      light,
      rem,
      awake,
      avgHR,
      avgSpO2,
    } = req.body;

    if (!deviceId || !startTime || !endTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const totalMinutes =
      (deep || 0) + (light || 0) + (rem || 0) + (awake || 0);

    const sleep = await prisma.sleepSession.upsert({
      where: {
        deviceId_startTime: {
          deviceId,
          startTime: new Date(startTime),
        },
      },
      update: {
        endTime: new Date(endTime),
        totalMinutes,
        deepMinutes: deep,
        lightMinutes: light,
        remMinutes: rem,
        awakeMinutes: awake,
        avgHR,
        avgSpO2,
      },
      create: {
        deviceId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        totalMinutes,
        deepMinutes: deep,
        lightMinutes: light,
        remMinutes: rem,
        awakeMinutes: awake,
        avgHR,
        avgSpO2,
      },
    });

    return res.json({ success: true, data: sleep });
  } catch (err) {
    console.error("Sleep ingest error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getDailySleep = async (req, res) => {
  try {
    const { deviceId, date } = req.query;

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const data = await prisma.sleepSession.findFirst({
      where: {
        deviceId,
        startTime: { gte: start, lt: end },
      },
    });

    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const getSleepHistory = async (req, res) => {
  try {
    const { deviceId, days = 7 } = req.query;

    const start = new Date();
    start.setDate(start.getDate() - Number(days));

    const data = await prisma.sleepSession.findMany({
      where: {
        deviceId,
        startTime: { gte: start },
      },
      orderBy: { startTime: "asc" },
    });

    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
