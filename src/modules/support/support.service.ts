import { prisma } from '../../config/prisma.js';

export async function createMessage(senderId: string, content: string) {
  return prisma.supportMessage.create({
    data: {
      senderId,
      content,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function getAllMessages() {
  return prisma.supportMessage.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}
