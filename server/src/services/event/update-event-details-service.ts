import { Event, EventCommittee, type PrismaClient } from '@prisma/client'
import { createHistoryLogData } from '../../data/history/create-history-log'
import { updateEventData } from '../../data/event/update-event'
import { getUserData } from '../../data/user/get-user'
import { UnauthorizedError } from '../../utils/errors'
import { getCommitteesData } from '../../data/committee/get-committees'
import { createCommitteeData } from '../../data/committee/create-committee'
import { updateCommitteeData } from '../../data/committee/update-committee'
import { concatenateStrings } from '../../utils/concatenate-strings'
import { createSentEmailCommitteeData } from '../../data/committee/create-sent-email-committee'

export type UpdateEvenDetailstServiceArgs = {
  prisma: PrismaClient
  committees: EventCommittee[]
  userId: string
  eventId: string
  values: Partial<Event>
}

export const updateEventDetailsService = async ({
  prisma,
  committees,
  userId,
  eventId,
  values,
}: UpdateEvenDetailstServiceArgs) => {
  const updatedRecord = await prisma.$transaction(async (prismaTx) => {
    const event = await updateEventData({
      prisma: prismaTx,
      id: eventId,
      values,
    })

    if (event.organizerId !== userId) {
      throw new UnauthorizedError('User is not the organizer.')
    }

    await createHistoryLogData({
      prisma: prismaTx,
      values: {
        message: 'Event details were updated',
        action: 'UPDATED',
        email: event.organizer.email,
        eventId: event.id,
      },
    })

    const allCommittees = await getCommitteesData({
      prisma: prismaTx,
      activeStatus: ['ACTIVE', 'INACTIVE'],
      eventIds: event.id,
    })

    // Create sets for efficient lookups
    const allCurrentCommitteeEmails = new Set(allCommittees.map((c) => c.email))
    const updatedCommitteeEmails = new Set(committees.map((uc) => uc.email))

    const committeesToUpdateStatus = allCommittees.filter((c) =>
      updatedCommitteeEmails.has(c.email),
    )
    // Bulk update status for existing committees
    if (committeesToUpdateStatus.length > 0) {
      await prismaTx.eventCommittee.updateMany({
        where: {
          eventId: { in: committeesToUpdateStatus.map((c) => c.eventId) },
        },
        data: { approvalStatus: 'WAITING' },
      })
    }

    // Check if there are any changes
    if (
      allCurrentCommitteeEmails.size === updatedCommitteeEmails.size &&
      [...allCurrentCommitteeEmails].every((email) =>
        updatedCommitteeEmails.has(email),
      )
    ) {
      console.log('No changes in committees detected. Skipping update.')
      return event
    }

    // Prepare bulk db operations
    const committeesToDeactivate = allCommittees.filter(
      (c) =>
        !updatedCommitteeEmails.has(c.email) && c.activeStatus === 'ACTIVE',
    )
    const committeesToReactivate = allCommittees.filter(
      (c) =>
        updatedCommitteeEmails.has(c.email) && c.activeStatus === 'INACTIVE',
    )
    const committeesToCreate = committees.filter(
      (nc) => !allCurrentCommitteeEmails.has(nc.email),
    )

    if (committeesToDeactivate.length > 0) {
      await prismaTx.eventCommittee.updateMany({
        where: {
          eventId: { in: committeesToDeactivate.map((c) => c.eventId) },
        },
        data: { activeStatus: 'INACTIVE' },
      })
    }

    for (const committee of committeesToReactivate) {
      await updateCommitteeData({
        prisma: prismaTx,
        email: committee.email,
        eventId: event.id,
        values: {
          activeStatus: 'ACTIVE',
          approvalStatus: 'WAITING',
        },
      })
    }

    for (const committee of committeesToCreate) {
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

    return event
  })

  return updatedRecord
}
