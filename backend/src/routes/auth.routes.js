import { Router } from 'express';
const router = Router();

import authController, { register, login, logout } from '../controllers/auth.controller.js';
import authMiddleware from "../middlewares/auth.middleware.js";
console.log('AUTH CONTROLLER:', authController);

router.post('/register', register);
router.post('/login', login);

router.post("/logout", authMiddleware, logout);


export default router;