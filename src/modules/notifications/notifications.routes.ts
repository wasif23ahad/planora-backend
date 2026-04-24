import { Router } from 'express';
import * as notificationController from './notifications.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.get('/stats', requireAuth, notificationController.getStats);
router.patch('/:id/read', requireAuth, notificationController.markAsRead);

export default router;
