import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { SECRET_ACCESS_KEY } from '@/constant'

export const jwtCookieVerify = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const [bearer, token] = authHeader.split(' ')

  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  try {
    const decoded = jwt.verify(token, SECRET_ACCESS_KEY)
    req.body.email = (decoded as { email: string }).email

    next()
  } catch {
    res.status(403).json({ error: 'Failed to authenticate token' })
  }
}
