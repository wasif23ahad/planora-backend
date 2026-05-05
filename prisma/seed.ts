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

  const manager = await prisma.user.create({
    data: {
      name: 'Operations Manager',
      email: 'manager@planora.com',
      passwordHash: hashedPassword,
      role: Role.MANAGER,
    },
  });

  const userDemo = await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'user@planora.com',
      passwordHash: hashedPassword,
      role: Role.USER,
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

  console.log('👥 Created users (Admin, Manager, UserDemo, Owner, Member).');

  // 3. Create Events
  const event1 = await prisma.event.create({
    data: {
      title: 'Tech Conference 2026',
      description: 'The biggest tech event of the year.',
      date: new Date('2026-09-15T10:00:00Z'), // Future
      venue: 'Online',
      category: 'Technology',
      coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865',
      visibility: Visibility.PUBLIC,
      feeCents: 50000,
      isFeatured: true,
      ownerId: owner.id,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'Local Hackathon (Free)',
      description: 'Join us for a 48h hackathon.',
      date: new Date('2026-10-01T09:00:00Z'), // Future
      venue: 'University Lab',
      category: 'Coding',
      coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
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
      date: new Date('2026-08-20T19:00:00Z'), // Future
      venue: 'Secret Terrace',
      category: 'Networking',
      coverImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de',
      visibility: Visibility.PRIVATE,
      feeCents: 0,
      isFeatured: false,
      ownerId: owner.id,
    },
  });

  const event4 = await prisma.event.create({
    data: {
      title: 'Dhaka Food Fest 2026',
      description: 'The ultimate culinary journey through the heart of Bangladesh.',
      date: new Date('2026-11-10T11:00:00Z'), // Future
      venue: 'Purbachal Convention City',
      category: 'Food',
      coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
      visibility: Visibility.PRIVATE,
      feeCents: 100000,
      isFeatured: true,
      ownerId: owner.id,
    },
  });

  const event5 = await prisma.event.create({
    data: {
      title: 'Lalbagh Fort Photography Walk',
      description: 'Capture the soul of Old Dhaka through your lens.',
      date: new Date('2026-02-05T15:00:00Z'), // Past
      venue: 'Lalbagh Fort, Old Dhaka',
      category: 'Arts',
      coverImage: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25',
      visibility: Visibility.PUBLIC,
      feeCents: 0,
      isFeatured: false,
      ownerId: owner.id,
    },
  });

  const event6 = await prisma.event.create({
    data: {
      title: 'Mirpur T20 Final Showdown',
      description: 'Experience the roar of the crowd at the home of cricket.',
      date: new Date('2026-12-20T18:00:00Z'), // Future
      venue: 'Sher-e-Bangla National Stadium, Mirpur',
      category: 'Sports',
      coverImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da',
      visibility: Visibility.PUBLIC,
      feeCents: 120000,
      isFeatured: true,
      ownerId: owner.id,
    },
  });

  const event7 = await prisma.event.create({
    data: {
      title: 'Traditional Pitha Mela',
      description: 'Celebrate the winter season with hundreds of varieties of traditional cakes.',
      date: new Date('2026-01-15T16:00:00Z'), // Past
      venue: 'Shilpakala Academy, Segunbagicha',
      category: 'Culture',
      coverImage: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9',
      visibility: Visibility.PUBLIC,
      feeCents: 10000,
      isFeatured: false,
      ownerId: owner.id,
    },
  });

  const event8 = await prisma.event.create({
    data: {
      title: 'Winter Networking Gala',
      description: 'Closing the year with the startup ecosystem.',
      date: new Date('2025-12-20T19:00:00Z'), // Past
      venue: 'The Westin, Gulshan 2',
      category: 'Business',
      coverImage: 'https://images.unsplash.com/photo-1556761175-b413da4baf72',
      visibility: Visibility.PUBLIC,
      feeCents: 250000,
      isFeatured: false,
      ownerId: owner.id,
    },
  });

  const event9 = await prisma.event.create({
    data: {
      title: 'Dhaka Tech Summit 2026',
      description: 'Join the brightest minds in Bangladesh for a day of innovation and networking.',
      date: new Date('2026-07-15T09:00:00Z'),
      venue: 'Bangabandhu International Conference Center, Dhaka',
      category: 'Technology',
      coverImage: '/images/events/dhaka_tech_summit.png',
      visibility: Visibility.PUBLIC,
      feeCents: 150000,
      isFeatured: true,
      ownerId: admin.id,
    },
  });

  const event10 = await prisma.event.create({
    data: {
      title: 'Chittagong Cricket Championship',
      description: 'The local league final featuring the best talent from the port city.',
      date: new Date('2026-08-05T14:00:00Z'),
      venue: 'Zohur Ahmed Chowdhury Stadium, Chittagong',
      category: 'Sports',
      coverImage: '/images/events/chittagong_cricket.png',
      visibility: Visibility.PUBLIC,
      feeCents: 30000,
      isFeatured: false,
      ownerId: owner.id,
    },
  });

  const event11 = await prisma.event.create({
    data: {
      title: 'Sylhet Tea Garden Meetup',
      description: 'A serene afternoon of networking and tea tasting in the hills of Sylhet.',
      date: new Date('2026-06-20T16:00:00Z'),
      venue: 'Lakkatura Tea Garden, Sylhet',
      category: 'Meetup',
      coverImage: '/images/events/sylhet_tea_meetup.png',
      visibility: Visibility.PUBLIC,
      feeCents: 0,
      isFeatured: true,
      ownerId: owner.id,
    },
  });

  const event12 = await prisma.event.create({
    data: {
      title: 'Dhaka Art & Culture Festival',
      description: 'Celebrating the rich heritage of Bangladesh through art, music, and dance.',
      date: new Date('2026-09-10T11:00:00Z'),
      venue: 'Shilpakala Academy, Dhaka',
      category: 'Culture',
      coverImage: '/images/events/dhaka_culture_fest.png',
      visibility: Visibility.PUBLIC,
      feeCents: 50000,
      isFeatured: false,
      ownerId: manager.id,
    },
  });

  const event13 = await prisma.event.create({
    data: {
      title: 'Sylhet Tech Innovators Meetup',
      description: 'Connecting developers and tech enthusiasts in the northern hub.',
      date: new Date('2026-10-12T18:00:00Z'),
      venue: 'Sylhet IT Park, Sylhet',
      category: 'Technology',
      coverImage: '/images/events/sylhet_tech_innovators.png',
      visibility: Visibility.PUBLIC,
      feeCents: 0,
      isFeatured: false,
      ownerId: owner.id,
    },
  });

  const event14 = await prisma.event.create({
    data: {
      title: 'Chittagong Port City Marathon',
      description: 'Run along the beautiful Marine Drive and experience the energy of the port city.',
      date: new Date('2026-11-20T06:00:00Z'),
      venue: 'Marine Drive, Chittagong',
      category: 'Sports',
      coverImage: '/images/events/chittagong_marathon.png',
      visibility: Visibility.PUBLIC,
      feeCents: 100000,
      isFeatured: true,
      ownerId: admin.id,
    },
  });

  console.log('📅 Created sample events (Dhaka, Sylhet, Chittagong set).');

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
