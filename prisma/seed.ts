import { PrismaClient, Role, Visibility } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean data
  await prisma.review.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.participation.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing data.');

  // 2. Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@planora.com',
      passwordHash: hashedPassword,
      role: Role.ADMIN,
    },
  });

  const owner = await prisma.user.create({
    data: {
      name: 'Event Organizer',
      email: 'owner@planora.com',
      passwordHash: hashedPassword,
      role: Role.USER,
    },
  });

  const member = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash: hashedPassword,
      role: Role.USER,
    },
  });

  console.log('👥 Created users (Admin, Owner, Member).');

  // 3. Create Events
  const event1 = await prisma.event.create({
    data: {
      title: 'Tech Conference 2026',
      description: 'The biggest tech event of the year.',
      date: new Date('2026-09-15T10:00:00Z'),
      venue: 'Convention Center, NYC',
      category: 'Technology',
      visibility: Visibility.PUBLIC,
      feeCents: 5000, // $50.00
      isFeatured: true,
      ownerId: owner.id,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'Local Hackathon (Free)',
      description: 'Join us for a 48h hackathon.',
      date: new Date('2026-10-01T09:00:00Z'),
      venue: 'University Lab',
      category: 'Coding',
      visibility: Visibility.PUBLIC,
      feeCents: 0,
      isFeatured: false,
      ownerId: owner.id,
    },
  });

  const event3 = await prisma.event.create({
    data: {
      title: 'Private Founder Dinner',
      description: 'Strictly by invitation.',
      date: new Date('2026-08-20T19:00:00Z'),
      venue: 'Secret Terrace',
      category: 'Networking',
      visibility: Visibility.PRIVATE,
      feeCents: 0,
      isFeatured: false,
      ownerId: owner.id,
    },
  });

  console.log('📅 Created sample events (Public Paid, Public Free, Private).');

  // 4. Create Participations
  await prisma.participation.create({
    data: {
      eventId: event2.id,
      userId: member.id,
      status: 'APPROVED',
    },
  });

  console.log('🤝 Added a participant to the Hackathon.');

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
