import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { UnauthorizedError } from '../../utils/errors'
import { createParticipantFeedbackService } from '../../services/event/create-participant-feedback-service'

const prisma = new PrismaClient()

export const createParticipantFeedbackHandler = async (
  req: Request,
  res: Response,
) => {
  const { data, userId } = req.body

  if (!data) {
    return res.sendStatus(404)
  }

  if (data.userId !== userId) {
    throw new UnauthorizedError('User is not authorized.')
  }

  try {
    const feedback = await createParticipantFeedbackService({
      prisma,
      values: { ...data, rating: new Decimal(data.rating) },
    })

    return res.status(200).json(feedback)
  } catch {
    return res.sendStatus(500)
  }
}
