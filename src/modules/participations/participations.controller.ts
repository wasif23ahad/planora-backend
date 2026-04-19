import { Request, Response, NextFunction } from 'express';
import * as participationService from './participations.service.js';

export async function join(req: Request, res: Response, next: NextFunction) {
  try {
    const eventId = req.params.id as string;
    const userId = req.user!.id;

    const participation = await participationService.joinEvent(eventId, userId);
    
    res.status(201).json(participation);
  } catch (error) {
    next(error);
  }
}
