import { ForbiddenError } from '../../utils/errors'
import {
  EventSentEmailCommittee,
  Prisma,
  type PrismaClient,
} from '@prisma/client'

export type UpdateSentEmailCommitteeDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  id: number
  values: Pick<EventSentEmailCommittee, 'isSent' | 'messageId'>
}

export const updateSentEmailCommitteeData = async ({
  prisma,
  id,
  values,
}: UpdateSentEmailCommitteeDataArgs) => {
  const updatedRecord = await prisma.eventSentEmailCommittee
    .update({
      data: values,
      where: {
        id,
      },
    })
    .catch(() => {
      throw new ForbiddenError('Cannot update sent email.')
    })

  return updatedRecord
}
