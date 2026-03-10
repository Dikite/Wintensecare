import { updateSnapshot } from "../utils/updateSnapshot.js";
import TemperatureService from "../services/temperature.service.js";

export const createTemperature = async (req, res) => {
  try {
    const { deviceId, value, measuredAt } = req.body;

    if (!deviceId || value == null || !measuredAt) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let measuredTime = new Date(measuredAt);

    // ✅ validate date
    if (isNaN(measuredTime.getTime())) {
      return res.status(400).json({ message: "Invalid measuredAt" });
    }

    // 🚫 block future timestamps
    const now = Date.now();
    const ALLOW_DRIFT = 5 * 1000; // 5 seconds tolerance

    if (measuredTime.getTime() > now + ALLOW_DRIFT) {
      return res.status(400).json({
        message: "Future timestamps are not allowed"
      });
    }

    const data = await TemperatureService.create({
      deviceId,
      value: Number(value),
      measuredAt: measuredTime
    });

    // 🔒 LIVE snapshot only if recent
    const FIVE_MIN = 5 * 60 * 1000;

    if (now - measuredTime.getTime() <= FIVE_MIN) {
      await updateSnapshot(deviceId, {
        temperature: Number(value),
        measuredAt: measuredTime
      });
    } else {
      console.log("Old temperature sync → not updating live");
    }

    res.json({ success: true, data });

  } catch (err) {
    console.error("Create temperature error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTemperatureHistory = async (req, res) => {
  try {
    const { deviceId, range = "24h" } = req.query;

    if (!deviceId) {
      return res.status(400).json({ message: "deviceId required" });
    }

    const data = await TemperatureService.history(deviceId, range);

    res.json({ success: true, data });

  } catch (err) {
    console.error("Fetch temperature error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
