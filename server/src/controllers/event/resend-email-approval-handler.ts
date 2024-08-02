import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { updateEventData } from '../../data/event/update-event'
import { sendEmailApprovalService } from '../../services/event/send-email-approval-service'

const prisma = new PrismaClient()

export const resendEmailApprovalHandler = async (
  req: Request,
  res: Response,
) => {
  const { userId, data } = req.body
  const { committees, eventId } = data

  if (!data) {
    return res.sendStatus(404)
  }

  try {
    const sentEmail = await prisma.$transaction(async (prismaTx) => {
      const event = updateEventData({
        prisma: prismaTx,
        id: eventId,
        values: {
          status: 'FOR_APPROVAL',
        },
      })

      await sendEmailApprovalService({
        prisma: prismaTx,
        userId,
        eventId,
        committeeEmail: committees[0]?.email,
      })

      return event
    })

    return res.status(200).json(sentEmail)
  } catch {
    return res.sendStatus(500)
  }
}
