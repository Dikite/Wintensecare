import express from "express";
import {
  createStress,
  getLatestStress,
  getStressHistory
} from "../../controllers/vitals/stress.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/",authMiddleware, createStress);

router.get("/latest",authMiddleware, getLatestStress);
router.get("/history",authMiddleware, getStressHistory);

export default router;
