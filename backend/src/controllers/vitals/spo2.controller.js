import prisma from "../../config/prisma.js";

export async function ingestSpO2(req, res) {
  try {
    const { deviceId, spo2, perfusion } = req.body;

    if (!deviceId || typeof spo2 !== "number") {
      return res.status(400).json({ error: "Missing or invalid data" });
    }

    if (spo2 < 70 || spo2 > 100) {
      return res.status(400).json({ error: "Invalid SpO2 value" });
    }

    const device = await prisma.device.findUnique({
      where: { id: deviceId }
    });

    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }

    await prisma.spO2Sample.create({
      data: { deviceId, value: spo2, perfusion }
    });

    const since = new Date(Date.now() - 60 * 60 * 1000); // 1 hour window


    const samples = await prisma.spO2Sample.findMany({
        
      where: { deviceId, createdAt: { gte: since } }
    });
console.log("SPO2 WINDOW COUNT:", samples.length);

    if (samples.length >= 5) {
      const values = samples.map(s => s.value);
      const avg = Math.round(values.reduce((a,b)=>a+b,0)/values.length);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const drops = values.filter(v => v < 90).length;

      await prisma.spO2Summary.create({
        data: { deviceId, window:"5m", avg, min, max, drops }
      });

      if (avg < 90 || drops >= 3) {
        await prisma.alert.create({
          data: {
            deviceId,
            type: "SPO2_LOW",
            severity: avg < 85 ? "critical" : "warning",
            message: `Low SpO2 detected. Avg=${avg}%`
          }
        });
      }
    }

    res.json({ success:true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error:"Server error" });
  }
}

/**
 * GET raw SpO2 samples
 * /vitals/spo2/raw?deviceId=xxx&minutes=10
 */
export async function getSpO2Raw(req, res) {
  const { deviceId, minutes = 10 } = req.query;

  if (!deviceId) return res.status(400).json({ error:"deviceId required" });

  const since = new Date(Date.now() - minutes * 60 * 1000);

  const data = await prisma.spO2Sample.findMany({
    where: { deviceId, createdAt: { gte: since } },
    orderBy: { createdAt: "asc" }
  });

  res.json(data);
}

/**
 * GET SpO2 summaries
 * /vitals/spo2/summary?deviceId=xxx
 */
export async function getSpO2Summary(req, res) {
  const { deviceId } = req.query;

  if (!deviceId) return res.status(400).json({ error:"deviceId required" });

  const data = await prisma.spO2Summary.findMany({
    where: { deviceId },
    orderBy: { createdAt:"desc" },
    take: 20
  });

  res.json(data);
}
