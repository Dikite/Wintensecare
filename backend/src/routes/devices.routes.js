import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
  createDevice,
  getDevices,
  deleteDevice
} from '../controllers/devices.controller.js';
import { getDeviceDashboard } from '../controllers/devices.controller.js';


const router = Router();

router.post('/', authMiddleware, createDevice);
router.get('/', authMiddleware, getDevices);
router.delete('/:id', authMiddleware, deleteDevice);
router.get('/:id/dashboard', authMiddleware, getDeviceDashboard);

export default router;
