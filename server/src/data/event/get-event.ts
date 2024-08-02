import { Prisma, type PrismaClient } from '@prisma/client'
import { ValidationError } from '../../utils/errors'

export type GetEventDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  id: string
}

export const getEventData = async ({ prisma, id }: GetEventDataArgs) => {
  const record = await prisma.event
    .findFirstOrThrow({
      where: {
        id,
      },
      include: {
        participants: true,
        eventFeedbacks: true,
        organizer: true,
        finances: {
          orderBy: { updatedAt: 'asc' },
        },
        eventHistoryLogs: {
          include: {
            committeeInquiry: true,
          },
          orderBy: { id: 'desc' },
        },
      },
    })
    .catch(() => {
      throw new ValidationError('Id not found.')
    })

  return record
}
