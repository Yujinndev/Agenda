import { Prisma, type PrismaClient } from '@prisma/client'

export type GetSentEmailCommitteeDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  email: string
}

export const getSentEmailCommitteeData = async ({
  prisma,
  email,
}: GetSentEmailCommitteeDataArgs) => {
  const record = await prisma.eventSentEmailCommittee.findFirstOrThrow({
    where: {
      committeeEmail: email,
    },
  })

  return record
}
