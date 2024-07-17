import { EventHistoryLog, Prisma, type PrismaClient } from '@prisma/client'

export type CreateHistoryLogDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  values: Pick<
    EventHistoryLog,
    'eventId' | 'email' | 'action' | 'message' | 'committeeInquiryId'
  >
}

export const createHistoryLogData = async ({
  prisma,
  values,
}: CreateHistoryLogDataArgs) => {
  const createdRecord = await prisma.eventHistoryLog.create({
    data: values,
  })

  return createdRecord
}