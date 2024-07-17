import { Router } from 'express'
import { createEventHandler } from '../controllers/event/create-event-handler'
import { getUserEventsHandler } from '../controllers/event/get-user-events-handler'
import { getRequestedEventsHandler } from '../controllers/event/get-requested-events-handler'
import { createParticipantHandler } from '../controllers/event/create-participant-handler'
import { updateEventHandler } from '../controllers/event/update-event-handler'

export const eventRouter = () => {
  const router = Router()

  router.post('/create', createEventHandler)
  router.post('/join', createParticipantHandler)
  router.post('/update', updateEventHandler)
  router.get('/me/all', getUserEventsHandler)
  router.get('/me/c/requests', getRequestedEventsHandler)

  return router
}
