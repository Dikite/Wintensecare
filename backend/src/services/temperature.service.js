import prisma from '../config/prisma.js';

class TemperatureService {

  static async create({ deviceId, value, measuredAt }) {
    const temp = await prisma.temperatureSample.create({
      data: {
        deviceId,
        value,
        measuredAt
      }
    });

    await this.checkAlert(deviceId, value);

    return temp;
  }

  static async history(deviceId, range) {
    const since = this.parseRange(range);

    return prisma.temperatureSample.findMany({
      where: {
        deviceId,
        measuredAt: { gte: since }
      },
      orderBy: { measuredAt: "asc" }
    });
  }

  static parseRange(range) {
    const map = {
      "30m": 30 * 60 * 1000,
      "1h": 60 * 60 * 1000,
      "3h": 3 * 60 * 60 * 1000,
      "8h": 8 * 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000
    };

    return new Date(Date.now() - (map[range] || map["24h"]));
  }

  static async checkAlert(deviceId, temp) {
    let severity = null;

    if (temp >= 39) severity = "CRITICAL";
    else if (temp >= 38) severity = "WARNING";
    else if (temp <= 35) severity = "WARNING";

    if (!severity) return;

    const device = await prisma.device.findUnique({
      where: { id: deviceId },
      select: { userId: true }
    });

    if (!device) return;

    await prisma.alert.create({
      data: {
        userId: device.userId,
        deviceId,
        metric: "TEMPERATURE",
        value: Math.round(temp * 10),
        severity,
        message: `Abnormal temperature detected: ${temp}°C`
      }
    });
  }
}

export default TemperatureService;
