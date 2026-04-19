import { z } from 'zod';

export const toggleUserStatusSchema = z.object({
  body: z.object({
    isActive: z.boolean(),
  }),
});
