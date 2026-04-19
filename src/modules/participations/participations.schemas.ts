import { z } from 'zod';
import { ParticipationStatus } from '@prisma/client';

export const updateParticipationStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(ParticipationStatus),
  }),
});
