import { UserGroup, Prisma, type PrismaClient } from '@prisma/client'

export type GetGroupsDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  where?: Prisma.UserGroupWhereInput
  limit?: number
  page?: number
  sortBy?: keyof UserGroup
  orderBy?: 'asc' | 'desc'
  include?: Prisma.UserGroupInclude
}

export const getGroupsData = async ({
  prisma,
  where = {},
  limit = 25,
  page = 1,
  sortBy = 'createdAt',
  orderBy = 'desc',
  include,
}: GetGroupsDataArgs) => {
  const records = await prisma.userGroup.findMany({
    where,
    take: limit,
    skip: (page - 1) * limit,
    orderBy: {
      [sortBy]: orderBy.toLowerCase(),
    },
    include,
  })

  return records
}
