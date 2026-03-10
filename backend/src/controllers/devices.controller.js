import prisma from '../config/prisma.js';

export async function createDevice(req, res) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Device name required' });
  }

  const device = await prisma.device.create({
    data: {
      name,
      type: 'Wearable_device',
      userId: req.user.id,
    },
  });

  return res.status(201).json(device);
}

export async function getDevices(req, res) {
  const devices = await prisma.device.findMany({
    where: { userId: req.user.id },
  });

  return res.json(devices);
}

export async function deleteDevice(req, res) {
  const { id } = req.params;

  const device = await prisma.device.findFirst({
    where: { id, userId: req.user.id },
  });

  if (!device) {
    return res.status(404).json({ message: 'Device not found' });
  }

  await prisma.device.delete({
    where: { id },
  });

  return res.json({ message: 'Device removed' });
}

export async function getDeviceDashboard(req, res) {
  try {
    const { id: deviceId } = req.params;
    const userId = req.user.id;

    // all user devices
    const userDevices = await prisma.device.findMany({
      where: { userId },
      select: { id: true, name: true, type: true }
    });

    const currentDevice = userDevices.find(d => d.id === deviceId);
    if (!currentDevice) {
      return res.status(404).json({ message: "Device not found for user" });
    }

    // =========================
    // CURRENT DEVICE DATA
    // =========================

    const latestTelemetry = await prisma.telemetry.findFirst({
      where: { deviceId },
      orderBy: { createdAt: "desc" }
    });

    const latestBP = await prisma.bloodPressure.findFirst({
      where: { deviceId },
      orderBy: { measuredAt: "desc" }
    });

    const latestSpO2 = await prisma.spO2Sample.findFirst({
      where: { deviceId },
      orderBy: { createdAt: "desc" }
    });

    const latestTemp = await prisma.temperatureSample.findFirst({
      where: { deviceId },
      orderBy: { measuredAt: "desc" }
    });
    const latestGlucose = await prisma.glucoseReading.findFirst({
  where: { deviceId },
  orderBy: { measuredAt: "desc" }
});


    const latestSleep = await prisma.sleepSession.findFirst({
      where: { deviceId },
      orderBy: { startTime: "desc" }
    });

    const latestStress = await prisma.stress.findFirst({
      where: { deviceId },
      orderBy: { createdAt: "desc" }
    });

    // =========================
    // AVAILABLE DEVICE CHECKS
    // =========================

    const deviceIds = userDevices.map(d => d.id);

    const telemetryDeviceIds = await prisma.telemetry.groupBy({
      by: ["deviceId"],
      where: { deviceId: { in: deviceIds } }
    });

    const bpDeviceIds = await prisma.bloodPressure.groupBy({
      by: ["deviceId"],
      where: { deviceId: { in: deviceIds } }
    });
    const glucoseDeviceIds = await prisma.glucoseReading.groupBy({
  by: ["deviceId"],
  where: { deviceId: { in: deviceIds } }
});


    const spo2DeviceIds = await prisma.spO2Sample.groupBy({
      by: ["deviceId"],
      where: { deviceId: { in: deviceIds } }
    });

    const tempDeviceIds = await prisma.temperatureSample.groupBy({
      by: ["deviceId"],
      where: { deviceId: { in: deviceIds } }
    });

    const sleepDeviceIds = await prisma.sleepSession.groupBy({
      by: ["deviceId"],
      where: { deviceId: { in: deviceIds } }
    });

    const stressDeviceIds = await prisma.stress.groupBy({
      by: ["deviceId"],
      where: { deviceId: { in: deviceIds } }
    });

    
    const filterDevices = (records) =>
      userDevices.filter(
        d => records.some(r => r.deviceId === d.id) && d.id !== deviceId
      );

    return res.json({
      device: currentDevice,

      metrics: {
        heartRate: {
          data: latestTelemetry ? latestTelemetry.heartRate : null,
          availableOn: filterDevices(telemetryDeviceIds)
        },

        steps: {
          data: latestTelemetry ? latestTelemetry.steps : null,
          availableOn: filterDevices(telemetryDeviceIds)
        },

        battery: latestTelemetry ? latestTelemetry.battery : null,

        bloodPressure: {
          data: latestBP
            ? {
                systolic: latestBP.systolic,
                diastolic: latestBP.diastolic,
                pulse: latestBP.pulse
              }
            : null,
          availableOn: filterDevices(bpDeviceIds)
        },

        spo2: {
          data: latestSpO2 ? latestSpO2.value : null,
          availableOn: filterDevices(spo2DeviceIds)
        },

        temperature: {
          data: latestTemp ? latestTemp.value : null,
          availableOn: filterDevices(tempDeviceIds)
        },

        sleep: {
          data: latestSleep || null,
          availableOn: filterDevices(sleepDeviceIds)
        },

        stress: {
          data: latestStress ? latestStress.value : null,
          availableOn: filterDevices(stressDeviceIds)
        },

        glucose: {
  data: latestGlucose
    ? {
        value: latestGlucose.glucose,
        unit: latestGlucose.unit,
        mealContext: latestGlucose.mealContext,
        measuredAt: latestGlucose.measuredAt
      }
    : null,
  availableOn: filterDevices(glucoseDeviceIds)
},

      }
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
