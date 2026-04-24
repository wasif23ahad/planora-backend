import { prisma } from '../../config/prisma.js';
import { ParticipationStatus, Visibility } from '@prisma/client';
import { AppError } from '../../middleware/error.js';

export async function joinEvent(eventId: string, userId: string, phoneNumber?: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  // Check if paid event - Public paid events require immediate checkout.
  // Private paid events start with a "Request to Join" which doesn't require immediate payment.
  if (event.feeCents > 0 && event.visibility === Visibility.PUBLIC) {
    throw new AppError('This is a paid public event. Please use the checkout flow.', 400);
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

  return (prisma.participation as any).create({
    data: {
      eventId,
      userId,
      status,
      phoneNumber,
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
export async function getParticipationById(id: string) {
  return prisma.participation.findUnique({
    where: { id },
    include: {
      event: {
        include: {
          owner: { select: { name: true } },
        },
      },
      user: {
        select: { id: true, name: true, email: true },
      },
      payment: true,
    },
  });
}
export async function getJoinedEvents(userId: string) {
  const participations = await prisma.participation.findMany({
    where: { userId },
    include: {
      event: {
        include: {
          owner: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const enriched = await Promise.all(
    participations.map(async (p) => {
      const invitation = await (prisma.invitation as any).findUnique({
        where: {
          eventId_inviteeId: { eventId: p.eventId, inviteeId: userId },
        },
      });
      return {
        ...p,
        invitationStatus: invitation?.status || null,
      };
    })
  );

  return enriched;
}
