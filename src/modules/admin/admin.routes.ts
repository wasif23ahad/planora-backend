import { Router } from 'express';
import * as adminController from './admin.controller.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { toggleUserStatusSchema } from './admin.schemas.js';

const router = Router();

router.use(requireAuth);

// Read-only — both managers and admins
router.get('/users',  requireRole('ADMIN', 'MANAGER'), adminController.getUsers);
router.get('/events', requireRole('ADMIN', 'MANAGER'), adminController.getEvents);
router.get('/stats',  requireRole('ADMIN', 'MANAGER'), adminController.getStats);

// Write — manager can feature, admin can do everything
router.patch('/events/:id/feature', requireRole('ADMIN', 'MANAGER'), adminController.toggleFeature);

// Admin-only writes
router.patch('/users/:id/status', requireRole('ADMIN'), validate(toggleUserStatusSchema), adminController.toggleUserStatus);
router.delete('/users/:id',       requireRole('ADMIN'), adminController.deleteUser);
router.delete('/events/:id',      requireRole('ADMIN'), adminController.deleteEvent);

export default router;
