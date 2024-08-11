import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { getGroupData } from '../../data/group/get-group'
import { getGroupAdminData } from '../../data/group/get-group-admin'

const prisma = new PrismaClient()

export const getGroupHandler = async (req: Request, res: Response) => {
  const { id } = req.params

  if (!id) {
    return res.sendStatus(403)
  }

  try {
    const userGroup = await getGroupData({ prisma, id })
    const admin = await getGroupAdminData({ prisma, groupIds: id })

    const record = {
      ...userGroup,
      admin,
    }

    return res.status(200).json(record)
  } catch {
    return res.sendStatus(500)
  }
}
