import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const createGroupParticipantHandler = async (
  req: Request,
  res: Response,
) => {
  const { email, groupId } = req.body.data

  if (!email) {
    return res.sendStatus(401)
  }

  try {
    const joinParticipantTx = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: {
          email,
        },
      })

      const userFullName = `${user?.firstName} ${user?.middleName ?? ''} ${
        user?.lastName
      }`

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
        data: { numberOfMembers: currentMembers + 1 },
      })

      const newMember = await tx.groupMembership.create({
        data: {
          email,
          groupId: groupId,
          userId: user!.id,
          name: userFullName,
          role: 'MEMBER',
        },
      })

      // console.log('New member:', newMember)

      return newMember
    })

    return res.status(200).json(joinParticipantTx)
  } catch (error) {
    res.status(500).json(error)
  }
}
