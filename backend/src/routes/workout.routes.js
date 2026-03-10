import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import * as workoutController from "../controllers/workout.controller.js";

const router = Router();

router.post("/start", authMiddleware, workoutController.start);
router.post("/end", authMiddleware, workoutController.end);
router.get("/live/:deviceId", authMiddleware, workoutController.live);
router.get("/stats/week", authMiddleware, workoutController.weeklyStats);
router.get("/history", authMiddleware, workoutController.history);
router.post("/set", authMiddleware, workoutController.addSet);
router.post("/exercise", authMiddleware, workoutController.createExercise);
router.get("/exercise", authMiddleware, workoutController.getExercises);



export default router;
