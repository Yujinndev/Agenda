import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { getGroupData } from '../../data/event/get-group'
import { getAdminData } from '../../data/user/get-admin'

const prisma = new PrismaClient()

export const getGroupHandler = async (req: Request, res: Response) => {
  const { id } = req.params

  if (!id) {
    return res.sendStatus(403)
  }

  try {
    const userGroup = await getGroupData({ prisma, id })
    const admin = await getAdminData({ prisma, groupIds: id })

    const record = {
      ...userGroup,
      admin,
    }
    console.log(record)

    return res.status(200).json(record)
  } catch (error) {
    console.error('Error fetching group:', error)
    res.sendStatus(500)
  }
}
