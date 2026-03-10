import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';

import {
  addDoctor,
  getDoctors,
  revokeDoctor,
  changeAccess,
  getDoctorHistory,
  restoreDoctor,
  deleteDoctorPermanent
} from '../controllers/userDoctor.controller.js';

const router = express.Router();

router.post('/doctors', authMiddleware, addDoctor);
router.get('/doctors', authMiddleware, getDoctors);
router.delete('/doctors/:id', authMiddleware, revokeDoctor);
router.patch('/doctors/:id', authMiddleware, changeAccess);
router.patch("/doctors/:id/restore", authMiddleware, restoreDoctor);

router.get("/doctors/history", authMiddleware, getDoctorHistory);
router.delete("/doctors/:id/permanent", authMiddleware, deleteDoctorPermanent);


export default router;
