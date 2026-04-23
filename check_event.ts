import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const event = await prisma.event.findUnique({
    where: { id: 'cmoaa714h000eph8kbnzky243' }
  });
  console.log('Event:', event);
}

check().catch((error) => {
  console.error(error);
  throw error;
});
