import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { updateEventDetailsService } from '../../services/event/update-event-details-service'

const prisma = new PrismaClient()

export const updateEventDetailsHandler = async (
  req: Request,
  res: Response,
) => {
  const { data, userId } = req.body

  if (!data) {
    return res.sendStatus(404)
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

    const {
      id,
      createdAt,
      updatedAt,
      organizerId,
      organizer,
      committees,
      eventHistoryLogs,
      participants,
      finances,
      saveFlag,
      ...rest
    } = data

    let statuss

    if (saveFlag === '') {
      statuss = 'DONE'
    }

    const status = saveFlag!
      ? saveFlag === 'SAVE_ALL'
        ? committees.length > 0
          ? 'ON_HOLD'
          : 'UPCOMING'
        : 'DRAFT'
      : 'DONE'

    const values = {
      ...rest,
      startDateTime: parsedDate(data.startDateTime),
      endDateTime: parsedDate(data.endDateTime),
      category: data.category !== '' ? data.category : 'PERSONAL',
      audience: data.audience !== '' ? data.audience : 'ONLY_ME',
      price: parsedPrice,
      estimatedAttendees: parsedEstimatedAttendees,
      estimatedExpense: parsedEstimatedExpense,
      status,
    }

    const event = await updateEventDetailsService({
      values,
      committees,
      userId,
      eventId: id,
      prisma,
    })

    return res.status(200).json(event)
  } catch {
    return res.sendStatus(500)
  }
}
