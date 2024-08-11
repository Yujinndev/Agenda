import { Prisma, Group, type PrismaClient } from '@prisma/client'

export type CreateUserGroupDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  values: Group
}

export const createUserGroupData = async ({
  prisma,
  values,
}: CreateUserGroupDataArgs) => {
  const createdRecord = prisma.group.create({
    data: values,
  })

  return createdRecord
}
