import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { EventProps } from '../../types/event'
import { sendEmail } from '../../helpers/send-email'

const prisma = new PrismaClient()

export const createEventHandler = async (req: Request, res: Response) => {
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
    committees,
    estimatedExpense,
    status,
  }: EventProps = data

  try {
    const parsedAttendees = estimatedAttendees
      ? parseInt(estimatedAttendees)
      : 0
    const parsedPrice = price ? parseFloat(price) : 0
    const parsedExpense = estimatedExpense ? parseFloat(estimatedExpense) : 0

    const event = await prisma.$transaction(async (tx) => {
      const newEvent = await tx.event.create({
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

      // Create committees one by one
      if (committees.length > 0) {
        for (const participant of committees) {
          const participantDetails: any = await tx.user.findUnique({
            where: {
              email: participant.email,
            },
          })

          await tx.eventCommittee.create({
            data: {
              userId: participantDetails.userId ?? null,
              name: participantDetails.name ?? null,
              email: participantDetails.email,
              eventId: participantDetails.id,
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

      if (committees.length >= 1) {
        const userFullName = user.firstName + ' ' + user.lastName
        const firstCommittee: string = committees[0].email

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

      return newEvent
    })

    res.status(200).json(event)
  } catch (error) {
    res.sendStatus(500)
  }
}
