import { PrismaClient, PostPermission } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const createGroupHandler = async (req: Request, res: Response) => {
  console.log('Received full request body:', JSON.stringify(req.body, null, 2))

  let group = req.body.data?.group

  if (!group) {
    group = req.body
  }

  console.log('Parsed group data:', JSON.stringify(group, null, 2))

  if (!group || typeof group !== 'object') {
    console.log('Error: Valid group data is required')
    return res.status(400).json({ message: 'Valid group data is required' })
  }

  try {
    const createdGroup = await prisma.$transaction(async (tx) => {
      const userId = group.userId

      if (!userId) {
        throw new Error('User ID is required')
      }

      const user = await tx.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      })

      if (!user) {
        throw new Error('No user found with the provided ID')
      }

      console.log(`Creating group for ${user.firstName} ${user.lastName}`)

      const newGroup = await tx.userGroup.create({
        data: {
          name: group.data.name,
          description: group.data.description,
          visibility: group.data.visibility,
          joinPermission: group.data.joinPermission,
          postPermission: group.data.postPermission,
          numberOfMembers: group.data.numberOfMembers,
          members: {
            create: {
              userId: userId,
              role: 'ADMIN',
              email: user.email,
              name: `${user.firstName} ${user.lastName}`,
            },
          },
        },
      })

      const groupRules = group.data.grouprules.map((rule: { rules: any }) => ({
        description: rule.rules,
        groupId: newGroup.id,
      }))

      const updatedGroup = await tx.userGroup.update({
        where: {
          id: newGroup.id,
        },
        data: {
          rules: {
            createMany: {
              data: groupRules,
            },
          },
        },
      })

      console.log('Created new group:', updatedGroup)
      return {
        group: updatedGroup,
        creator: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      }
    })

    res.status(200).json(createdGroup)
  } catch (error) {
    console.error('Error creating group:', error)
    if (error instanceof Error) {
      console.log('Error message:', error.message)
      console.log('Error stack:', error.stack)
      if (error.message.includes('Unique constraint failed')) {
        return res.status(400).json({
          message: 'A group with this name already exists for this user',
        })
      }
      res.status(400).json({ message: error.message, stack: error.stack })
    } else {
      console.log('Unknown error:', error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}
