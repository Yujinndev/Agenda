import { GroupMembership, Prisma, type PrismaClient } from '@prisma/client'

export type CreateGroupMemberArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  values: Omit<GroupMembership, 'joinedAt'>
}

export const createGroupMember = async ({
  prisma,
  values,
}: CreateGroupMemberArgs) => {
  const createdRecord = await prisma.groupMembership.create({
    data: values,
  })

  return createdRecord
}
