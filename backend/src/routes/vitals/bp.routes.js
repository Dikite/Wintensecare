import express from "express";
import { addBP } from "../../controllers/vitals/bp.controller.js";
import { getLatestBP } from "../../controllers/vitals/bp.controller.js";
import { getBPHistory } from "../../controllers/vitals/bp.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/",authMiddleware, addBP);
router.get("/latest",authMiddleware, getLatestBP);
router.get("/history",authMiddleware, getBPHistory);


export default router;
