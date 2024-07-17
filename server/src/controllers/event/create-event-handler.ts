import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { createEventService } from '../../services/event/create-event-service'

const prisma = new PrismaClient()

export const createEventHandler = async (req: Request, res: Response) => {
  const { userId, data } = req.body

  if (!data) {
    res.sendStatus(400)
  }

  const parsedPrice = parseFloat(data.price) ?? 0
  const parsedEstimatedAttendees = parseInt(data.estimatedAttendees) ?? 0
  const parsedEstimatedExpense = parseFloat(data.estimatedExpense) ?? 0

  const { committees, ...rest } = data

  const values = {
    ...rest,
    startDateTime: new Date(data.startDateTime).toISOString(),
    endDateTime: new Date(data.endDateTime).toISOString(),
    price: parsedPrice,
    estimatedAttendees: parsedEstimatedAttendees,
    estimatedExpense: parsedEstimatedExpense,
  }

  const event = await createEventService({
    prisma,
    committees,
    userId,
    values,
  })

  return res.status(200).json(event)
}
