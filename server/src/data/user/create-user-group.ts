import { Prisma, UserGroup, type PrismaClient } from '@prisma/client'

export type CreateUserGroupDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  values: UserGroup
}

export const createUserGroupData = async ({
  prisma,
  values,
}: CreateUserGroupDataArgs) => {
  const createdRecord = prisma.userGroup.create({
    data: values,
  })

  return createdRecord
}
