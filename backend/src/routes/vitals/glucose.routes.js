import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";

import {
  insertGlucose,
  getLatestGlucose,
  getGlucoseHistory,
} from "../../controllers/vitals/glucose.controller.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| POST /vitals/glucose
| Insert glucose reading
|--------------------------------------------------------------------------
*/
router.post("/", authMiddleware, insertGlucose);

/*-
|--------------------------------------------------------------------------
| GET /vitals/glucose/latest?deviceId=xxx
|-------------------------------------------------------------------------
*/
router.get("/latest", authMiddleware, getLatestGlucose);

/*
|--------------------------------------------------------------------------
| GET /vitals/glucose/history?deviceId=xxx&days=1
|--------------------------------------------------------------------------
*/
router.get("/history", authMiddleware, getGlucoseHistory);

export default router;
