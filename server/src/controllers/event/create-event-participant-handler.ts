import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const createEventParticipantHandler = async (
  req: Request,
  res: Response,
) => {
  const { email, eventId } = req.body.data

  if (!email) {
    return res.sendStatus(401)
  }

  try {
    const joinParticipantTx = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: {
          email,
        },
      })

      const userFullName = `${user?.firstName} ${user?.middleName ?? ''} ${
        user?.lastName
      }`

      const event = await tx.event.findFirstOrThrow({
        where: {
          id: eventId,
        },
      })

      const eventEstimatedAttendees: number = event.estimatedAttendees ?? 0

      const currentParticipants = await tx.eventParticipant.count({
        where: {
          eventId: eventId,
        },
      })

      if (currentParticipants >= eventEstimatedAttendees) {
        return res.sendStatus(403)
      }

      const userJoined = await tx.eventParticipant.create({
        data: {
          email,
          eventId: eventId,
          userId: user!.id,
          name: userFullName,
        },
      })

      return userJoined
    })

    return res.status(200).json(joinParticipantTx)
  } catch {
    return res.sendStatus(500)
  }
}
