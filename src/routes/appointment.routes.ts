import { Router } from 'express';
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} from '../controllers/appointment.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateBody, validateQuery, validateUuidParam } from '../middlewares/validate.middleware';
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  updateAppointmentStatusSchema,
  appointmentQuerySchema,
} from '../validators/appointment.validator';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', validateQuery(appointmentQuerySchema), getAppointments);

router.get('/:id', validateUuidParam, getAppointmentById);

router.post('/', validateBody(createAppointmentSchema), createAppointment);

router.put('/:id', validateUuidParam, validateBody(updateAppointmentSchema), updateAppointment);

router.patch(
  '/:id/status',
  validateUuidParam,
  validateBody(updateAppointmentStatusSchema),
  updateAppointmentStatus
);

router.delete('/:id', validateUuidParam, deleteAppointment);

export default router;
