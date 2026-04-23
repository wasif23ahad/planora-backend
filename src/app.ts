import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './modules/auth/auth.routes.js';
import eventRoutes from './modules/events/events.routes.js';
import paymentRoutes from './modules/payments/payments.routes.js';
import invitationRoutes from './modules/invitations/invitations.routes.js';
import reviewRoutes from './modules/reviews/reviews.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import supportRoutes from './modules/support/support.routes.js';
import { errorHandler } from './middleware/error.js';

import { env } from './lib/env.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));

import passport from 'passport';
app.use(passport.initialize());

// We define it before express.json() if needed for other raw webhooks

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/payments', paymentRoutes);
app.use('/invitations', invitationRoutes);
app.use('/reviews', reviewRoutes);
app.use('/admin', adminRoutes);
app.use('/support', supportRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Error handling
app.use(errorHandler);

export default app;
