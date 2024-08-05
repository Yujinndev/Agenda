import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { getUserData } from '../../data/user/get-user'

const prisma = new PrismaClient()

export const logoutUserHandler = async (req: Request, res: Response) => {
  const cookies = req.cookies

  if (!cookies.refreshToken) {
    return res.sendStatus(204)
  }

  try {
    const refreshToken = cookies.refreshToken
    const user = await getUserData({ prisma, refreshToken })

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
  } catch {
    return res.sendStatus(500)
  }
}
