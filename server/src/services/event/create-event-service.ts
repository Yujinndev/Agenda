import { Event, EventCommittee, type PrismaClient } from '@prisma/client'
import { createCommitteeData } from '../../data/committee/create-committee'
import { createEventData } from '../../data/event/create-event'
import { getUserData } from '../../data/user/get-user'
import { sendEmailApprovalService } from '../send-email-approval-service'
import { ValidationError } from '../../utils/errors'
import { concatenateStrings } from '../../utils/concatenate-strings'
import { createHistoryLogData } from '../../data/history/create-history-log'

export type CreateEventServiceArgs = {
  prisma: PrismaClient
  committees: EventCommittee[]
  userId: string
  values: Event
}

export const createEventService = async ({
  prisma,
  committees,
  userId,
  values,
}: CreateEventServiceArgs) => {
  const newEvent = await prisma.$transaction(async (prismaTx) => {
    const event = await createEventData({ prisma: prismaTx, values, userId })

    if (!event) throw new ValidationError('Event is not created.')

    if (committees.length < 1) {
      return event
    }

    for (const committee of committees) {
      let committeeId, committeeFullName

      try {
        const committeeDetails = await getUserData({
          prisma,
          email: committee.email,
        })

        committeeId = committeeDetails?.id
        committeeFullName = concatenateStrings(
          committeeDetails?.firstName,
          committeeDetails?.middleName,
          committeeDetails?.lastName,
        )
      } catch (error) {
        console.log(error)
      }

      await createCommitteeData({
        prisma: prismaTx,
        values: {
          userId: committeeId ?? null,
          name: committeeFullName || null,
          email: committee?.email,
          eventId: event?.id,
        },
      })

      await prismaTx.eventSentEmailCommittee.create({
        data: {
          committeeEmail: committee.email,
          isSent: false,
        },
      })
    }

    const organizer = await getUserData({
      prisma: prismaTx,
      id: event.organizerId,
    })

    await createHistoryLogData({
      prisma: prismaTx,
      values: {
        message: 'New Event',
        action: 'CREATED',
        email: organizer.email,
        eventId: event.id,
        committeeInquiryId: null,
      },
    })

    const firstCommittee: string = committees[0]?.email

    await sendEmailApprovalService({
      prisma: prismaTx,
      committeeEmail: firstCommittee,
      eventId: event.id,
    })

    return event
  })

  return newEvent
}
