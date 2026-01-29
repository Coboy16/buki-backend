import { Router } from 'express';
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from '../controllers/client.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateBody, validateQuery, validateUuidParam } from '../middlewares/validate.middleware';
import {
  createClientSchema,
  updateClientSchema,
  clientQuerySchema,
} from '../validators/client.validator';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', validateQuery(clientQuerySchema), getClients);

router.get('/:id', validateUuidParam, getClientById);

router.post('/', validateBody(createClientSchema), createClient);

router.put('/:id', validateUuidParam, validateBody(updateClientSchema), updateClient);

router.delete('/:id', validateUuidParam, deleteClient);

export default router;
