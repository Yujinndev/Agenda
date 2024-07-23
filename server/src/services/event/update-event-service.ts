import { Event, EventCommittee, type PrismaClient } from '@prisma/client'
import { createHistoryLogData } from '../../data/history/create-history-log'
import { updateEventData } from '../../data/event/update-event'
import { getUserData } from '../../data/user/get-user'
import { ValidationError } from '../../utils/errors'

export type UpdateEventServiceArgs = {
  prisma: PrismaClient
  committees: EventCommittee[]
  id: string
  values: Partial<Event>
}

export const updateEventService = async ({
  prisma,
  committees,
  id,
  values,
}: UpdateEventServiceArgs) => {
  const updatedRecord = await prisma.$transaction(async (prismaTx) => {
    const event = await updateEventData({ prisma: prismaTx, id, values })

    if (!event) throw new ValidationError('Event is not updated.')
    const organizer = await getUserData({
      prisma: prismaTx,
      id: event.organizerId,
    })

    await createHistoryLogData({
      prisma: prismaTx,
      values: {
        message: 'Event details were updated',
        action: 'UPDATED',
        email: organizer.email,
        eventId: event.id,
      },
    })

    if (committees.length < 1) {
      return event
    }

    return event
  })

  return updatedRecord
}
