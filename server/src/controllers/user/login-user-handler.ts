import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { SECRET_ACCESS_KEY, SECRET_REFRESH_KEY } from '../../constant'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { ValidationError } from '../../utils/errors'
import { getUserData } from '../../data/user/get-user'

const prisma = new PrismaClient()

export const loginUserHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const user = await getUserData({ prisma, email })

    if (!user) {
      return res.status(404).json({ error: `Couldn't find your account` })
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password)

    if (!isPasswordMatched) throw new ValidationError('Password not match')

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
