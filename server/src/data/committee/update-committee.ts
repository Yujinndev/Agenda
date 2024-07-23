import { error } from 'console'
import { ForbiddenError } from '../../utils/errors'
import { EventCommittee, Prisma, type PrismaClient } from '@prisma/client'

export type UpdateCommitteeDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  email: string
  eventId: string
  values: Partial<EventCommittee>
}

export const updateCommitteeData = async ({
  prisma,
  email,
  eventId,
  values,
}: UpdateCommitteeDataArgs) => {
  const updatedRecord = await prisma.eventCommittee
    .update({
      data: values,
      where: {
        email_eventId: {
          email,
          eventId,
        },
      },
    })
    .catch(() => {
      throw new ForbiddenError('Cannot update event committee.')
    })

  return updatedRecord
}
