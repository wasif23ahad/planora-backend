import { Router } from 'express';
import * as eventController from './events.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, eventController.create);
router.get('/:id', eventController.getById);
router.patch('/:id', requireAuth, eventController.update);
router.delete('/:id', requireAuth, eventController.remove);

export default router;
