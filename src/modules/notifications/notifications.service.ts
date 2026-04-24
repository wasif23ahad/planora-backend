import { prisma } from '../../config/prisma.js';
import { InvitationStatus, ParticipationStatus } from '@prisma/client';

export async function getNotificationStats(userId: string) {
  // 1. Pending invitations count
  const pendingInvitationsCount = await prisma.invitation.count({
    where: {
      inviteeId: userId,
      status: InvitationStatus.PENDING,
    },
  });

  // 2. Pending requests for events the user OWNS
  const pendingRequestsCount = await prisma.participation.count({
    where: {
      event: {
        ownerId: userId,
      },
      status: ParticipationStatus.PENDING,
    },
  });

  // 3. Actual notifications from the Notification table
  const notifications = await prisma.notification.findMany({
    where: {
      userId,
      isRead: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // 4. Upcoming events user is attending (Approved) - next 3 days
  const soon = new Date();
  const threeDaysLater = new Date();
  threeDaysLater.setDate(soon.getDate() + 3);

  const upcomingAttending = await prisma.participation.findMany({
    where: {
      userId: userId,
      status: ParticipationStatus.APPROVED,
      event: {
        date: {
          gte: soon,
          lte: threeDaysLater,
        },
      },
    },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          date: true,
        },
      },
    },
  });

  return {
    pendingInvitationsCount,
    pendingRequestsCount,
    upcomingAttending: upcomingAttending.map((p: any) => p.event),
    notifications,
    totalCount: pendingInvitationsCount + pendingRequestsCount + upcomingAttending.length + notifications.length,
  };
}

export async function createNotification(data: {
  userId: string;
  type: string;
  message: string;
  link?: string;
}) {
  return prisma.notification.create({
    data,
  });
}

export async function markAsRead(notificationId: string, userId: string) {
  return prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId,
    },
    data: {
      isRead: true,
    },
  });
}
