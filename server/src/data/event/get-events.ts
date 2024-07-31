import { Event, Prisma, type PrismaClient } from '@prisma/client'

export type GetEventsDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  where?: Prisma.EventWhereInput
  limit?: number
  page?: number
  sortBy?: keyof Event
  orderBy?: 'asc' | 'desc'
  include?: Prisma.EventInclude
}

export const getEventsData = async ({
  prisma,
  where = {},
  limit = 100,
  page = 1,
  sortBy = 'createdAt',
  orderBy = 'desc',
  include,
}: GetEventsDataArgs) => {
  const records = await prisma.event.findMany({
    where,
    take: limit,
    skip: (page - 1) * limit,
    orderBy: {
      [sortBy]: orderBy.toLowerCase(),
    },
    include,
  })

  const totalCount = await prisma.event.count({
    where,
  })

  return { records, totalCount }
}
