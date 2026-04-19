import { Router } from 'express';
import * as adminController from './admin.controller.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { toggleUserStatusSchema } from './admin.schemas.js';

const router = Router();

router.use(requireAuth, requireRole('ADMIN'));

router.get('/users', adminController.getUsers);
router.patch('/users/:id/status', validate(toggleUserStatusSchema), adminController.toggleUserStatus);
router.get('/events', adminController.getEvents);
router.delete('/events/:id', adminController.deleteEvent);

export default router;
