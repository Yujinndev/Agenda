import { createEvent, fetchUserEvents } from '../controllers/eventController'
import { Router } from 'express'

export const eventRouter = () => {
  const router = Router()

  router.get('/myEvents', fetchUserEvents)
  router.post('/create', createEvent)

  return router
}
