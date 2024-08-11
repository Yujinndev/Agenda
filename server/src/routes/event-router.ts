import { Router } from 'express'
import { createEventHandler } from '../controllers/event/create-event-handler'
import { getUserEventsHandler } from '../controllers/event/get-user-events-handler'
import { updateEventToDoneHandler } from '../controllers/event/update-event-to-done-handler'
import { getRequestedEventsHandler } from '../controllers/event/get-requested-events-handler'
import { updateEventDetailsHandler } from '../controllers/event/update-event-details-handler'
import { resendEmailApprovalHandler } from '../controllers/event/resend-email-approval-handler'
import { createEventFinancesHandler } from '../controllers/event/create-event-finances-handler'
import { updateEventFinancesHandler } from '../controllers/event/update-event-finances-handler'
import { createEventParticipantHandler } from '../controllers/event/create-event-participant-handler'
import { createParticipantFeedbackHandler } from '../controllers/event/create-participant-feedback-handler'

export const eventRouter = () => {
  const router = Router()

  router.post('/create', createEventHandler)
  router.post('/join', createEventParticipantHandler)
  router.post('/update', updateEventDetailsHandler)
  router.post('/done', updateEventToDoneHandler)
  router.post('/approval/send-request', resendEmailApprovalHandler)
  router.post('/finance/create', createEventFinancesHandler)
  router.post('/finance/update', updateEventFinancesHandler)
  router.post('/participants/feedback', createParticipantFeedbackHandler)
  router.get('/me/all', getUserEventsHandler)
  router.get('/me/approval/get-requests', getRequestedEventsHandler)
  router.get('/me/c/requests', getRequestedEventsHandler)
  return router
}
