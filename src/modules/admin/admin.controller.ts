import { Request, Response, NextFunction } from 'express';
import * as adminService from './admin.service.js';
import * as eventService from '../events/events.service.js';

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await adminService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function toggleUserStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const user = await adminService.updateUserStatus(id as string, isActive);
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function getEvents(req: Request, res: Response, next: NextFunction) {
  try {
    const events = await adminService.getAllEvents();
    res.json(events);
  } catch (error) {
    next(error);
  }
}

export async function deleteEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await eventService.deleteEvent(id as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function toggleFeature(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const event = await adminService.toggleEventFeatured(id as string);
    res.json(event);
  } catch (error) {
    next(error);
  }
}

export async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await adminService.getStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
}
