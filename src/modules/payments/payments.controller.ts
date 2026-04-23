import { Request, Response, NextFunction } from 'express';
import * as paymentService from './payments.service.js';
import { env } from '../../lib/env.js';
import { AppError } from '../../middleware/error.js';

const FRONTEND_URL = env.FRONTEND_URL || 'http://localhost:3000';

export async function createCheckout(req: Request, res: Response, next: NextFunction) {
  try {
    const { eventId, phoneNumber } = req.body;
    const userId = req.user!.id;

    if (!eventId) {
      throw new AppError('eventId is required', 400);
    }
    if (!phoneNumber) {
      throw new AppError('phoneNumber is required', 400);
    }

    const { url } = await paymentService.createSSLSession(eventId, userId, phoneNumber);
    
    res.status(200).json({ url });
  } catch (error) {
    next(error);
  }
}

export async function success(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await paymentService.verifyPayment(req.body);
    
    if (result.success) {
      res.redirect(`${FRONTEND_URL}/payments/success?eventId=${result.eventId}`);
    } else {
      res.redirect(`${FRONTEND_URL}/payments/cancel?eventId=${result.eventId}`);
    }
  } catch (error) {
    next(error);
  }
}

export async function fail(req: Request, res: Response, next: NextFunction) {
  try {
    // req.body contains tran_id
    res.redirect(`${FRONTEND_URL}/payments/cancel`);
  } catch (error) {
    next(error);
  }
}

export async function cancel(req: Request, res: Response, next: NextFunction) {
  try {
    res.redirect(`${FRONTEND_URL}/payments/cancel`);
  } catch (error) {
    next(error);
  }
}

export async function ipn(req: Request, res: Response, next: NextFunction) {
  try {
    await paymentService.verifyPayment(req.body);
    res.status(200).send('OK');
  } catch (error) {
    next(error);
  }
}

// Keep empty webhook for backward compatibility or remove if not used
export async function webhook(req: Request, res: Response, next: any) {
  res.status(200).send('OK');
}
