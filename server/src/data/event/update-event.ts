import { ForbiddenError } from '../../utils/errors'
import { Event, Prisma, type PrismaClient } from '@prisma/client'

export type UpdateEventDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  id: string
  values: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'organizerId'>>
}

export const updateEventData = async ({
  prisma,
  id,
  values,
}: UpdateEventDataArgs) => {
  const updatedDetails = await prisma.event
    .update({
      data: values,
      where: {
        id,
      },
    })
    .catch(() => {
      throw new ForbiddenError('Cannot update event.')
    })

  return updatedDetails
}
