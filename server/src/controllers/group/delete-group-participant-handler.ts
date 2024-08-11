import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { getUserData } from '../../data/user/get-user'

const prisma = new PrismaClient()

export const deleteGroupParticipantHandler = async (
  req: Request,
  res: Response,
) => {
  const { email, groupId } = req.body.data

  if (!email) {
    return res.sendStatus(401)
  }

  try {
    const leaveParticipant = await prisma.$transaction(async (prismaTx) => {
      const user = await getUserData({ prisma: prismaTx, email })

      const userEmail = user?.email || ''
      const userId = user?.id || ''

      await prismaTx.group.update({
        where: { id: groupId },
        data: {
          numberOfMembers: { decrement: 1 },
        },
      })

      await prismaTx.groupMembership.delete({
        where: {
          email: userEmail,
          userId_groupId: { userId, groupId },
        },
      })

      return user
    })

    return res.status(200).json(leaveParticipant)
  } catch {
    return res.sendStatus(500)
  }
}
