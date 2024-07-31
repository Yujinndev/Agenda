import { EventFinance, type PrismaClient } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { ValidationError } from '../../utils/errors'
import { getEventData } from '../../data/event/get-event'
import { createFinanceData } from '../../data/event/create-finance'

export type createFinancesServiceArgs = {
  prisma: PrismaClient
  eventId: string
  values: EventFinance[]
}

export const createFinancesService = async ({
  prisma,
  eventId,
  values,
}: createFinancesServiceArgs) => {
  const eventFinance = await prisma.$transaction(async (prismaTx) => {
    const event = await getEventData({
      prisma: prismaTx,
      id: eventId,
    })

    if (!event) {
      throw new ValidationError('No event found with the provided ID')
    }

    for (const finance of values) {
      const parsedEstimatedCost = finance.estimatedAmount ?? 0
      const parsedActualCost = finance.actualAmount ?? new Decimal(0)

      await createFinanceData({
        prisma: prismaTx,
        values: {
          ...finance,
          estimatedAmount: parsedEstimatedCost,
          actualAmount: parsedActualCost,
        },
      })
    }

    return event
  })

  return eventFinance
}
