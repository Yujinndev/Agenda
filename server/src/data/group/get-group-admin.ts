import { UserRoles, Prisma, type PrismaClient } from '@prisma/client'
import { ValidationError } from '../../utils/errors'

export type GetGroupAdminDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  userRoles?: UserRoles
  groupIds: string | string[]
}

export const getGroupAdminData = async ({
  prisma,
  userRoles = 'ADMIN',
  groupIds,
}: GetGroupAdminDataArgs) => {
  const groupIdsArray = Array.isArray(groupIds) ? groupIds : [groupIds]

  const records = await prisma.groupMembership
    .findMany({
      where: {
        AND: [
          {
            groupId: { in: groupIdsArray },
          },
          {
            role: { equals: userRoles },
          },
        ],
      },
      orderBy: {
        id: 'asc',
      },
    })
    .catch(() => {
      throw new ValidationError('Group id not found.')
    })

  return records
}
