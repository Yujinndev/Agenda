import {
  EventSentEmailCommittee,
  Prisma,
  type PrismaClient,
} from '@prisma/client'

export type CreateSentEmailCommitteeDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  values: Pick<EventSentEmailCommittee, 'committeeEmail' | 'isSent'>
}

export const createSentEmailCommitteeData = async ({
  prisma,
  values,
}: CreateSentEmailCommitteeDataArgs) => {
  const createdRecord = await prisma.eventSentEmailCommittee.create({
    data: values,
  })

  return createdRecord
}
