import { Router } from 'express';
import * as adminController from './admin.controller.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';

const router = Router();

// All routes here require ADMIN role
router.use(requireAuth, requireRole('ADMIN'));

router.get('/users', adminController.getUsers);
router.patch('/users/:id/status', adminController.toggleUserStatus);
router.get('/events', adminController.getEvents);
router.delete('/events/:id', adminController.deleteEvent);

export default router;
