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

export async function deleteUser(id: string) {
  // Must manually delete payments first — Payment.userId has no cascade rule
  await prisma.payment.deleteMany({ where: { userId: id } });
  return prisma.user.delete({ where: { id } });
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

export async function getCharts() {
  const since = new Date();
  since.setMonth(since.getMonth() - 11);
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  // Parallelize all primary DB fetches
  const [eventsByCategoryRaw, users, payments] = await Promise.all([
    prisma.event.groupBy({
      by: ['category'],
      _count: { _all: true },
      orderBy: { _count: { category: 'desc' } },
    }),
    prisma.user.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    }),
    prisma.payment.findMany({
      where: { status: 'SUCCEEDED' },
      select: { amountCents: true, event: { select: { id: true, title: true } } },
    }),
  ]);

  // Line Chart Logic: user signups per month
  const months: { key: string; label: string; count: number }[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(since);
    d.setMonth(since.getMonth() + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('en-US', { month: 'short' });
    months.push({ key, label, count: 0 });
  }
  for (const u of users) {
    const k = `${u.createdAt.getFullYear()}-${String(u.createdAt.getMonth() + 1).padStart(2, '0')}`;
    const slot = months.find(m => m.key === k);
    if (slot) slot.count++;
  }

  // Pie Chart Logic: revenue by event
  const byEvent = new Map<string, { title: string; amountCents: number }>();
  for (const p of payments) {
    const id = p.event.id;
    const cur = byEvent.get(id) ?? { title: p.event.title, amountCents: 0 };
    cur.amountCents += p.amountCents;
    byEvent.set(id, cur);
  }
  const sorted = [...byEvent.values()].sort((a, b) => b.amountCents - a.amountCents);
  const top = sorted.slice(0, 6);
  const otherTotal = sorted.slice(6).reduce((s, x) => s + x.amountCents, 0);
  const revenueByEvent = otherTotal > 0
    ? [...top, { title: 'Other', amountCents: otherTotal }]
    : top;

  return {
    eventsByCategory: eventsByCategoryRaw.map(r => ({ category: r.category, count: r._count._all })),
    signupsByMonth: months,
    revenueByEvent,
  };
}

export async function getAllReviews() {
  return prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      event: { select: { id: true, title: true } },
      user: { select: { id: true, name: true } },
    },
  });
}
