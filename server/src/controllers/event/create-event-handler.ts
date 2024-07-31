import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { createEventService } from '../../services/event/create-event-service'

const prisma = new PrismaClient()

export const createEventHandler = async (req: Request, res: Response) => {
  const { userId, data } = req.body

  if (!data) {
    res.sendStatus(400)
  }

  try {
    const parsedPrice = data.price ? parseFloat(data.price) : null
    const parsedEstimatedAttendees = data.estimatedAttendees
      ? parseInt(data.estimatedAttendees)
      : null
    const parsedEstimatedExpense = data.estimatedExpense
      ? parseFloat(data.estimatedExpense)
      : null
    const parsedDate = (value: string) => {
      return value ? new Date(value).toISOString() : null
    }

    const { committees, finances, ...rest } = data

    const values = {
      ...rest,
      startDateTime: parsedDate(data.startDateTime),
      endDateTime: parsedDate(data.endDateTime),
      category: data.category !== '' ? data.category : 'PERSONAL',
      audience: data.audience !== '' ? data.audience : 'ONLY_ME',
      price: parsedPrice,
      estimatedAttendees: parsedEstimatedAttendees,
      estimatedExpense: parsedEstimatedExpense,
    }

    const event = await createEventService({
      prisma,
      committees,
      finances,
      userId,
      values,
    })

    return res.status(200).json(event)
  } catch {
    return res.sendStatus(500)
  }
}
