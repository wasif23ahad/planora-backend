import { Router } from 'express';
import * as authController from './auth.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', requireAuth, authController.getMe);

// Google OAuth
import passport from 'passport';
import '../../config/passport.js';

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  authController.googleCallback
);

export default router;
