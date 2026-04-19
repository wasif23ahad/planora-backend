import { Router } from 'express';
import * as eventController from './events.controller.js';
import * as participationController from '../participations/participations.controller.js';
import * as invitationController from '../invitations/invitations.controller.js';
import * as reviewController from '../reviews/reviews.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createEventSchema, updateEventSchema } from './events.schemas.js';
import { createReviewSchema } from '../reviews/reviews.schemas.js';
import { updateParticipationStatusSchema } from '../participations/participations.schemas.js';
import { sendInviteSchema } from '../invitations/invitations.schemas.js';

const router = Router();

router.get('/', eventController.list);
router.get('/featured', eventController.featured);
router.post('/', requireAuth, validate(createEventSchema), eventController.create);
router.get('/:id', eventController.getById);
router.patch('/:id', requireAuth, validate(updateEventSchema), eventController.update);
router.delete('/:id', requireAuth, eventController.remove);
router.post('/:id/join', requireAuth, participationController.join);

// Participant management (Owner only)
router.get('/:id/participants', requireAuth, participationController.getEventParticipants);
router.patch('/:id/participants/:userId', requireAuth, validate(updateParticipationStatusSchema), participationController.updateStatus);
router.post('/:id/invite', requireAuth, validate(sendInviteSchema), invitationController.sendInvite);

// Reviews (Event-specific)
router.post('/:id/reviews', requireAuth, validate(createReviewSchema), reviewController.create);
router.get('/:id/reviews', reviewController.listForEvent);

export default router;
