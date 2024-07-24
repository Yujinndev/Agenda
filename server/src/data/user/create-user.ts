import { Prisma, User, type PrismaClient } from '@prisma/client'

export type CreateUserDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  values: Pick<User, 'firstName' | 'lastName' | 'email' | 'password'> &
    Partial<Pick<User, 'middleName'>>
}

export const createUserData = async ({
  prisma,
  values,
}: CreateUserDataArgs) => {
  const createdRecord = await prisma.user.create({
    data: values,
  })

  return createdRecord
}
