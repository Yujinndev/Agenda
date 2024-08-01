import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { getGroupsData } from '../../data/event/get-groups'

const prisma = new PrismaClient()

export const getPublicGroupHandler = async (req: Request, res: Response) => {
  const records = await getGroupsData({
    prisma,
    where: {
      AND: [{ visibility: { equals: 'PUBLIC' } }],
    },
    sortBy: 'createdAt',
    orderBy: 'asc',
    include: { members: { include: { user: true } } },
  })

  res.status(200).json({ records })
}
