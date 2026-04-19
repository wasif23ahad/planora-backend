import { Request, Response } from 'express';
import * as authService from './auth.service.js';
import { registerSchema, loginSchema } from './auth.schemas.js';

export async function register(req: Request, res: Response) {
  try {
    const validatedData = registerSchema.parse(req.body);
    const user = await authService.createUser(validatedData);

    const { passwordHash, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }
    res.status(400).json({ error: error.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { user, token } = await authService.authenticateUser(validatedData);

    const { passwordHash, ...userWithoutPassword } = user;
    res.status(200).json({ user: userWithoutPassword, token });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }
    res.status(401).json({ error: error.message });
  }
}

export async function getMe(req: Request, res: Response) {
  try {
    const user = await authService.getUserById(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { passwordHash, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

