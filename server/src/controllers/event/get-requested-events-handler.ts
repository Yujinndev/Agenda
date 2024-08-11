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
          committees: {
            some: {
              userId,
              activeStatus: 'ACTIVE',
            },
          },
        },
        { status: 'FOR_APPROVAL' },
      ],
    },
    sortBy: 'status',
    orderBy: 'asc',
  })

  const eventIds = events.records.map((event) => event.id)

  const committees = await getCommitteesData({
    prisma,
    eventIds,
  })

  // Map committees to their respective events
  const records = events.records.map((event) => ({
    ...event,
    committees: committees.filter(
      (committee) => committee.eventId === event.id,
    ),
  }))

  res.json({ records })
}
