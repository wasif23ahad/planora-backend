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
      venue: 'Online',
      category: 'Technology',
      coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865',
      visibility: Visibility.PUBLIC,
      feeCents: 50000, // Public Paid: ৳500.00
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
      coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
      visibility: Visibility.PUBLIC,
      feeCents: 0, // Public Free
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
      coverImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de',
      visibility: Visibility.PRIVATE,
      feeCents: 0, // Private Free
      isFeatured: false,
      ownerId: owner.id,
    },
  });

  const event4 = await prisma.event.create({
    data: {
      title: 'Dhaka Food Fest 2026',
      description: 'The ultimate culinary journey through the heart of Bangladesh. Sample the finest street food and gourmet delights.',
      date: new Date('2026-11-10T11:00:00Z'),
      venue: 'Purbachal International Convention City',
      category: 'Food',
      coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
      visibility: Visibility.PRIVATE,
      feeCents: 100000, // Private Paid: ৳1,000.00
      isFeatured: true,
      ownerId: owner.id,
    },
  });

  const event5 = await prisma.event.create({
    data: {
      title: 'Lalbagh Fort Photography Walk',
      description: 'Capture the soul of Old Dhaka through your lens. A guided tour focusing on architectural history and light.',
      date: new Date('2026-07-05T15:00:00Z'),
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
      description: 'Experience the roar of the crowd at the home of cricket. The most anticipated match of the regional championship.',
      date: new Date('2026-12-20T18:00:00Z'),
      venue: 'Sher-e-Bangla National Stadium, Mirpur',
      category: 'Sports',
      coverImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da',
      visibility: Visibility.PUBLIC,
      feeCents: 120000, // ৳1,200.00
      isFeatured: true,
      ownerId: owner.id,
    },
  });

  const event7 = await prisma.event.create({
    data: {
      title: 'Traditional Pitha Mela',
      description: 'Celebrate the winter season with hundreds of varieties of traditional cakes and local folklore performances.',
      date: new Date('2026-01-15T16:00:00Z'),
      venue: 'Shilpakala Academy, Segunbagicha',
      category: 'Culture',
      coverImage: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9',
      visibility: Visibility.PUBLIC,
      feeCents: 10000, // ৳100.00
      isFeatured: false,
      ownerId: owner.id,
    },
  });

  const event8 = await prisma.event.create({
    data: {
      title: 'Startup Dhaka Bootcamp',
      description: 'Three days of intensive building, mentoring, and investor pitches for the next generation of entrepreneurs.',
      date: new Date('2026-05-12T09:00:00Z'),
      venue: 'The Westin, Gulshan 2',
      category: 'Business',
      coverImage: 'https://images.unsplash.com/photo-1556761175-b413da4baf72',
      visibility: Visibility.PUBLIC,
      feeCents: 250000, // ৳2,500.00
      isFeatured: false,
      ownerId: owner.id,
    },
  });

  console.log('📅 Created sample events (Dhaka set).');

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
