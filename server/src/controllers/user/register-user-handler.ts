import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { getUserData } from '../../data/user/get-user'
import { createUserData } from '../../data/user/create-user'

const prisma = new PrismaClient()

export const registerUserHandler = async (req: Request, res: Response) => {
  const { firstName, middleName, lastName, email, password } = req.body

  if (!req.body) {
    return res.sendStatus(500)
  }

  try {
    const user = await getUserData({
      prisma,
      email,
    })

    if (user) {
      return res.status(403).json({ error: 'Email already used' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await createUserData({
      prisma,
      values: {
        firstName,
        lastName,
        middleName,
        email,
        password: hashedPassword,
      },
    })

    return res.status(200).json(newUser)
  } catch {
    return res.sendStatus(500)
  }
}
