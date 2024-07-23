import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const createBudgetMatrixHandler = async (
  req: Request,
  res: Response,
) => {
  const { finance: finances } = req.body.data

  console.log('Received request with data:', JSON.stringify(finances, null, 2))

  if (!finances) {
    console.log('Error: Data is required')
    return res.status(400).json({ message: 'Data is required' })
  }

  try {
    const eventBudget = await prisma.$transaction(async (tx) => {
      // Find the event
      const event = await tx.event.findUnique({
        where: {
          id: finances[0].eventId,
        },
      })

      if (!event) {
        throw new Error('No event found with the provided ID')
      }

      // Create budget matrix one by one
      if (finances.length > 0) {
        for (const finance of finances) {
          const parsedEstimatedCost = finance.estimatedAmount
            ? parseFloat(finance.estimatedAmount)
            : 0
          const parsedActualCost = finance.actualAmount
            ? parseFloat(finance.actualAmount)
            : 0

          const newBudgetMatrix = await tx.eventBudget.create({
            data: {
              financeCategory: finance.financeCategory,
              transactionType: finance.transactionType,
              transactionDescription: finance.transactionDescription,
              serviceProvider: finance.serviceProvider,
              estimatedAmount: parsedEstimatedCost,
              actualAmount: parsedActualCost,
              eventId: event.id,
            },
          })
          console.log('Created new budget matrix:', newBudgetMatrix)
        }
      }
      return event
    })

    res.status(200).json(eventBudget)
  } catch (error) {
    console.error('Error creating budget matrix:', error)
    if (error instanceof Error) {
      console.log('Error message:', error.message)
      console.log('Error stack:', error.stack)
      res.status(400).json({ message: error.message, stack: error.stack })
    } else {
      console.log('Unknown error:', error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}
