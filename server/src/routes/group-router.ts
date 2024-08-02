import { getUserGroupsHandler } from '../controllers/event/get-user-groups-handler'
import { getGroupEvents } from '../controllers/group/getGroupEvents'
import { Router } from 'express'

export const groupRouter = () => {
  const router = Router()

  router.get('/event/all', getGroupEvents)
  router.get('/me/all', getUserGroupsHandler)

  return router
}
