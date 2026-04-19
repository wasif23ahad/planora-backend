import { Request, Response, NextFunction } from 'express';
import * as paymentService from './payments.service.js';

export async function createCheckout(req: Request, res: Response, next: NextFunction) {
  try {
    const { eventId } = req.body;
    const userId = req.user!.id;

    if (!eventId) {
      return res.status(400).json({ error: 'eventId is required' });
    }

    const { url } = await paymentService.createCheckoutSession(eventId, userId);
    
    res.status(200).json({ url });
  } catch (error) {
    next(error);
  }
}

export async function webhook(req: Request, res: Response, next: any) {
  try {
    const signature = req.headers['stripe-signature'] as string;
    const result = await paymentService.handleWebhook(req.body, signature);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
