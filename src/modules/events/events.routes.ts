import { Router } from 'express';
import * as eventController from './events.controller.js';
import * as participationController from '../participations/participations.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.get('/', eventController.list);
router.get('/featured', eventController.featured);
router.post('/', requireAuth, eventController.create);
router.get('/:id', eventController.getById);
router.patch('/:id', requireAuth, eventController.update);
router.delete('/:id', requireAuth, eventController.remove);
router.post('/:id/join', requireAuth, participationController.join);

export default router;
