import { Request, Response, NextFunction } from 'express';
import * as notificationService from './notifications.service.js';

export async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const stats = await notificationService.getNotificationStats(userId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

export async function markAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    await notificationService.markAsRead(id as string, userId);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}
