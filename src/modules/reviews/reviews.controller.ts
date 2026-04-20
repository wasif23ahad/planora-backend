import { Request, Response, NextFunction } from 'express';
import * as reviewService from './reviews.service.js';
import { createReviewSchema, updateReviewSchema } from './reviews.schemas.js';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: eventId } = req.params;
    const review = await reviewService.createReview(eventId as string, req.user!.id, req.body);
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
}

export async function listForEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: eventId } = req.params;
    const reviews = await reviewService.getReviewsByEvent(eventId as string);
    res.json(reviews);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const review = await reviewService.updateReview(id as string, req.user!.id, req.body);
    res.json(review);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const isAdmin = req.user!.role === 'ADMIN';
    await reviewService.deleteReview(id as string, req.user!.id, isAdmin);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function listGiven(req: Request, res: Response, next: NextFunction) {
  try {
    const reviews = await reviewService.getReviewsByUser(req.user!.id);
    res.json(reviews);
  } catch (error) {
    next(error);
  }
}

export async function listReceived(req: Request, res: Response, next: NextFunction) {
  try {
    const reviews = await reviewService.getReviewsForOwnedEvents(req.user!.id);
    res.json(reviews);
  } catch (error) {
    next(error);
  }
}
