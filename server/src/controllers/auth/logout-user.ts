import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const logoutUserHandler = async (req: Request, res: Response) => {
  const cookies = req.cookies

  if (!cookies.refreshToken) return res.sendStatus(204)
  const refreshToken = cookies.refreshToken

  try {
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
  } catch (error) {
    res.status(500).json(error)
  }
}
