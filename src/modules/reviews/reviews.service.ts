import { prisma } from '../../config/prisma.js';
import { CreateReviewInput, UpdateReviewInput } from './reviews.schemas.js';
import { AppError } from '../../middleware/error.js';

export async function createReview(eventId: string, userId: string, data: CreateReviewInput) {
  // Check if participant and approved
  const participation = await prisma.participation.findUnique({
    where: { eventId_userId: { eventId, userId } },
  });

  if (!participation || participation.status !== 'APPROVED') {
    throw new AppError('Only approved participants can review this event', 403);
  }

  // Check if already reviewed
  const existing = await prisma.review.findUnique({
    where: { eventId_userId: { eventId, userId } },
  });

  if (existing) {
    throw new AppError('You have already reviewed this event', 409);
  }

  return prisma.review.create({
    data: {
      ...data,
      eventId,
      userId,
    },
    include: {
      user: { select: { id: true, name: true } }
    }
  });
}

export async function getReviewsByEvent(eventId: string) {
  return prisma.review.findMany({
    where: { eventId },
    include: {
      user: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateReview(id: string, userId: string, data: UpdateReviewInput) {
  const review = await prisma.review.findUnique({ where: { id } });

  if (!review || review.userId !== userId) {
    throw new AppError('Review not found or unauthorized', 404);
  }

  // Check 24h window
  const now = new Date();
  const created = new Date(review.createdAt);
  const diffInHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);

  if (diffInHours > 24) {
    throw new AppError('Edit window (24h) has expired', 403);
  }

  return prisma.review.update({
    where: { id },
    data,
  });
}

export async function deleteReview(id: string, userId: string, isAdmin: boolean) {
  const review = await prisma.review.findUnique({ where: { id } });

  if (!review) {
    throw new AppError('Review not found', 404);
  }

  if (review.userId !== userId && !isAdmin) {
    throw new AppError('Forbidden: unauthorized deletion', 403);
  }

  return prisma.review.delete({ where: { id } });
}

export async function getReviewsByUser(userId: string) {
  return prisma.review.findMany({
    where: { userId },
    include: {
      event: { select: { title: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getReviewsForOwnedEvents(ownerId: string) {
  return prisma.review.findMany({
    where: {
      event: { ownerId },
    },
    include: {
      user: { select: { name: true } },
      event: { select: { title: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}
