import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { getUserData } from '../../data/user/get-user'
import { concatenateStrings } from '../../utils/concatenate-strings'

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
    const joinParticipantTx = await prisma.$transaction(async (prismaTx) => {
      const user = await getUserData({ prisma: prismaTx, email })

      const userFullName = concatenateStrings(
        user?.firstName,
        user?.middleName ?? '',
        user?.lastName,
      )

      await prismaTx.group.update({
        where: { id: groupId },
        data: { numberOfMembers: { increment: 1 } },
      })

      const newMember = await prismaTx.groupMembership.create({
        data: {
          email,
          groupId: groupId,
          userId: user!.id,
          name: userFullName,
          role: 'MEMBER',
        },
      })

      return newMember
    })

    return res.status(200).json(joinParticipantTx)
  } catch {
    return res.sendStatus(500)
  }
}
