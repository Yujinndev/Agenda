import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { updateEventData } from '../../data/event/update-event'
import { sendEmailApprovalService } from '../../services/event/send-email-approval-service'

const prisma = new PrismaClient()

export const resendEmailApprovalHandler = async (
  req: Request,
  res: Response,
) => {
  const { email, data } = req.body
  const { committees, eventId } = data

  if (!email) {
    return res.sendStatus(403)
  }

  if (!data || !email) {
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
