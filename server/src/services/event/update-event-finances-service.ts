import { EventFinance, type PrismaClient } from '@prisma/client'
import { UnauthorizedError } from '../../utils/errors'
import { getEventData } from '../../data/event/get-event'
import { updateFinanceData } from '../../data/event/update-finance'
import { createHistoryLogData } from '../../data/history/create-history-log'
import { processFinances } from '../../helpers/separate-and-process-finances'

export type Finances = Omit<EventFinance, 'createdAt' | 'updatedAt'>
export type UpdateEventFinancesServiceArgs = {
  prisma: PrismaClient
  userId: string
  eventId: string
  values: Finances[]
}

export const updateEventFinancesService = async ({
  prisma,
  userId,
  eventId,
  values,
}: UpdateEventFinancesServiceArgs) => {
  const updatedRecord = await prisma.$transaction(async (prismaTx) => {
    const event = await getEventData({
      prisma: prismaTx,
      id: eventId,
    })
    if (event.organizerId !== userId) {
      throw new UnauthorizedError('User is not the organizer.')
    }

    const financesArrays = processFinances(values, event.finances)
    if (
      financesArrays.toCreate.length === 0 &&
      financesArrays.toUpdate.length === 0 &&
      financesArrays.toRemove.length === 0
    ) {
      console.log('No changes detected. Skipping update.')
      return event
    }

    if (financesArrays.toCreate.length > 0) {
      await prismaTx.eventFinance.createMany({
        data: financesArrays.toCreate,
      })
    }

    if (financesArrays.toRemove.length > 0) {
      await prismaTx.eventFinance.deleteMany({
        where: {
          id: {
            in: financesArrays.toRemove.map((finance) => finance.id),
          },
        },
      })
    }

    if (financesArrays.toUpdate.length > 0) {
      for (const updateFinance of financesArrays.toUpdate) {
        await updateFinanceData({
          prisma,
          id: updateFinance.id,
          values: updateFinance,
        })
      }
    }

    await createHistoryLogData({
      prisma: prismaTx,
      values: {
        message: 'Event finances were updated',
        action: 'UPDATED',
        email: event.organizer.email,
        eventId: event.id,
      },
    })

    return event
  })

  return updatedRecord
}
