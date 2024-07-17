import { Prisma, type PrismaClient } from '@prisma/client'
import { NotFoundError, ValidationError } from '../../utils/errors'

export type GetCommitteeDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  committeeEmail: string
  eventIds: string | string[]
}

export const getCommitteeData = async ({
  prisma,
  committeeEmail,
  eventIds,
}: GetCommitteeDataArgs) => {
  const eventIdsArray = Array.isArray(eventIds) ? eventIds : [eventIds]

  const records = await prisma.eventCommittee
    .findFirstOrThrow({
      where: {
        AND: [{ eventId: { in: eventIdsArray } }, { email: committeeEmail }],
      },
      orderBy: {
        id: 'asc',
      },
    })
    .catch(() => {
      throw new ValidationError('Committee not found.')
    })

  return records
}
