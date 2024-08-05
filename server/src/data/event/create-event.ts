import { Event, Prisma, type PrismaClient } from '@prisma/client'
import { ValidationError } from '../../utils/errors'

export type CreateEventDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  userId: string
  values: Pick<Event, 'title'> &
    Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'organizerId'>> & {
      selectedGroups?: Array<{
        groupId: string
        name: string
        creatorName: string
      }>
    }
}

export const createEventData = async ({
  prisma,
  userId,
  values,
}: CreateEventDataArgs) => {
  const { userGroupId, selectedGroups, ...rest } = values

  try {
    // Check if UserGroup records exist if selectedGroups are provided
    if (selectedGroups) {
      // Extract groupIds from the array
      const userGroupIds = selectedGroups.map(({ groupId }) => groupId)

      console.log('Selected UserGroup IDs:', userGroupIds)

      const existingUserGroups = await prisma.userGroup.findMany({
        where: {
          id: { in: userGroupIds },
        },
      })

      // Log the found UserGroups
      console.log('Existing UserGroups:', existingUserGroups)

      // Check if all selected groups exist
      if (existingUserGroups.length !== userGroupIds.length) {
        throw new ValidationError('One or more UserGroup records do not exist.')
      }
    }

    // Proceed with event creation
    const createdRecord = await prisma.event.create({
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
        selectedGroups: {
          create: selectedGroups?.map(({ groupId, name, creatorName }) => ({
            userGroup: {
              connect: { id: groupId },
            },
            groupName: name,
            creatorName: creatorName,
          })),
        },
      },
    })

    console.log('Created Event:', createdRecord)
    return createdRecord
  } catch (error) {
    console.error('Error creating event:', error)
    throw new ValidationError(
      'Cannot create event for the user: ' + (error as Error).message,
    )
  }
}
