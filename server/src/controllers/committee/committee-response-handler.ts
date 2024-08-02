import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { committeeResponseService } from '../../services/committee/committee-response-service'
import { validateToken } from '../../middleware/validate-token'
import { getUserData } from '../../data/user/get-user'
import { NotFoundError } from '../../utils/errors'

const prisma = new PrismaClient()

export const createCommitteeResponseHandler = async (
  req: Request,
  res: Response,
) => {
  const { data, userId } = req.body
  const { token, ...rest } = data
  const { refreshToken } = req.cookies

  if (!data) {
    return res.sendStatus(400)
  }

  if (!token && !refreshToken) {
    return res.sendStatus(403)
  }

  if (token) {
    const validation = validateToken(token)

    if (!validation.valid) {
      return res.sendStatus(401)
    }

    const { email: validationEmail, eventId: validationId, status } = validation

    if (
      validationEmail !== data.committeeEmail ||
      validationId !== data.eventId ||
      status !== data.responseType
    ) {
      return res.sendStatus(401)
    }
  } else if (refreshToken) {
    const user = await getUserData({ prisma, email: data.committeeEmail })

    if (!user) {
      throw new NotFoundError('No user found.')
    }

    if (user.refreshToken !== refreshToken) {
      return res.sendStatus(401)
    }
  }

  try {
    const response = await committeeResponseService({
      prisma,
      userId,
      eventId: data.eventId,
      committeeEmail: data.committeeEmail,
      values: { ...rest },
    })

    return res.status(200).json(response)
  } catch {
    return res.sendStatus(500)
  }
}
