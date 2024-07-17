import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const getUserEventsHandler = async (req: Request, res: Response) => {
  const { userId } = req.body

  if (!userId) {
    return res.sendStatus(403)
  }

  try {
    const records = await prisma.event.findMany({
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
      orderBy: {
        startDateTime: 'asc',
      },
      include: {
        participants: true,
      },
    })

    return res.status(200).json({ records })
  } catch {
    res.sendStatus(500)
  }
}
