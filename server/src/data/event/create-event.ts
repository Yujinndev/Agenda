import { Event, Prisma, type PrismaClient } from '@prisma/client'
import { ValidationError } from '../../utils/errors'

export type CreateEventDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  userId: string
  values: Omit<Event, 'organizerId' | 'id' | 'createdAt' | 'updatedAt'>
}

export const createEventData = async ({
  prisma,
  userId,
  values,
}: CreateEventDataArgs) => {
  const createdRecord = await prisma.event
    .create({
      data: {
        ...values,
        organizer: {
          connect: {
            id: userId,
          },
        },
      },
    })
    .catch(() => {
      throw new ValidationError('Cannot create event for the user.')
    })

  return createdRecord
}
