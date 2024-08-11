import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { getGroupsData } from '../../data/group/get-groups'

const prisma = new PrismaClient()

export const getPublicGroupHandler = async (req: Request, res: Response) => {
  try {
    const records = await getGroupsData({
      prisma,
      where: {
        AND: [{ visibility: { equals: 'PUBLIC' } }],
      },
      sortBy: 'createdAt',
      orderBy: 'asc',
      include: { members: { include: { user: true } } },
    })

    return res.status(200).json({ records })
  } catch {
    return res.sendStatus(500)
  }
}
