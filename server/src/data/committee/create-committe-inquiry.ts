import {
  EventCommitteeInquiry,
  Prisma,
  type PrismaClient,
} from '@prisma/client'

export type CreateCommitteeInquiryArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  committeeEmail: string
  eventId: string
  values: Pick<EventCommitteeInquiry, 'content' | 'responseType'>
}

export const createCommitteeInquiry = async ({
  prisma,
  committeeEmail,
  eventId,
  values,
}: CreateCommitteeInquiryArgs) => {
  const createdRecord = await prisma.eventCommitteeInquiry.create({
    data: {
      ...values,
      committee: {
        connect: {
          email_eventId: {
            eventId: eventId,
            email: committeeEmail,
          },
        },
      },
    },
  })

  return createdRecord
}
