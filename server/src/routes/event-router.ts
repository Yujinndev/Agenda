import { Router } from 'express'
import { createEventHandler } from '../controllers/event/create-event-handler'
import { getUserEventsHandler } from '../controllers/event/get-user-events-handler'
import { getRequestedEventsHandler } from '../controllers/event/get-requested-events-handler'
import { createParticipantHandler } from '../controllers/event/create-participant-handler'
import { updateEventHandler } from '../controllers/event/update-event-handler'
import { resendEmailApprovalHandler } from '../controllers/event/resend-email-approval-handler'
import { createFinancesHandler } from '../controllers/event/create-finances-handler'
import { createGroupHandler } from '../controllers/event/create-group-handler'
import { createGroupParticipantHandler } from '../controllers/event/create-group-participant-handler'
import { createLeaveGroupParticipantHandler } from '../controllers/event/create-leave-group-participant-handler'

export const eventRouter = () => {
  const router = Router()

  router.post('/create', createEventHandler)
  router.post('/join', createParticipantHandler)
  router.post('/update', updateEventHandler)
  router.post('/send-request', resendEmailApprovalHandler)
  router.post('/finance-create', createFinancesHandler)
  router.get('/me/all', getUserEventsHandler)
  router.get('/me/c/requests', getRequestedEventsHandler)
  router.post('/create-group', createGroupHandler)
  router.post('/join-group', createGroupParticipantHandler)
  router.post('/leave-group', createLeaveGroupParticipantHandler)

  return router
}
