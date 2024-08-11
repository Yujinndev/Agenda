import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { getUserData } from '../../data/user/get-user'
import { SECRET_ACCESS_KEY, SECRET_REFRESH_KEY } from '../../constant'

const prisma = new PrismaClient()

export const getRefreshTokenHandler = async (req: Request, res: Response) => {
  const cookies = req.cookies

  if (!cookies.refreshToken) {
    return res.sendStatus(403)
  }

  try {
    const refreshToken = cookies.refreshToken
    const user = await getUserData({ prisma, refreshToken })

    if (!user) {
      return res.sendStatus(404)
    }

    jwt.verify(
      refreshToken,
      SECRET_REFRESH_KEY,
      (err: jwt.VerifyErrors | null, decoded: any) => {
        if (err || user.email !== decoded.email) return res.sendStatus(403)

        const accessToken = jwt.sign(
          { email: user.email, userId: user.id },
          SECRET_ACCESS_KEY,
          {
            expiresIn: '1d',
          },
        )

        return res.status(200).json({
          accessToken: accessToken,
          email: user.email,
          userId: user.id,
        })
      },
    )
  } catch {
    return res.sendStatus(500)
  }
}
