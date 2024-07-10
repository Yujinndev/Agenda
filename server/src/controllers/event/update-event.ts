import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { EventProps } from '../../types/event'

const prisma = new PrismaClient()

export const updateEventHandler = async (req: Request, res: Response) => {
  const { userId, data } = req.body
  const {
    id,
    title,
    purpose,
    startDateTime,
    endDateTime,
    location,
    estimatedAttendees,
    category,
    audience,
    price,
    committees,
    estimatedExpense,
    status,
    userId: organizerId,
  }: EventProps = data

  if (!id) {
    return res.sendStatus(404)
  }

  if (organizerId !== userId) {
    return res.sendStatus(403)
  }

  try {
    const event = await prisma.$transaction(async (tx) => {
      const updatedDetails = await prisma.event.update({
        data: {
          title,
          purpose,
          startDateTime,
          endDateTime,
          location,
          estimatedAttendees: estimatedAttendees
            ? parseInt(estimatedAttendees)
            : null,
          category,
          audience,
          price: price ? parseFloat(price) : null,
          estimatedExpense: estimatedExpense
            ? parseFloat(estimatedExpense)
            : null,
          status,
          organizer: {
            connect: {
              id: userId,
            },
          },
        },

        where: {
          id,
        },
      })

      for (const participant of committees) {
        const existingParticipant = await tx.eventParticipant.findUnique({
          where: {
            email_eventId: {
              email: participant.email,
              eventId: updatedDetails.id,
            },
          },
        })

        if (existingParticipant) {
          // Update the existing participant
          await tx.eventParticipant.update({
            data: {
              userId: participant.userId ?? null,
              name: participant.name ?? null,
              email: participant.email,
            },
            where: {
              id: participant.id,
            },
          })
        } else {
          // Create a new participant
          await tx.eventParticipant.create({
            data: {
              userId: participant.userId ?? null,
              name: participant.name ?? null,
              email: participant.email,
              eventId: updatedDetails.id,
            },
          })
        }
      }

      //TODO: insert into eventLogs -> "UPDATED EVENT", DATE, USER
      return updatedDetails
    })

    return res.status(200).json(event)
  } catch {
    res.sendStatus(500)
  }
}
