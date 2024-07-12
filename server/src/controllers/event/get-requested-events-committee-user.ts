import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const getRequestedEventsForCommitteeUserData = async (
  req: Request,
  res: Response,
) => {
  const { userId } = req.body

  try {
    const events = await prisma.event.findMany({
      where: {
        AND: [
          {
            committee: {
              some: {
                userId: userId,
              },
            },
          },
          { status: { equals: 'FOR_APPROVAL' } },
        ],
      },
    })

    const eventIds = events.map((event) => event.id)

    const committees = await prisma.eventCommittee.findMany({
      where: {
        eventId: { in: eventIds },
      },
      orderBy: {
        id: 'asc',
      },
    })

    // Map committees to their respective events
    const records = events.map((event) => ({
      ...event,
      committee: committees.filter(
        (committee) => committee.eventId === event.id,
      ),
    }))

    res.json({ records })
  } catch (error) {
    res.send(500).json(error)
  }
}
