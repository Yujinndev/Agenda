import { EventFeedback, type PrismaClient } from '@prisma/client'
import { createFeedbackData } from '../../data/event/create-feedback'
import { getEventData } from '../../data/event/get-event'
import { ForbiddenError } from '../../utils/errors'

export type CreateParticipantFeedbackServiceArgs = {
  prisma: PrismaClient
  values: Omit<EventFeedback, 'id' | 'createdAt' | 'updatedAt'>
}

export const createParticipantFeedbackService = async ({
  prisma,
  values,
}: CreateParticipantFeedbackServiceArgs) => {
  const eventFeedback = await prisma.$transaction(async (prismaTx) => {
    const event = await getEventData({ prisma: prismaTx, id: values.eventId })

    const hasAlreadySentFeedback = event.eventFeedbacks?.some(
      (el) => el.userId === values.userId,
    )

    if (hasAlreadySentFeedback) {
      throw new ForbiddenError('User already sent feedback')
    }

    return await createFeedbackData({ prisma: prismaTx, values })
  })

  return eventFeedback
}
