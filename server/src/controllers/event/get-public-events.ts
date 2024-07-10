import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const getPublicEventsHandler = async (req: Request, res: Response) => {
  try {
    const records = await prisma.event.findMany({
      where: {
        AND: [
          { audience: { equals: 'PUBLIC' } },
          { status: { equals: 'UPCOMING' } },
        ],
      },
      orderBy: {
        startDateTime: 'asc',
      },
      include: { participants: true, organizer: true },
    })

    if (!records) {
      return res.status(204).json({ message: 'No event Found' })
    }

    res.status(200).json({ records })
  } catch {
    res.sendStatus(500)
  }
}
