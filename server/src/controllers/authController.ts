import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { SECRET_ACCESS_KEY, SECRET_REFRESH_KEY } from '../constant'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return res.status(404).json({ error: `Couldn't find your account` })
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password)

    if (!isPasswordMatched) throw new Error()

    const accessToken = jwt.sign(
      { email: user.email, userId: user.id },
      SECRET_ACCESS_KEY,
      {
        expiresIn: '15m',
      },
    )

    const refreshToken = jwt.sign(
      { email: user.email, userId: user.id },
      SECRET_REFRESH_KEY,
      {
        expiresIn: '1d',
      },
    )

    await prisma.user.update({
      where: { email: user.email },
      data: {
        refreshToken,
      },
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    })

    res.json({ token: accessToken, email: user.email })
  } catch {
    return res.status(500).json({ error: 'Email or Password is incorrect' })
  }
}

export const logoutUser = async (req: Request, res: Response) => {
  const cookies = req.cookies

  if (!cookies.refreshToken) return res.sendStatus(204)
  const refreshToken = cookies.refreshToken

  const user = await prisma.user.findFirstOrThrow({
    where: { refreshToken: refreshToken },
  })

  if (!user) {
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax' })
    return res.sendStatus(204)
  }

  await prisma.user.update({
    where: { email: user.email },
    data: {
      refreshToken: null,
    },
  })

  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax' })
  return res.sendStatus(200)
}

export const registerUser = async (req: Request, res: Response) => {
  const { firstName, middleName, lastName, email, password } = req.body

  if (!req.body) return res.sendStatus(500)

  try {
    const checkEmailIfUsed = await prisma.user.findUnique({ where: { email } })
    if (checkEmailIfUsed) {
      return res.status(500).json({ error: 'Email is already used' })
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
    return res.sendStatus(403)
  }
}
