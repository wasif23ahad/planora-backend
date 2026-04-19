import { Router } from 'express';
import * as invitationController from './invitations.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.get('/me', requireAuth, invitationController.listMyInvites);
router.patch('/:id', requireAuth, invitationController.respond);

export default router;
