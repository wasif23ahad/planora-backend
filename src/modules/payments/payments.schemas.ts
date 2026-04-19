import { z } from 'zod';

export const checkoutSchema = z.object({
  body: z.object({
    eventId: z.string().min(1),
  }),
});
