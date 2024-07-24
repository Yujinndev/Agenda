import { Event, EventCommittee, type PrismaClient } from '@prisma/client'
import { createHistoryLogData } from '../../data/history/create-history-log'
import { updateEventData } from '../../data/event/update-event'
import { getUserData } from '../../data/user/get-user'
import { ValidationError } from '../../utils/errors'
import { getCommitteesData } from '../../data/committee/get-committees'
import { createCommitteeData } from '../../data/committee/create-committee'
import { updateCommitteeData } from '../../data/committee/update-committee'
import { concatenateStrings } from '../../utils/concatenate-strings'
import { createSentEmailCommitteeData } from '../../data/committee/create-sent-email-committee'

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

    const allCommittees = await getCommitteesData({
      prisma: prismaTx,
      activeStatus: ['ACTIVE', 'INACTIVE'],
      eventIds: event.id,
    })

    // Create sets for efficient lookups
    const allCommitteeEmails = new Set(allCommittees.map((c) => c.email))
    const updatedCommitteeEmails = new Set(committees.map((uc) => uc.email))

    const committeesToUpdateStatus = allCommittees.filter((c) =>
      updatedCommitteeEmails.has(c.email),
    )
    // Bulk update status for existing committees
    if (committeesToUpdateStatus.length > 0) {
      await prismaTx.eventCommittee.updateMany({
        where: {
          id: { in: committeesToUpdateStatus.map((c) => c.id) },
        },
        data: { approvalStatus: 'WAITING' },
      })
    }

    // Check if there are any changes
    if (
      allCommitteeEmails.size === updatedCommitteeEmails.size &&
      [...allCommitteeEmails].every((email) =>
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
      (nc) => !allCommitteeEmails.has(nc.email),
    )

    if (committeesToDeactivate.length > 0) {
      await prismaTx.eventCommittee.updateMany({
        where: {
          id: { in: committeesToDeactivate.map((c) => c.id) },
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

    for (const newCommittee of committeesToCreate) {
      let committeeDetails

      try {
        committeeDetails = await getUserData({
          prisma,
          email: newCommittee.email,
        })
      } catch (error) {
        console.log(error)
      }

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
          email: newCommittee.email,
          eventId: event.id,
        },
      })

      await createSentEmailCommitteeData({
        prisma: prismaTx,
        values: {
          committeeEmail: newCommittee.email,
          isSent: false,
        },
      })
    }

    return event
  })

  return updatedRecord
}
