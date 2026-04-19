import { z } from 'zod';
import { InvitationStatus } from '@prisma/client';

export const sendInviteSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export const respondInviteSchema = z.object({
  body: z.object({
    status: z.enum([InvitationStatus.ACCEPTED, InvitationStatus.DECLINED]),
  }),
});
