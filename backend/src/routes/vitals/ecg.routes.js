import { Router } from "express";
const router = Router();

import auth from "../../middlewares/auth.middleware.js";

import { createECG, getECGHistory,getLatestECG } from "../../controllers/vitals/ecg.controller.js";

import { getECGSummaryHistory } from "../../controllers/vitals/ecgSummary.controller.js";

router.post("/ecg", auth, createECG);
router.get("/ecg", auth, getECGHistory);
router.get("/ecg/summary", auth, getECGSummaryHistory);

router.get("/ecg/latest", auth, getLatestECG);

export default router;
