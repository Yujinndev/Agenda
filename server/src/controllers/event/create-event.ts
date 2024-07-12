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
    details,
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

  if (!data) {
    res.sendStatus(400)
  }

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
          details,
          startDateTime: new Date(startDateTime).toISOString(),
          endDateTime: new Date(endDateTime).toISOString(),
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

      const organizer = await tx.user.findFirstOrThrow({
        where: {
          id: userId,
        },
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      })

      // Create committees one by one
      if (committees.length > 0) {
        for (const committee of committees) {
          let committeeId
          let committeeFullName

          try {
            const committeeDetails = await tx.user.findFirstOrThrow({
              where: {
                email: committee.email,
              },
            })

            committeeId = committeeDetails?.id
            committeeFullName =
              committeeDetails?.firstName + ' ' + committeeDetails?.lastName
          } catch (error) {
            console.log(error)
          }

          await tx.eventCommittee.create({
            data: {
              userId: committeeId ?? null,
              name: committeeFullName || null,
              email: committee?.email,
              eventId: newEvent?.id,
            },
          })
        }

        const organizerFullName =
          organizer?.firstName + ' ' + organizer?.lastName
        const firstCommittee: string = committees[0]?.email

        await sendEmail({
          email: firstCommittee,
          eventCreator: organizerFullName,
          eventId: newEvent.id,
          eventTitle: title,
          eventStartDateTime: startDateTime,
          eventEndDateTime: endDateTime,
          eventPurpose: purpose,
          eventDetails: details,
          eventLocation: location,
          eventCategory: category,
          eventEstimatedAttendees: parsedAttendees,
          eventExpenses: parsedExpense,
          eventFee: parsedPrice,
        })
      }

      //TODO: insert into eventLogs -> "CREATED EVENT", DATE, USER
      await tx.eventHistoryLog.create({
        data: {
          eventId: newEvent.id,
          email: organizer.email,
          message: 'New Event',
          action: 'CREATED',
        },
      })

      return newEvent
    })

    res.status(200).json(event)
  } catch (error) {
    res.status(500).json(error)
  }
}
