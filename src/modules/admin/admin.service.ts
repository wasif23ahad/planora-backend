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
      _count: { select: { participants: true } },
    },
  });
}
