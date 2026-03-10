import { Router } from "express";
const router = Router();
import auth from "../middleware/auth.middleware.js";


import { createECG, getECGHistory } from "../controllers/vitals/ecg.controlle.js";

// ECG
router.post("/ecg", auth, createECG);
router.get("/ecg", auth, getECGHistory);



export default router;
