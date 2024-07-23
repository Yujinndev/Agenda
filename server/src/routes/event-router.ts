import { Router } from 'express'

import { getEventHandler } from '../controllers/event/get-event'
import { createEventHandler } from '../controllers/event/create-event'
import { getUserEventsHandler } from '../controllers/event/get-user-events'
import { getRequestedEventsForCommitteeUserData } from '../controllers/event/get-requested-events-committee-user'

export const eventRouter = () => {
  const router = Router()

  router.post('/create', createEventHandler)
  router.post('/join', createParticipantHandler)
  router.post('/update', updateEventHandler)
  router.get('/me/all', getUserEventsHandler)
  router.get('/me/c/requests', getRequestedEventsHandler)
  router.post('/me/c/finance', createBudgetMatrixHandler)
  router.get('/me/c/finance/:id', getBudgetMatrixHandler)

  return router
}
