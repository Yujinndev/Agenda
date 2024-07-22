import { Prisma, type PrismaClient } from '@prisma/client'
import { ValidationError } from '../../utils/errors'

export type GetHistoryLogsDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  eventId: string
}

export const getHistoryLogsData = async ({
  prisma,
  eventId,
}: GetHistoryLogsDataArgs) => {
  const records = await prisma.eventHistoryLog
    .findMany({
      where: {
        eventId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    .catch(() => {
      throw new ValidationError('Event id not found.')
    })

  return records
}
