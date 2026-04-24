import { prisma } from '../../config/prisma.js';
import { InvitationStatus, ParticipationStatus } from '@prisma/client';
import { AppError } from '../../middleware/error.js';

export async function createInvitation(eventId: string, senderId: string, recipientEmail: string) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new AppError('Event not found', 404);

  const recipient = await prisma.user.findUnique({ where: { email: recipientEmail } });
  if (!recipient) throw new AppError('Recipient not found. Only registered users can be invited.', 404);

  // Check for existing invite
  const existing = await prisma.invitation.findUnique({
    where: {
      eventId_inviteeId: { eventId, inviteeId: recipient.id },
    },
  });

  if (existing) throw new AppError('Invitation already sent to this user', 409);

  return prisma.invitation.create({
    data: {
      eventId,
      senderId,
      inviteeId: recipient.id,
      status: InvitationStatus.PENDING,
    },
  });
}

export async function getMyInvitations(userId: string) {
  return prisma.invitation.findMany({
    where: { inviteeId: userId },
    include: {
      event: {
        select: { title: true, date: true, venue: true, feeCents: true },
      },
      sender: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateInvitationStatus(invitationId: string, userId: string, status: InvitationStatus) {
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: { event: true },
  });

  if (!invitation || invitation.inviteeId !== userId) {
    throw new AppError('Invitation not found', 404);
  }

  if (invitation.status !== InvitationStatus.PENDING) {
    throw new AppError('Invitation already processed', 400);
  }

  return prisma.$transaction(async (tx: any) => {
    const updatedInvite = await tx.invitation.update({
      where: { id: invitationId },
      data: { status },
    });

    if (status === InvitationStatus.ACCEPTED) {
      if (invitation.event.feeCents === 0) {
        // Free event -> Join immediately (Approve participation)
        await tx.participation.upsert({
          where: {
            eventId_userId: { eventId: invitation.eventId, userId: userId },
          },
          create: {
            eventId: invitation.eventId,
            userId: userId,
            status: ParticipationStatus.APPROVED,
          },
          update: {
            status: ParticipationStatus.APPROVED,
          },
        });
      } else {
        // Paid private event -> Ensure participation exists as PENDING
        // The user will pay for it through the dashboard
        await tx.participation.upsert({
          where: {
            eventId_userId: { eventId: invitation.eventId, userId: userId },
          },
          create: {
            eventId: invitation.eventId,
            userId: userId,
            status: ParticipationStatus.PENDING,
          },
          update: {
            // Keep as PENDING if it already exists
          },
        });
      }
    }

    return updatedInvite;
  });
}
