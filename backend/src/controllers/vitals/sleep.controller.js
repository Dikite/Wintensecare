import prisma from "../../config/prisma.js";
export async function createSleep(req, res) {
  const data = req.body;

  const record = await sleepSession.create({ data });
  res.status(201).json(record);
}

export async function getSleepHistory(req, res) {
  const { deviceId } = req.query;

  const data = await sleepSession.findMany({
    where: { deviceId },
    orderBy: { startTime: "desc" }
  });

  res.json(data);
}
