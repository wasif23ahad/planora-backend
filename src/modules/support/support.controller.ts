import { Request, Response } from 'express';
import * as supportService from './support.service.js';
import { AppError } from '../../middleware/error.js';

export async function create(req: Request, res: Response, next: any) {
  try {
    const { content } = req.body;
    if (!content) {
      throw new AppError('Message content is required', 400);
    }

    const message = await supportService.createMessage(req.user!.id, content);
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
}

export async function list(req: Request, res: Response, next: any) {
  try {
    const messages = await supportService.getAllMessages();
    res.json(messages);
  } catch (error) {
    next(error);
  }
}
