import { Router } from 'express';
import * as reviewController from './reviews.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.get('/given', requireAuth, reviewController.listGiven);
router.get('/received', requireAuth, reviewController.listReceived);
router.patch('/:id', requireAuth, reviewController.update);
router.delete('/:id', requireAuth, reviewController.remove);

export default router;
