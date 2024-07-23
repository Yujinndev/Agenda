import { Prisma, type PrismaClient } from '@prisma/client'
import { NotFoundError } from '../../utils/errors'

export type GetUserDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  email?: string
  id?: string
}

export const getUserData = async ({
  prisma,
  email = '',
  id = '',
}: GetUserDataArgs) => {
  const user = await prisma.user
    .findFirstOrThrow({
      where: { OR: [{ email }, { id }] },
    })
    .catch(() => {
      throw new NotFoundError('User not found.')
    })

  return user
}
