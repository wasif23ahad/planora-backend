import { Request, Response, NextFunction } from 'express';
import * as participationService from './participations.service.js';
import * as eventService from '../events/events.service.js';
import { AppError } from '../../middleware/error.js';

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

export async function getEventParticipants(req: Request, res: Response, next: NextFunction) {
  try {
    const eventId = req.params.id as string;
    const event = await eventService.getEventById(eventId);

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    if (event.ownerId !== req.user!.id) {
      throw new AppError('Forbidden: you do not own this event', 403);
    }

    const participants = await participationService.getParticipantsByEvent(eventId);
    res.json(participants);
  } catch (error) {
    next(error);
  }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { eventId, userId } = req.params;
    const { status } = req.body;

    const event = await eventService.getEventById(eventId as string);
    if (!event) {
      throw new AppError('Event not found', 404);
    }

    if (event.ownerId !== req.user!.id) {
      throw new AppError('Forbidden: you do not own this event', 403);
    }

    const participation = await participationService.updateParticipationStatus(
      eventId as string,
      userId as string,
      status
    );

    res.json(participation);
  } catch (error) {
    next(error);
  }
}
