import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { updateEventData } from '../../data/event/update-event'
import { sendEmailApprovalService } from '../../services/event/send-email-approval-service'

const prisma = new PrismaClient()

export const resendEmailApprovalHandler = async (
  req: Request,
  res: Response,
) => {
  const { data } = req.body
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

      await prismaTx.eventCommittee.updateMany({
        where: {
          eventId: { in: committees.map((c: any) => c.eventId) },
        },
        data: { approvalStatus: 'WAITING' },
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
