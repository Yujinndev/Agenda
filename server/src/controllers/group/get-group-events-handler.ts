import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { getEventsData } from '../../data/event/get-events'

const prisma = new PrismaClient()

export const getGroupEventsHandler = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const records = await getEventsData({
      prisma,
      where: {
        AND: [
          { audience: { equals: 'USER_GROUP' } },
          { status: { equals: 'UPCOMING' } },
          { groups: { some: { userGroupId: id } } },
        ],
      },
      sortBy: 'startDateTime',
      orderBy: 'asc',
      include: { participants: true, organizer: true, groups: true },
    })

    return res.status(200).json({ records })
  } catch {
    return res.sendStatus(500)
  }
}
