import express from "express";
import {
  createTemperature,
  getTemperatureHistory
} from "../controllers/temperature.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/",authMiddleware, createTemperature);
router.get("/",authMiddleware, getTemperatureHistory);

export default router;
