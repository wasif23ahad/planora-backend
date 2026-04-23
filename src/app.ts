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
// Flexible CORS to handle Vercel preview URLs and trailing slashes
const allowedOrigins = [
  env.FRONTEND_URL.replace(/\/$/, ''), // Remove trailing slash if present
  'http://localhost:3000',
  'https://planora-frontend-green.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    // Check if origin is in our explicit list or is a Vercel preview URL for our project
    if (
      allowedOrigins.includes(origin) || 
      origin.includes('planora-frontend') ||
      origin.includes('sslcommerz.com')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

import passport from 'passport';
app.use(passport.initialize());

// We define it before express.json() if needed for other raw webhooks

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/payments', paymentRoutes);
app.use('/invitations', invitationRoutes);
app.use('/reviews', reviewRoutes);
app.use('/admin', adminRoutes);
app.use('/support', supportRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Planora API is running successfully!' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Error handling
app.use(errorHandler);

export default app;
module.exports = app;
