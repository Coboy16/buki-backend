import { Router } from 'express';
import { login, register, getProfile, refreshToken } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validator';

const router = Router();

router.post('/login', validateBody(loginSchema), login);

router.post(
  '/register',
  authenticate,
  requireAdmin,
  validateBody(registerSchema),
  register
);

router.get('/me', authenticate, getProfile);

router.post('/refresh', authenticate, refreshToken);

export default router;
