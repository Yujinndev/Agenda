import { Prisma, type PrismaClient, Group } from '@prisma/client'

export type GetGroupsDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  where?: Prisma.GroupWhereInput
  limit?: number
  page?: number
  sortBy?: keyof Group
  orderBy?: 'asc' | 'desc'
  include?: Prisma.GroupInclude
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
  const records = await prisma.group.findMany({
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
