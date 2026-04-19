import { Request, Response, NextFunction } from 'express';
import * as invitationService from './invitations.service.js';
import * as eventService from '../events/events.service.js';
import { AppError } from '../../middleware/error.js';

export async function sendInvite(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: eventId } = req.params;
    const { email } = req.body;

    const event = await eventService.getEventById(eventId as string);
    if (!event || event.ownerId !== req.user!.id) {
      throw new AppError('Forbidden: you do not own this event', 403);
    }

    if (!email) throw new AppError('Recipient email is required', 400);

    const invitation = await invitationService.createInvitation(eventId as string, req.user!.id, email);
    res.status(201).json(invitation);
  } catch (error) {
    next(error);
  }
}

export async function listMyInvites(req: Request, res: Response, next: NextFunction) {
  try {
    const invitations = await invitationService.getMyInvitations(req.user!.id);
    res.json(invitations);
  } catch (error) {
    next(error);
  }
}

export async function respond(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: invitationId } = req.params;
    const { status } = req.body;

    if (!['ACCEPTED', 'DECLINED'].includes(status)) {
      throw new AppError('Invalid status', 400);
    }

    const invitation = await invitationService.updateInvitationStatus(
      invitationId as string,
      req.user!.id,
      status
    );

    res.json(invitation);
  } catch (error) {
    next(error);
  }
}
