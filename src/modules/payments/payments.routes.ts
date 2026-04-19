import { Router } from 'express';
import * as paymentController from './payments.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.post('/checkout', requireAuth, paymentController.createCheckout);

export default router;
