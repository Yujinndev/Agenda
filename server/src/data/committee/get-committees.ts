import { Prisma, type PrismaClient } from '@prisma/client'
import { ValidationError } from '../../utils/errors'

export type GetCommitteesDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  eventIds: string | string[]
}

export const getCommitteesData = async ({
  prisma,
  eventIds,
}: GetCommitteesDataArgs) => {
  const eventIdsArray = Array.isArray(eventIds) ? eventIds : [eventIds]

  const records = await prisma.eventCommittee
    .findMany({
      where: {
        eventId: { in: eventIdsArray },
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
