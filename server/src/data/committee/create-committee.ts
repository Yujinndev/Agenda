import {
  EventCommittee,
  ApprovalStatus,
  Prisma,
  type PrismaClient,
} from '@prisma/client'

export type CreateCommitteeDataArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  approvalStatus?: ApprovalStatus
  values: Pick<EventCommittee, 'email' | 'eventId'> &
    Partial<Pick<EventCommittee, 'name' | 'userId'>>
}

export const createCommitteeData = async ({
  prisma,
  approvalStatus = 'WAITING',
  values,
}: CreateCommitteeDataArgs) => {
  const createdRecords = await prisma.eventCommittee.create({
    data: { ...values, approvalStatus },
  })

  return createdRecords
}
