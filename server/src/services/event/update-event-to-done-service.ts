import { type PrismaClient } from '@prisma/client'
import { UnauthorizedError } from '../../utils/errors'
import { getEventData } from '../../data/event/get-event'
import { updateEventData } from '../../data/event/update-event'
import { createHistoryLogData } from '../../data/history/create-history-log'

export type UpdateEventToDoneServiceArgs = {
  prisma: PrismaClient
  userId: string
  eventId: string
}

export const updateEventToDoneService = async ({
  prisma,
  userId,
  eventId,
}: UpdateEventToDoneServiceArgs) => {
  const updatedRecord = await prisma.$transaction(async (prismaTx) => {
    const event = await getEventData({ prisma: prismaTx, id: eventId })

    if (event.organizerId !== userId) {
      throw new UnauthorizedError('User is not the organizer.')
    }

    const updatedEvent = await updateEventData({
      prisma: prismaTx,
      id: eventId,
      values: {
        status: 'DONE',
      },
    })

    await createHistoryLogData({
      prisma: prismaTx,
      values: {
        message: 'Event was marked as done',
        action: 'UPDATED',
        email: updatedEvent.organizer.email,
        eventId: updatedEvent.id,
      },
    })

    return updatedEvent
  })

  return updatedRecord
}
