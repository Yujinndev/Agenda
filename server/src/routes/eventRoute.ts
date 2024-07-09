import {
  createEvent,
  fetchAllPublicEvents,
  fetchSingleEvent,
  fetchUserEvents,
} from '../controllers/eventController'
import { Router } from 'express'

export const eventRouter = () => {
  const router = Router()

  router.post('/create', createEvent)
  router.get('/myEvents', fetchUserEvents)
  router.get('/item/:id', fetchSingleEvent)

  return router
}
