import { prisma } from '../../config/prisma.js';
import { stripe } from '../../lib/stripe.js';
import { AppError } from '../../middleware/error.js';
import { PaymentStatus } from '@prisma/client';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export async function createCheckoutSession(eventId: string, userId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  if (event.feeCents === 0) {
    throw new AppError('This is a free event. Please use the join flow.', 400);
  }

  // Check if already joined/participating
  const existingParticipation = await prisma.participation.findUnique({
    where: {
      eventId_userId: { eventId, userId },
    },
  });

  if (existingParticipation && existingParticipation.status === 'APPROVED') {
    throw new AppError('You are already a participant in this event', 409);
  }

  // Create Stripe Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: event.title,
            description: `Registration for ${event.title}`,
          },
          unit_amount: event.feeCents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${FRONTEND_URL}/events/${eventId}?payment=success`,
    cancel_url: `${FRONTEND_URL}/events/${eventId}?payment=cancelled`,
    metadata: {
      eventId,
      userId,
    },
  });

  // Create Payment record (PENDING)
  // Note: We don't create Participation yet; we wait for the webhook.
  const payment = await prisma.payment.create({
    data: {
      eventId,
      userId,
      amountCents: event.feeCents,
      stripeSessionId: session.id,
      status: PaymentStatus.PENDING,
    },
  });

  return { url: session.url, paymentId: payment.id };
}

export async function handleWebhook(body: any, signature: string) {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    throw new AppError(`Webhook Error: ${err.message}`, 400);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const { eventId, userId } = session.metadata;

    await prisma.$transaction([
      // 1. Update Payment
      prisma.payment.updateMany({
        where: { stripeSessionId: session.id },
        data: { status: 'COMPLETED' },
      }),
      // 2. Create/Update Participation
      prisma.participation.upsert({
        where: {
          eventId_userId: { eventId, userId },
        },
        create: {
          eventId,
          userId,
          status: 'APPROVED',
        },
        update: {
          status: 'APPROVED',
        },
      }),
    ]);
  }

  return { received: true };
}
