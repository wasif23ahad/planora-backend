import { prisma } from '../../config/prisma.js';
import { hashPassword, comparePassword } from '../../lib/password.js';
import { signToken } from '../../lib/jwt.js';
import { RegisterInput, LoginInput } from './auth.schemas.js';

export async function createUser(data: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
    },
  });

  return user;
}

export async function authenticateUser(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user || !user.isActive || !user.passwordHash) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await comparePassword(data.password, user.passwordHash);

  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  const token = signToken({ sub: user.id, role: user.role });

  return { user, token };
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function updateUser(id: string, data: { name?: string, phoneNumber?: string }) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

export function generateToken(user: { id: string, role: string }) {
  return signToken({ sub: user.id, role: user.role });
}
