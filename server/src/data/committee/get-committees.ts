import { ActiveStatus, Prisma, type PrismaClient } from '@prisma/client'
import { ValidationError } from '../../utils/errors'

export type GetCommitteesDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  activeStatus?: ActiveStatus | ActiveStatus[]
  eventIds: string | string[]
}

export const getCommitteesData = async ({
  prisma,
  activeStatus = 'ACTIVE',
  eventIds,
}: GetCommitteesDataArgs) => {
  const eventIdsArray = Array.isArray(eventIds) ? eventIds : [eventIds]
  const activeStatusArray = Array.isArray(activeStatus)
    ? activeStatus
    : [activeStatus]

  const records = await prisma.eventCommittee
    .findMany({
      where: {
        AND: [
          {
            eventId: { in: eventIdsArray },
          },
          {
            activeStatus: { in: activeStatusArray },
          },
        ],
      },
      orderBy: {
        id: 'asc',
      },
    })
    .catch(() => {
      throw new ValidationError('Event id not found.')
    })

  return records
}
