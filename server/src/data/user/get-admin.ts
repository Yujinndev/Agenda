import { UserRoles, Prisma, type PrismaClient } from '@prisma/client'
import { ValidationError } from '../../utils/errors'

export type GetAdminDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  userRoles?: UserRoles | UserRoles[]
  groupIds: string | string[]
}

export const getAdminData = async ({
  prisma,
  userRoles = 'ADMIN',
  groupIds,
}: GetAdminDataArgs) => {
  const groupIdsArray = Array.isArray(groupIds) ? groupIds : [groupIds]
  const userRolesArray = Array.isArray(userRoles) ? userRoles : [userRoles]

  const records = await prisma.groupMembership
    .findMany({
      where: {
        AND: [
          {
            groupId: { in: groupIdsArray },
          },
          {
            role: { in: userRolesArray },
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
