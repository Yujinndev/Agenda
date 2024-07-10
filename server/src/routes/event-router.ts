import { Router } from 'express'

import { getEventHandler } from '../controllers/event/get-event'
import { createEventHandler } from '../controllers/event/create-event'
import { getUserEventsHandler } from '../controllers/event/get-user-events'

export const eventRouter = () => {
  const router = Router()

  router.post('/create', createEventHandler)
  router.get('/:id', getEventHandler)
  router.get('/me/all', getUserEventsHandler)

  return router
}
