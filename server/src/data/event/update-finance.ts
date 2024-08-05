import { Prisma, type PrismaClient } from '@prisma/client'
import { ValidationError } from '../../utils/errors'
import { Finances } from '../../services/event/update-event-finances-service'

export type UpdateFinanceDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  id: number
  values: Finances
}

export const updateFinanceData = async ({
  prisma,
  id,
  values,
}: UpdateFinanceDataArgs) => {
  const createdRecord = await prisma.eventFinance
    .update({
      data: values,
      where: {
        id,
      },
    })
    .catch(() => {
      throw new ValidationError('Cannot update finance')
    })

  return createdRecord
}
