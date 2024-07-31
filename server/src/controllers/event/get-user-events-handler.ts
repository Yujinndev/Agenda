import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { getEventsData } from '../../data/event/get-events'

const prisma = new PrismaClient()

export const getUserEventsHandler = async (req: Request, res: Response) => {
  const { userId } = req.body

  if (!userId) {
    return res.sendStatus(403)
  }

  try {
    const events = await getEventsData({
      prisma,
      where: {
        OR: [
          {
            participants: {
              some: {
                userId,
              },
            },
          },
          { organizerId: { equals: userId } },
        ],
      },
      sortBy: 'startDateTime',
      orderBy: 'asc',
      include: {
        participants: true,
      },
    })

    return res.status(200).json({ events })
  } catch {
    return res.sendStatus(500)
  }
}
