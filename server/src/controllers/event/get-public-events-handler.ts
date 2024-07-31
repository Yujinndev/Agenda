import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { getPublicEventsService } from '../../services/event/get-public-events-service'

const prisma = new PrismaClient()

export const getPublicEventsHandler = async (req: Request, res: Response) => {
  const cookie = req.headers.cookie
  const page = req.params.page

  try {
    const [_, value] = cookie?.split('=') ?? ''
    const events = await getPublicEventsService({
      prisma,
      page: Number(page),
      userToken: value ?? '',
    })

    return res.status(200).json({ events })
  } catch {
    return res.sendStatus(500)
  }
}
