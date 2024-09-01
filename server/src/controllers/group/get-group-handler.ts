import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { getGroupData } from '../../data/group/get-group'

const prisma = new PrismaClient()

export const getGroupHandler = async (req: Request, res: Response) => {
  const { id } = req.params

  if (!id) {
    return res.sendStatus(403)
  }

  try {
    const record = await getGroupData({ prisma, id })
    return res.status(200).json(record)
  } catch {
    return res.sendStatus(500)
  }
}
