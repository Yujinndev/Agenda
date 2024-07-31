import jwt, { JwtPayload } from 'jsonwebtoken'
import { SECRET_ACCESS_KEY } from '../constant'

interface CustomJwtPayload extends JwtPayload {
  info: {
    email: string
    eventId: string
    status: string
  }
}

export const validateToken = (
  token: string,
): {
  valid: boolean
  email?: string
  eventId?: string
  status?: string
  error?: string
} => {
  try {
    const decoded = jwt.verify(token, SECRET_ACCESS_KEY) as CustomJwtPayload
    return {
      valid: true,
      email: decoded.info.email,
      eventId: decoded.info.eventId,
      status: decoded.info.status,
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'error',
    }
  }
}
