import { prisma } from '../../config/prisma.js';
import { CreateEventInput, UpdateEventInput } from './events.schemas.js';

export async function createEvent(data: CreateEventInput, ownerId: string) {
  return prisma.event.create({
    data: {
      ...data,
      date: new Date(data.date as string),
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
      _count: {
        select: { participations: true },
      },
    },
  });
}

export async function updateEvent(id: string, data: UpdateEventInput) {
  return prisma.event.update({
    where: { id },
    data: {
      ...data,
      date: data.date ? new Date((data.date as string)) : undefined,
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

export async function getAllEvents(params: {
  q?: string;
  category?: string;
  sort?: string;
  page: number;
  limit: number;
}) {
  const { q, category, sort, page, limit } = params;
  const skip = (page - 1) * limit;

  const where: any = {
    visibility: 'PUBLIC', // Default to public for the main listing
  };

  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ];
  }

  if (category) {
    switch (category) {
      case 'public-free':
        where.visibility = 'PUBLIC';
        where.feeCents = 0;
        break;
      case 'public-paid':
        where.visibility = 'PUBLIC';
        where.feeCents = { gt: 0 };
        break;
      case 'private-free':
        where.visibility = 'PRIVATE';
        where.feeCents = 0;
        break;
      case 'private-paid':
        where.visibility = 'PRIVATE';
        where.feeCents = { gt: 0 };
        break;
    }
  }

  let orderBy: any = { date: 'asc' };
  if (sort) {
    switch (sort) {
      case 'date_asc':
        orderBy = { date: 'asc' };
        break;
      case 'date_desc':
        orderBy = { date: 'desc' };
        break;
      case 'price_asc':
        orderBy = { feeCents: 'asc' };
        break;
      case 'price_desc':
        orderBy = { feeCents: 'desc' };
        break;
    }
  }

  const [items, total] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        owner: { select: { name: true } },
      },
    }),
    prisma.event.count({ where }),
  ]);

  return { items, total, page, limit };
}

export async function getOwnedEvents(ownerId: string) {
  return prisma.event.findMany({
    where: { ownerId },
    orderBy: { createdAt: 'desc' },
    include: {
      owner: { select: { id: true, name: true } },
      _count: { select: { participations: true } },
    },
  });
}

export async function getFeaturedEvent() {
  return prisma.event.findFirst({
    where: { isFeatured: true, visibility: 'PUBLIC' },
    orderBy: { date: 'asc' },
    include: {
      owner: { select: { name: true } },
    },
  });
}
