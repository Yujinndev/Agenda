import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { EventProps } from '../types/event'

const prisma = new PrismaClient()

export const createEvent = async (req: Request, res: Response) => {
  const { email, userId, data } = req.body
  const {
    title,
    purpose,
    startDateTime,
    endDateTime,
    location,
    estimatedAttendees,
    category,
    audience,
    price,
    participants,
    estimatedExpense,
    status,
  }: EventProps = data

  try {
    const newEvent = await prisma.$transaction(async (tx) => {
      const event = await tx.event.create({
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
      })

      // Create participants one by one
      if (participants.length > 0) {
        for (const participant of participants) {
          await tx.eventParticipant.create({
            data: {
              name: participant.name,
              email: participant.email,
              eventId: event.id,
            },
          })
        }
      }

      return event
    })

    res.status(200).json(newEvent)
  } catch (error) {
    console.error('Error creating event:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const fetchUserEvents = async (req: Request, res: Response) => {
  const { userId } = req.body

  if (!userId) {
    return res.sendStatus(403)
  }

  try {
    const userEvents = await prisma.event.findMany({
      where: {
        organizerId: { equals: userId },
      },
      include: {
        participants: true,
      },
    })

    if (!userEvents || userEvents.length < 0) {
      return res.status(204).json({ message: 'No events' })
    }

    return res.status(200).json({ userEvents })
  } catch {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
