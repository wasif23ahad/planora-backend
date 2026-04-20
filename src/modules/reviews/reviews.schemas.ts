import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(500).default(''),
  }),
});

export const updateReviewSchema = z.object({
  body: createReviewSchema.shape.body.partial(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>['body'];
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>['body'];
