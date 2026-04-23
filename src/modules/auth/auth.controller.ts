import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service.js';
import { AppError } from '../../middleware/error.js';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.createUser(req.body);

    const { passwordHash, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error: any) {
    if (error.message === 'User already exists') {
      return next(new AppError(error.message, 409));
    }
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { user, token } = await authService.authenticateUser(req.body);

    const { passwordHash, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error: any) {
    if (error.message === 'Invalid credentials') {
      return next(new AppError(error.message, 401));
    }
    next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.getUserById(req.user!.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { passwordHash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.updateUser(req.user!.id, req.body);
    const { passwordHash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
}

export async function googleCallback(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Google authentication failed', 401);
    }

    const token = authService.generateToken(req.user as any);
    
    // Redirect to frontend with token
    // In production, you might want to use a more secure way to pass the token
    const redirectUrl = new URL(`${process.env.FRONTEND_URL}/login/success`);
    redirectUrl.searchParams.set('token', token);
    
    res.redirect(redirectUrl.toString());
  } catch (error) {
    next(error);
  }
}
