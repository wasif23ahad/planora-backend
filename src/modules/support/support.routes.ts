import { Router } from 'express';
import * as supportController from './support.controller.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';

const router = Router();

// Standard users can create messages
router.post('/', requireAuth, supportController.create);

// Only admins can see all messages
router.get('/', requireAuth, requireRole('ADMIN'), supportController.list);

export default router;
