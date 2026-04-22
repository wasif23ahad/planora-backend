import { prisma } from '../../config/prisma.js';
import { sslcz } from '../../lib/sslcommerz.js';
import { AppError } from '../../middleware/error.js';
import { PaymentStatus } from '@prisma/client';
import { env } from '../../lib/env.js';
import { SSLCommerzValidationResponse } from 'sslcommerz-lts';

const BACKEND_URL = env.BACKEND_URL || 'http://localhost:4000';

export async function createSSLSession(eventId: string, userId: string) {
  const [event, user] = await Promise.all([
    prisma.event.findUnique({ where: { id: eventId } }),
    prisma.user.findUnique({ where: { id: userId } }),
  ]);

  if (!event) throw new AppError('Event not found', 404);
  if (!user) throw new AppError('User not found', 404);
  if (event.feeCents === 0) throw new AppError('This is a free event.', 400);

  const tran_id = `TXN_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

  const data = {
    total_amount: event.feeCents / 100, // SSLCommerz expects amount in major units (Taka)
    currency: 'BDT',
    tran_id: tran_id,
    success_url: `${BACKEND_URL}/payments/success`,
    fail_url: `${BACKEND_URL}/payments/fail`,
    cancel_url: `${BACKEND_URL}/payments/cancel`,
    ipn_url: `${BACKEND_URL}/payments/ipn`,
    shipping_method: 'NO',
    product_name: event.title,
    product_category: event.category,
    product_profile: 'general',
    cus_name: user.name,
    cus_email: user.email,
    cus_add1: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: '01700000000',
  };

  const response = await sslcz.init(data);
  
  if (response?.GatewayPageURL) {
    await prisma.payment.create({
      data: {
        eventId,
        userId,
        amountCents: event.feeCents,
        transactionId: tran_id,
        status: PaymentStatus.PENDING,
      },
    });
    return { url: response.GatewayPageURL };
  } else {
    throw new AppError('SSLCommerz session creation failed', 500);
  }
}

export async function verifyPayment(data: SSLCommerzValidationResponse) {
  // data is the body of the POST request from SSLCommerz
  const { status, tran_id, val_id } = data;

  const payment = await prisma.payment.findUnique({
    where: { transactionId: tran_id },
  });

  if (!payment) throw new AppError('Payment record not found', 404);

  if (status === 'VALID') {
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'SUCCEEDED', valId: val_id },
      }),
      prisma.participation.upsert({
        where: {
          eventId_userId: { eventId: payment.eventId, userId: payment.userId },
        },
        create: {
          eventId: payment.eventId,
          userId: payment.userId,
          status: 'APPROVED',
          paymentId: payment.id,
        },
        update: {
          status: 'APPROVED',
          paymentId: payment.id,
        },
      }),
    ]);
    return { success: true, eventId: payment.eventId };
  } else {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'FAILED' },
    });
    return { success: false, eventId: payment.eventId };
  }
}
