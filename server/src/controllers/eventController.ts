import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { EventProps } from '../types/event'
import { sendEmail } from '../helpers/sendEmail'

const prisma = new PrismaClient()

export const createEvent = async (req: Request, res: Response) => {
  const { userId, data } = req.body
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
    committee,
    estimatedExpense,
    status,
  }: EventProps = data

  try {
    const parsedAttendees = estimatedAttendees
      ? parseInt(estimatedAttendees)
      : 0
    const parsedPrice = price ? parseFloat(price) : 0
    const parsedExpense = estimatedExpense ? parseFloat(estimatedExpense) : 0

    const newEvent = await prisma.$transaction(async (tx) => {
      const event = await tx.event.create({
        data: {
          title,
          purpose,
          startDateTime,
          endDateTime,
          location,
          estimatedAttendees: parsedAttendees,
          category,
          audience,
          price: parsedPrice,
          estimatedExpense: parsedExpense,
          status,
          organizer: {
            connect: {
              id: userId,
            },
          },
        },
      })

      // Create committee one by one
      if (committee.length > 0) {
        for (const participant of committee) {
          await tx.eventCommittee.create({
            data: {
              userId: participant.userId ?? null,
              name: participant.name ?? null,
              email: participant.email,
              eventId: event.id,
            },
          })
        }
      }

      const user = await prisma.user.findFirstOrThrow({
        where: {
          id: userId,
        },
        select: {
          firstName: true,
          lastName: true,
        },
      })

      if (committee.length >= 1) {
        const userFullName = user.firstName + ' ' + user.lastName
        const firstCommittee: string = committee[0].email

        await sendEmail({
          email: firstCommittee,
          eventCreator: userFullName,
          eventId: event.id,
          eventTitle: title,
          eventStartDateTime: startDateTime,
          eventEndDateTime: endDateTime,
          eventPurpose: purpose,
          eventLocation: location,
          eventCategory: category,
          eventEstimatedAttendees: parsedAttendees,
          eventExpenses: parsedExpense,
          eventFee: parsedPrice,
        })
      }

      //TODO: insert into eventLogs -> "CREATED EVENT", DATE, USER

      return event
    })

    res.status(200).json(newEvent)
  } catch (error) {
    res.sendStatus(500)
  }
}

export const updateEvent = async (req: Request, res: Response) => {
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
    committee,
    estimatedExpense,
    status,
    userId: organizerId,
  }: EventProps = data

  if (!organizerId !== userId) {
    return res.sendStatus(403)
  }

  if (!id) {
    return res.sendStatus(404)
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
      for (const participant of committee) {
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

    return res.status(200).json({ event })
  } catch {
    res.sendStatus(500)
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
      return res.status(204).json({ message: 'No events found' })
    }

    return res.status(200).json({ userEvents })
  } catch {
    res.sendStatus(500)
  }
}

export const fetchSingleEvent = async (req: Request, res: Response) => {
  const { id } = req.params

  if (!id) {
    return res.sendStatus(403)
  }

  try {
    const event = await prisma.event.findFirstOrThrow({
      where: {
        id,
      },
      include: {
        participants: true,
      },
    })

    if (!event) {
      return res.status(204).json({ message: 'No event Found' })
    }

    return res.status(200).json({ event })
  } catch {
    res.sendStatus(500)
  }
}

export const fetchAllPublicEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        audience: { equals: 'PUBLIC' },
      },
      include: { participants: false },
    })

    if (!events) {
      return res.status(204).json({ message: 'No event Found' })
    }

    res.status(200).json({ events })
  } catch {
    res.sendStatus(500)
  }
}
