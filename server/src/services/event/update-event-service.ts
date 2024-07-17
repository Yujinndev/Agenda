import { Event, type PrismaClient } from '@prisma/client'
import { createHistoryLogData } from '../../data/history/create-history-log'
import { updateEventData } from '../../data/event/update-event'
import { ValidationError } from '../../utils/errors'

export type UpdateEventServiceArgs = {
  prisma: PrismaClient
  id: string
  userEmail: string
  values: Partial<Event>
}

export const updateEventService = async ({
  prisma,
  id,
  userEmail,
  values,
}: UpdateEventServiceArgs) => {
  const updatedRecord = await prisma.$transaction(async (prismaTx) => {
    const event = await updateEventData({ prisma: prismaTx, id, values })

    if (!event) throw new ValidationError('Event is not updated.')

    await createHistoryLogData({
      prisma: prismaTx,
      values: {
        message: 'Event details were updated',
        action: 'UPDATED',
        email: userEmail,
        eventId: event.id,
        committeeInquiryId: null,
      },
    })

    return event
  })

  return updatedRecord
}
