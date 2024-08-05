import { EventFeedback, Prisma, type PrismaClient } from '@prisma/client'
import { ForbiddenError } from '../../utils/errors'

export type CreateFeedbackDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  values: Omit<EventFeedback, 'id' | 'createdAt' | 'updatedAt'>
}

export const createFeedbackData = async ({
  prisma,
  values,
}: CreateFeedbackDataArgs) => {
  const createdRecord = await prisma.eventFeedback
    .create({
      data: values,
    })
    .catch(() => {
      throw new ForbiddenError('Cannot create feedback.')
    })

  return createdRecord
}
