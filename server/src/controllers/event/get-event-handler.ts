import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { getCommitteesData } from '../../data/committee/get-committees'
import { getEventData } from '../../data/event/get-event'

const prisma = new PrismaClient()

export const getEventHandler = async (req: Request, res: Response) => {
  const { id } = req.params

  if (!id) {
    return res.sendStatus(403)
  }

  try {
    const event = await getEventData({ prisma, id })
    const committees = await getCommitteesData({ prisma, eventIds: id })

    const record = {
      ...event,
      committees,
    }

    return res.status(200).json(record)
  } catch {
    return res.sendStatus(500)
  }
}
