import {
  Event,
  EventCommittee,
  EventFinance,
  type PrismaClient,
} from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { getUserData } from '../../data/user/get-user'
import { createEventData } from '../../data/event/create-event'
import { createFinanceData } from '../../data/event/create-finance'
import { createCommitteeData } from '../../data/committee/create-committee'
import { createHistoryLogData } from '../../data/history/create-history-log'
import { createSentEmailCommitteeData } from '../../data/committee/create-sent-email-committee'
import { sendEmailApprovalService } from './send-email-approval-service'
import { concatenateStrings } from '../../utils/concatenate-strings'
import { NotFoundError, ValidationError } from '../../utils/errors'

export type CreateEventServiceArgs = {
  prisma: PrismaClient
  committees: EventCommittee[]
  finances: EventFinance[]
  userId: string
  values: Event
}

export const createEventService = async ({
  prisma,
  committees,
  finances,
  userId,
  values,
}: CreateEventServiceArgs) => {
  const newEvent = await prisma.$transaction(async (prismaTx) => {
    const event = await createEventData({ prisma: prismaTx, values, userId })

    const organizer = await getUserData({
      prisma: prismaTx,
      id: event.organizerId,
    })

    if (!organizer) {
      throw new NotFoundError('No organizer found.')
    }

    const msg = event.status === 'DRAFT' ? 'Draft' : ''
    await createHistoryLogData({
      prisma: prismaTx,
      values: {
        message: `New Event ${msg}`,
        action: 'CREATED',
        email: organizer.email,
        eventId: event.id,
      },
    })

    if (finances.length > 0) {
      for (const finance of finances) {
        const parsedEstimatedCost = finance.estimatedAmount ?? 0
        const parsedActualCost = finance.actualAmount || new Decimal(0)

        await createFinanceData({
          prisma: prismaTx,
          values: {
            ...finance,
            eventId: event.id,
            estimatedAmount: parsedEstimatedCost,
            actualAmount: parsedActualCost,
          },
        })
      }
    }

    if (committees.length < 1) {
      return event
    }

    for (const committee of committees) {
      const committeeDetails = await getUserData({
        prisma,
        email: committee.email,
      }).catch((error) => console.log(error))

      await createCommitteeData({
        prisma: prismaTx,
        values: {
          userId: committeeDetails?.id ?? null,
          name:
            concatenateStrings(
              committeeDetails?.firstName,
              committeeDetails?.middleName,
              committeeDetails?.lastName,
            ) || null,
          email: committee?.email,
          eventId: event?.id,
        },
      })

      await createSentEmailCommitteeData({
        prisma: prismaTx,
        values: {
          committeeEmail: committee.email,
          isSent: false,
        },
      })
    }

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
