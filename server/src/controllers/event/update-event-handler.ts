import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { updateEventService } from '../../services/event/update-event-service'

const prisma = new PrismaClient()

export const updateEventHandler = async (req: Request, res: Response) => {
  const { data, email } = req.body

  if (!data.id) {
    return res.sendStatus(404)
  }

  const parsedPrice = parseFloat(data.price) ?? 0
  const parsedEstimatedAttendees = parseInt(data.estimatedAttendees) ?? 0
  const parsedEstimatedExpense = parseFloat(data.estimatedExpense) ?? 0

  const values = {
    ...data,
    price: parsedPrice,
    estimatedAttendees: parsedEstimatedAttendees,
    estimatedExpense: parsedEstimatedExpense,
  }

  const event = await updateEventService({
    values,
    id: data.id,
    userEmail: email,
    prisma,
  })

  return res.status(200).json(event)
}
