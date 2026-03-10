import express from "express";
import {
  ingestSpO2,
  getSpO2Raw,
  getSpO2Summary
} from "../../controllers/vitals/spo2.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, ingestSpO2);
router.get("/raw", authMiddleware, getSpO2Raw);
router.get("/summary", authMiddleware, getSpO2Summary);

export default router;
