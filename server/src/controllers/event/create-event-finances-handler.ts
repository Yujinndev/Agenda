import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { createEventFinancesService } from '../../services/event/create-event-finances-service'

const prisma = new PrismaClient()

export const createEventFinancesHandler = async (
  req: Request,
  res: Response,
) => {
  const { finances } = req.body.data

  if (!finances) {
    return res.sendStatus(404)
  }

  try {
    const financeMatrix = createEventFinancesService({
      prisma,
      eventId: finances[0].eventId,
      values: finances,
    })

    return res.status(200).json(financeMatrix)
  } catch {
    return res.sendStatus(500)
  }
}
