import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { updateEventToDoneService } from '../../services/event/update-event-to-done-service'

const prisma = new PrismaClient()

export const updateEventToDoneHandler = async (req: Request, res: Response) => {
  const { data, userId } = req.body

  if (!data) {
    return res.sendStatus(404)
  }

  try {
    const event = await updateEventToDoneService({
      prisma,
      userId,
      eventId: data.eventId,
    })

    return res.status(200).json(event)
  } catch {
    return res.sendStatus(500)
  }
}
