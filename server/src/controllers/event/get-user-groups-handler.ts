import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const getUserGroupsHandler = async (req: Request, res: Response) => {
  const { userId } = req.body

  if (!userId) {
    return res.sendStatus(403)
  }

  try {
    const records = await prisma.userGroup.findMany({
      where: {
        OR: [
          {
            members: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        members: true,
      },
    })

    return res.status(200).json({ records })
  } catch {
    res.sendStatus(500)
  }
}
