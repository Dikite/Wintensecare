import { Router } from 'express';
const router = Router();

import authMiddleware from "../middlewares/auth.middleware.js";


import { createTelemetry, getTelemetry, getTelemetryHistory } from '../controllers/telemetry.controller.js';



router.post('/', authMiddleware, createTelemetry);
router.get('/', authMiddleware, getTelemetry);
router.get('/history', authMiddleware, getTelemetryHistory);



export default router;
