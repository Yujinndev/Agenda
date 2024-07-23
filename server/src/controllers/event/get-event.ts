import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const getEventHandler = async (req: Request, res: Response) => {
  const { id } = req.params

  if (!id) {
    return res.sendStatus(403)
  }

  try {
    const event = await prisma.event.findFirstOrThrow({
      where: {
        id,
      },
      include: {
        participants: true,
        finance: true,
        organizer: true,
      },
    })

    const committee = await prisma.eventCommittee.findMany({
      where: {
        eventId: event.id,
      },
      orderBy: {
        id: 'asc',
      },
    })

    const record = {
      ...event,
      committee,
    }

    return res.status(200).json(record)
  } catch {
    res.sendStatus(500)
  }
}
