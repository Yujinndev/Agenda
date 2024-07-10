import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export const registerUserHandler = async (req: Request, res: Response) => {
  const { firstName, middleName, lastName, email, password } = req.body

  if (!req.body) return res.sendStatus(500)

  try {
    const checkEmailIfUsed = await prisma.user.findUnique({ where: { email } })
    if (checkEmailIfUsed) {
      return res.status(403).json({ error: 'Email is already used' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        middleName,
        email,
        password: hashedPassword,
      },
    })

    res.sendStatus(200)
  } catch {
    return res.sendStatus(500)
  }
}
