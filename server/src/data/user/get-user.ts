import { Prisma, type PrismaClient } from '@prisma/client'
import { NotFoundError } from '../../utils/errors'

export type GetUserDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  refreshToken?: string
  email?: string
  id?: string
}

export const getUserData = async ({
  prisma,
  email = '',
  id = '',
  refreshToken = '',
}: GetUserDataArgs) => {
  const user = await prisma.user
    .findFirstOrThrow({
      where: { OR: [{ email }, { id }, { refreshToken }] },
    })
    .catch(() => {
      return null
    })

  return user
}
