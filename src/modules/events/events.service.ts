import { prisma } from '../../config/prisma.js';
import { CreateEventInput, UpdateEventInput } from './events.schemas.js';

export async function createEvent(data: CreateEventInput, ownerId: string) {
  return prisma.event.create({
    data: {
      ...data,
      date: new Date(data.date),
      ownerId,
    },
  });
}

export async function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

export async function updateEvent(id: string, data: UpdateEventInput) {
  return prisma.event.update({
    where: { id },
    data: {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
    },
  });
}

export async function deleteEvent(id: string) {
  // PRD § 4.3: Delete event only if no participants have paid.
  const paidParticipations = await prisma.participation.count({
    where: {
      eventId: id,
      paymentId: { not: null },
    },
  });

  if (paidParticipations > 0) {
    throw new Error('Cannot delete event with paid participants');
  }

  return prisma.event.delete({
    where: { id },
  });
}
