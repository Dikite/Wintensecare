import express from "express";
import {
  ingestSpO2,
  getSpO2Raw,
  getSpO2Summary
} from "../../controllers/vitals/spo2.controller.js";
import auth from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/ingest", auth, ingestSpO2);
router.get("/raw", auth, getSpO2Raw);
router.get("/summary", auth, getSpO2Summary);

export default router;
