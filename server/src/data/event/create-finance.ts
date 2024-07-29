import { EventFinance, Prisma, type PrismaClient } from '@prisma/client'

export type CreateFinanceDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  values: EventFinance
}

export const createFinanceData = async ({
  prisma,
  values,
}: CreateFinanceDataArgs) => {
  const createdRecord = await prisma.eventFinance.create({
    data: values,
  })

  return createdRecord
}
