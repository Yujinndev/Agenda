import { Prisma, type PrismaClient } from '@prisma/client'
import { ValidationError } from '../../utils/errors'

export type GetGroupDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  id: string
}

export const getGroupData = async ({ prisma, id }: GetGroupDataArgs) => {
  const record = await prisma.userGroup
    .findFirstOrThrow({
      where: {
        id,
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        rules: true,
      },
    })
    .catch(() => {
      throw new ValidationError('Id not found.')
    })

  return record
}
