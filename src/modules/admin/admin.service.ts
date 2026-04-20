import { prisma } from '../../config/prisma.js';

export async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
}

export async function updateUserStatus(id: string, isActive: boolean) {
  return prisma.user.update({
    where: { id },
    data: { isActive },
  });
}

export async function getAllEvents() {
  return prisma.event.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      owner: { select: { name: true, email: true } },
      _count: { select: { participations: true } },
    },
  });
}

export async function toggleEventFeatured(id: string) {
  const event = await prisma.event.findUnique({ where: { id }, select: { isFeatured: true } });
  return prisma.event.update({ where: { id }, data: { isFeatured: !event?.isFeatured } });
}

export async function getStats() {
  const [userCount, eventCount, revenueSum] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.payment.aggregate({
      where: { status: 'SUCCEEDED' },
      _sum: { amountCents: true },
    }),
  ]);

  return {
    totalUsers: userCount,
    totalEvents: eventCount,
    totalRevenue: revenueSum._sum.amountCents || 0,
  };
}
