import { Request, Response } from 'express';
import * as eventService from './events.service.js';
import { createEventSchema, updateEventSchema } from './events.schemas.js';
import { AppError } from '../../middleware/error.js';

export async function create(req: Request, res: Response, next: any) {
  try {
    const validatedData = createEventSchema.parse(req.body);
    const event = await eventService.createEvent(validatedData, req.user!.id);
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: any) {
  try {
    const event = await eventService.getEventById(req.params.id as string);
    if (!event) {
      throw new AppError('Event not found', 404);
    }
    res.json(event);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: any) {
  try {
    const event = await eventService.getEventById(req.params.id as string);
    if (!event) {
      throw new AppError('Event not found', 404);
    }

    if (event.ownerId !== req.user!.id) {
      throw new AppError('Forbidden: you do not own this event', 403);
    }

    const validatedData = updateEventSchema.parse(req.body);
    const updatedEvent = await eventService.updateEvent(req.params.id as string, validatedData);
    res.json(updatedEvent);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: any) {
  try {
    const event = await eventService.getEventById(req.params.id as string);
    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // Owners and Admins can delete
    if (event.ownerId !== req.user!.id && req.user!.role !== 'ADMIN') {
      throw new AppError('Forbidden: you do not own this event', 403);
    }

    await eventService.deleteEvent(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
