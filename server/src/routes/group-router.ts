import { Router } from 'express'
import { getGroupHandler } from '../controllers/group/get-group-handler'
import { createGroupHandler } from '../controllers/group/create-group-handler'
import { getUserGroupsHandler } from '../controllers/group/get-user-groups-handler'
import { getGroupEventsHandler } from '../controllers/group/get-group-events-handler'
import { createGroupParticipantHandler } from '../controllers/group/create-group-participant-handler'
import { deleteGroupParticipantHandler } from '../controllers/group/delete-group-participant-handler'

export const groupRouter = () => {
  const router = Router()

  router.get('/:id', getGroupHandler)
  router.get('/me/all', getUserGroupsHandler)
  router.get('/events/:id', getGroupEventsHandler)
  router.post('/create', createGroupHandler)
  router.post('/join', createGroupParticipantHandler)
  router.post('/leave', deleteGroupParticipantHandler)
  return router
}
