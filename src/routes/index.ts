import { Router } from 'express';
import authRoutes from './auth.routes';
import clientRoutes from './client.routes';
import appointmentRoutes from './appointment.routes';
import appointmentTypeRoutes from './appointmentType.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/clients', clientRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/appointment-types', appointmentTypeRoutes);

export default router;
