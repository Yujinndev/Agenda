import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getUserGroupsHandler = async (req: Request, res: Response) => {
  const { userId } = req.body

  if (!userId) {
    return res.sendStatus(403)
  }

  try {
    const records = await prisma.group.findMany({
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
      include: { members: { include: { user: true } } },
    })

    return res.status(200).json({ records })
  } catch {
    return res.sendStatus(500)
  }
}
