import { z } from 'zod';
import { Visibility } from '@prisma/client';

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(120),
    description: z.string().max(5000),
    date: z.string().refine((val) => new Date(val) > new Date(), {
      message: 'Event date must be in the future',
    }),
    venue: z.string().min(1),
    category: z.string().min(1),
    visibility: z.nativeEnum(Visibility),
    feeCents: z.coerce.number().int().min(0).default(0),
    coverImage: z.string().url().optional().nullable(),
  }),
});

export const updateEventSchema = z.object({
  body: createEventSchema.shape.body.partial().extend({
    date: z.string().refine((val) => new Date(val) > new Date(), {
      message: 'Event date must be in the future',
    }).optional(),
  }),
});

export type CreateEventInput = z.infer<typeof createEventSchema>['body'];
export type UpdateEventInput = z.infer<typeof updateEventSchema>['body'];
