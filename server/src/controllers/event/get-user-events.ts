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
        organizerId: { equals: userId },
      },
      orderBy: {
        startDateTime: 'asc',
      },
      include: {
        participants: true,
      },
    })

    if (!records || records.length < 0) {
      return res.status(204).json({ message: 'No events found' })
    }

    return res.status(200).json({ records })
  } catch {
    res.sendStatus(500)
  }
}
