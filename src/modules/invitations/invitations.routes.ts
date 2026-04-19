import { Router } from 'express';
import * as invitationController from './invitations.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { respondInviteSchema } from './invitations.schemas.js';

const router = Router();

router.get('/me', requireAuth, invitationController.listMyInvites);
router.patch('/:id', requireAuth, validate(respondInviteSchema), invitationController.respond);

export default router;
