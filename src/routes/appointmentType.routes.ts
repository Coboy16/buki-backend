import { Router } from 'express';
import {
  getAppointmentTypes,
  getAppointmentTypeById,
  createAppointmentType,
  updateAppointmentType,
  deleteAppointmentType,
} from '../controllers/appointmentType.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';
import { validateBody, validateUuidParam } from '../middlewares/validate.middleware';
import {
  createAppointmentTypeSchema,
  updateAppointmentTypeSchema,
} from '../validators/appointmentType.validator';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getAppointmentTypes);

router.get('/:id', validateUuidParam, getAppointmentTypeById);

// Only admins can create, update, and delete appointment types
router.post(
  '/',
  requireAdmin,
  validateBody(createAppointmentTypeSchema),
  createAppointmentType
);

router.put(
  '/:id',
  requireAdmin,
  validateUuidParam,
  validateBody(updateAppointmentTypeSchema),
  updateAppointmentType
);

router.delete('/:id', requireAdmin, validateUuidParam, deleteAppointmentType);

export default router;
