import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { ValidationError } from '../../utils/errors'
import { getUserData } from '../../data/user/get-user'
import { SECRET_ACCESS_KEY, SECRET_REFRESH_KEY } from '../../constant'

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
        expiresIn: '1d',
      },
    )

    const refreshToken = jwt.sign(
      { email: user.email, userId: user.id },
      SECRET_REFRESH_KEY,
      {
        expiresIn: '7d',
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
      maxAge: 24 * 60 * 60 * 7000,
    })

    return res
      .status(200)
      .json({ token: accessToken, email: user.email, userId: user.id })
  } catch {
    return res.status(500).json({ error: 'Email or Password is incorrect' })
  }
}
