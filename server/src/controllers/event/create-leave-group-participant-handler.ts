import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const createLeaveGroupParticipantHandler = async (
  req: Request,
  res: Response,
) => {
  const { email, groupId } = req.body.data
  ;('')

  if (!email) {
    return res.sendStatus(401)
  }

  try {
    const leaveParticipant = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: {
          email,
        },
      })

      const userEmail = user?.email || ''
      const userId = user?.id || ''

      const userGroup = await tx.userGroup.findFirstOrThrow({
        where: {
          id: groupId,
        },
      })

      const currentMembers = await tx.groupMembership.count({
        where: {
          groupId: groupId,
        },
      })

      await tx.userGroup.update({
        where: { id: groupId },
        data: { numberOfMembers: currentMembers - 1 },
      })

      await tx.groupMembership.delete({
        where: {
          email: userEmail,
          userId_groupId: { userId, groupId },
        },
      })

      return { message: 'Successfully left the group' }
    })

    return res.status(200).json(leaveParticipant)
  } catch (error) {
    res.status(500).json(error)
  }
}
