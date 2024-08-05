import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { getEventsData } from '../../data/event/get-events'

const prisma = new PrismaClient()

export const getGroupEvents = async (req: Request, res: Response) => {
  const { id } = req.params
  console.log('🚀 ~ getGroupEvents ~ groupId:', id)

  const records = await getEventsData({
    prisma,
    where: {
      AND: [
        { audience: { equals: 'USER_GROUP' } },
        { status: { equals: 'UPCOMING' } },
        { selectedGroups: { some: { userGroupId: id } } },
      ],
    },
    sortBy: 'startDateTime',
    orderBy: 'asc',
    include: { participants: true, organizer: true, selectedGroups: true },
  })

  res.status(200).json({ records })
}
