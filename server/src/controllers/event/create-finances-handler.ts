import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { createFinancesService } from '../../services/event/create-finances-service'

const prisma = new PrismaClient()

export const createFinancesHandler = async (req: Request, res: Response) => {
  const { finances } = req.body.data

  if (!finances) {
    return res.sendStatus(404)
  }

  const financeMatrix = createFinancesService({
    prisma,
    values: finances,
  })

  res.status(200).json(financeMatrix)
}
