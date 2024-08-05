import { EventFinance, type PrismaClient } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { getEventData } from '../../data/event/get-event'
import { createFinanceData } from '../../data/event/create-finance'

export type createEventFinancesServiceArgs = {
  prisma: PrismaClient
  eventId: string
  values: EventFinance[]
}

export const createEventFinancesService = async ({
  prisma,
  eventId,
  values,
}: createEventFinancesServiceArgs) => {
  const eventFinance = await prisma.$transaction(async (prismaTx) => {
    const event = await getEventData({
      prisma: prismaTx,
      id: eventId,
    })

    for (const finance of values) {
      const parsedEstimatedCost = finance.estimatedAmount ?? 0
      const parsedActualCost =
        finance.actualAmount?.toString() !== ''
          ? finance.actualAmount
          : new Decimal(0)

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
