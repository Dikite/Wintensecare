import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
  getAlerts,
  acknowledgeAlert
} from '../controllers/alerts.controller.js';

const router = Router();

router.get('/', authMiddleware, getAlerts);
router.post('/:id/ack', authMiddleware, acknowledgeAlert);

export default router;
