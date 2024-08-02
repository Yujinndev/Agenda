import { Event, Prisma, type PrismaClient } from '@prisma/client'
import { ValidationError } from '../../utils/errors'

export type CreateEventDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  userId: string
  values: Pick<Event, 'title'> &
    Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'organizerId'>>
}

export const createEventData = async ({
  prisma,
  userId,
  values,
}: CreateEventDataArgs) => {
  const { userGroupId, ...rest } = values

  const createdRecord = await prisma.event
    .create({
      data: {
        ...rest,
        organizer: {
          connect: {
            id: userId,
          },
        },
        ...(userGroupId && {
          userGroup: {
            connect: {
              id: userGroupId,
            },
          },
        }),
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
