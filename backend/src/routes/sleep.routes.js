import Router from "express";
import {
  upsertSleep,
  getDailySleep,
  getSleepHistory,
} from "../controllers/sleep.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";


const router = Router();

// Store / update sleep session
router.post("/",authMiddleware, upsertSleep);

// Get single day sleep
router.get("/daily",authMiddleware, getDailySleep);

// Get sleep history (7d / 30d etc)
router.get("/history",authMiddleware, getSleepHistory);

export default router;
