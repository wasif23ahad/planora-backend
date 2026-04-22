import { Router } from 'express';
import * as paymentController from './payments.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { checkoutSchema } from './payments.schemas.js';

const router = Router();

router.post('/checkout', requireAuth, validate(checkoutSchema), paymentController.createCheckout);

// SSLCommerz Callbacks (unprotected as they are called by the gateway)
router.post('/success', paymentController.success);
router.post('/fail', paymentController.fail);
router.post('/cancel', paymentController.cancel);
router.post('/ipn', paymentController.ipn);

export default router;
