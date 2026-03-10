import express from "express";
import prisma from "../config/prisma.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:deviceId", authMiddleware, async (req, res) => {
  const { deviceId } = req.params;

  // optional: verify device belongs to user
  const device = await prisma.device.findFirst({
    where: {
      id: deviceId,
      userId: req.user.id
    }
  });

  if (!device) {
    return res.status(403).json({ message: "Access denied" });
  }

  const snapshot = await prisma.deviceVitalsSnapshot.findUnique({
    where: { deviceId }
  });

  res.json(snapshot);
});



router.get("/", authMiddleware, async (req, res) => {
  const devices = await prisma.device.findMany({
    where: { userId: req.user.id },
    include: {
      snapshot: true
    }
  });

  const result = devices.map(d => ({
    deviceId: d.id,
    deviceName: d.name,

    heartRate: d.snapshot?.heartRate ?? null,
    heartRateAt: d.snapshot?.heartRateAt ?? null,

    spo2: d.snapshot?.spo2 ?? null,
    spo2At: d.snapshot?.spo2At ?? null,

    systolic: d.snapshot?.systolic ?? null,
    diastolic: d.snapshot?.diastolic ?? null,
    bpAt: d.snapshot?.bpAt ?? null,

    temperature: d.snapshot?.temperature ?? null,
    temperatureAt: d.snapshot?.temperatureAt ?? null,

    stress: d.snapshot?.stress ?? null,
    stressAt: d.snapshot?.stressAt ?? null,
  }));

  res.json(result);
});


export default router;
