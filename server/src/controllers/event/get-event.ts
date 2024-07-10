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
      },
    })

    if (!event) {
      return res.status(204).json({ message: 'No event Found' })
    }

    return res.status(200).json(event)
  } catch {
    res.sendStatus(500)
  }
}
