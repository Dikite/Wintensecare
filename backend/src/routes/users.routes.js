import { Router } from 'express';
const router = Router();

import authMiddleware from '../middlewares/auth.middleware.js';
import { getCurrentUser } from '../controllers/users.controller.js';

router.get('/me', authMiddleware, getCurrentUser);

export default router;
