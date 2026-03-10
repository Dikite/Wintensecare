import express from "express";
import { getPermissions, updatePermissions } from "../controllers/user/permission.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getPermissions);
router.patch("/", authMiddleware, updatePermissions);

export default router;
