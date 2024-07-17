import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { getCommitteesData } from '../../data/committee/get-committees'
import { getEventsData } from '../../data/event/get-events'

const prisma = new PrismaClient()

export const getRequestedEventsHandler = async (
  req: Request,
  res: Response,
) => {
  const { userId } = req.body

  const events = await getEventsData({
    prisma,
    where: {
      AND: [
        {
          committee: {
            some: {
              userId,
            },
          },
        },
        { status: { equals: 'FOR_APPROVAL' } },
      ],
    },
  })

  const eventIds = events.map((event) => event.id)
  const committees = await getCommitteesData({ prisma, eventIds })

  // Map committees to their respective events
  const records = events.map((event) => ({
    ...event,
    committee: committees.filter((committee) => committee.eventId === event.id),
  }))

  res.json({ records })
}
