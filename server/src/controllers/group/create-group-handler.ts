import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { ValidationError } from '../../utils/errors'
import { concatenateStrings } from '../../utils/concatenate-strings'
import { getUserData } from '../../data/user/get-user'

const prisma = new PrismaClient()

export const createGroupHandler = async (req: Request, res: Response) => {
  const { data, userId } = req.body

  if (!userId) {
    return res.sendStatus(403)
  }

  if (!data) {
    return res.sendStatus(404)
  }

  try {
    const createdGroup = await prisma.$transaction(async (prismaTx) => {
      const user = await getUserData({ prisma: prismaTx, id: userId })
      if (!user) {
        throw new ValidationError('No user found')
      }

      const newGroup = await prismaTx.group.create({
        data: {
          name: data.name,
          description: data.description,
          visibility: data.visibility,
          joinPermission: data.joinPermission,
          postPermission: data.postPermission,
          numberOfMembers: 1,
        },
      })

      if (data.groupRules.length > 0) {
        const groupRules = data.groupRules.map((el: any) => ({
          description: el.data,
          groupId: newGroup.id,
        }))

        await prismaTx.groupRules.createMany({
          data: { ...groupRules },
        })
      }

      const userFullName = concatenateStrings(
        user.firstName,
        user.middleName ?? '',
        user.lastName,
      )

      await prismaTx.groupMembership.create({
        data: {
          email: user.email,
          groupId: newGroup.id,
          userId,
          name: userFullName,
          role: 'ADMIN',
        },
      })

      return newGroup
    })

    return res.status(200).json(createdGroup)
  } catch (error) {
    return res.sendStatus(500)
  }
}
