import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { updateEventFinancesService } from '../../services/event/update-event-finances-service'

const prisma = new PrismaClient()

export const updateEventFinancesHandler = async (
  req: Request,
  res: Response,
) => {
  const { data, userId } = req.body

  if (!data) {
    return res.sendStatus(404)
  }

  try {
    const { finances } = data

    const eventFinance = await updateEventFinancesService({
      prisma,
      userId,
      eventId: finances[0].eventId,
      values: finances,
    })

    return res.status(200).json(eventFinance)
  } catch {
    return res.sendStatus(500)
  }
}
