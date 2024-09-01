import { Event, Prisma, type PrismaClient } from '@prisma/client'
import { ValidationError } from '../../utils/errors'

export type CreateEventDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  userId: string
  groupIDs: string[]
  values: Pick<Event, 'title'> &
    Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'organizerId'>>
}

export const createEventData = async ({
  prisma,
  userId,
  groupIDs,
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
        groups: {
          create: groupIDs.map((id) => ({
            group: {
              connect: { id },
            },
          })),
        },
      },
      include: {
        organizer: true,
      },
    })
    .catch(() => {
      throw new ValidationError('Cannot create event for the user.')
    })

  return createdRecord
}
