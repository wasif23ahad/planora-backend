import { prisma } from '../../config/prisma.js';
import { ParticipationStatus, Visibility } from '@prisma/client';
import { AppError } from '../../middleware/error.js';

export async function joinEvent(eventId: string, userId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  // Check if paid event
  if (event.feeCents > 0) {
    throw new AppError('This is a paid event. Please use the checkout flow.', 400);
  }

  // Check if already participating
  const existingParticipation = await prisma.participation.findUnique({
    where: {
      eventId_userId: { eventId, userId },
    },
  });

  if (existingParticipation) {
    if (existingParticipation.status === ParticipationStatus.BANNED) {
      throw new AppError('You are banned from this event', 403);
    }
    throw new AppError('You are already a participant or have a pending request', 409);
  }

  // Determine status
  // Public Free -> APPROVED
  // Private Free -> PENDING
  const status: ParticipationStatus = 
    event.visibility === Visibility.PUBLIC 
      ? ParticipationStatus.APPROVED 
      : ParticipationStatus.PENDING;

  return prisma.participation.create({
    data: {
      eventId,
      userId,
      status,
    },
  });
}

export async function getParticipantsByEvent(eventId: string) {
  return prisma.participation.findMany({
    where: { eventId },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateParticipationStatus(
  eventId: string,
  userId: string,
  status: ParticipationStatus
) {
  return prisma.participation.update({
    where: {
      eventId_userId: { eventId, userId },
    },
    data: { status },
  });
}
