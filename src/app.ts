import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './modules/auth/auth.routes.js';
import eventRoutes from './modules/events/events.routes.js';
import paymentRoutes from './modules/payments/payments.routes.js';
import invitationRoutes from './modules/invitations/invitations.routes.js';
import reviewRoutes from './modules/reviews/reviews.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import { errorHandler } from './middleware/error.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());

// Special handled route for Stripe Webhook (needs raw body)
// We define it before express.json()
import * as paymentController from './modules/payments/payments.controller.js';
app.post('/payments/webhook', express.raw({ type: 'application/json' }), paymentController.webhook);

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/payments', paymentRoutes);
app.use('/invitations', invitationRoutes);
app.use('/reviews', reviewRoutes);
app.use('/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Error handling
app.use(errorHandler);

export default app;
