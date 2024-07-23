import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const getBudgetMatrixHandler = async (req: Request, res: Response) => {
  const { id } = req.params

  if (!id) {
    return res.sendStatus(403) // Forbidden if no eventId is provided
  }

  try {
    const event = await prisma.event.findUnique({
      where: {
        id: id,
      },
    })

    if (!event) {
      return res.sendStatus(404)
    }

    const eventBudgets = await prisma.eventBudget.findMany({
      where: {
        eventId: id,
      },
    })

    if (eventBudgets.length > 0) {
      return res.status(200).json(eventBudgets)
    } else {
      return res.sendStatus(404) // Not found if no budget matrices are found
    }
  } catch (error) {
    return res.sendStatus(500) // Internal server error
  }
}
