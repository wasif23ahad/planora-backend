import { Router } from 'express';
import * as paymentController from './payments.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { checkoutSchema } from './payments.schemas.js';

const router = Router();

router.post('/checkout', requireAuth, validate(checkoutSchema), paymentController.createCheckout);

export default router;
