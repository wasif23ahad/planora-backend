import { Request, Response } from 'express';
import * as eventService from './events.service.js';
import { createEventSchema, updateEventSchema } from './events.schemas.js';
import { AppError } from '../../middleware/error.js';

export async function create(req: Request, res: Response, next: any) {
  try {
    const eventData = { ...req.body };
    if (req.file) {
      eventData.coverImage = (req.file as any).path;
    }
    const event = await eventService.createEvent(eventData, req.user!.id);
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

    const eventData = { ...req.body };
    if (req.file) {
      eventData.coverImage = (req.file as any).path;
    }

    const updatedEvent = await eventService.updateEvent(req.params.id as string, eventData);
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

export async function list(req: Request, res: Response, next: any) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;

    const result = await eventService.getAllEvents({
      q: req.query.q as string,
      category: req.query.category as string,
      sort: req.query.sort as string,
      page,
      limit,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function featured(req: Request, res: Response, next: any) {
  try {
    const event = await eventService.getFeaturedEvent();
    if (!event) {
      return res.status(404).json({ error: 'No featured event found' });
    }
    res.json(event);
  } catch (error) {
    next(error);
  }
}
