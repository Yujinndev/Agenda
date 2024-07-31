import jwt from 'jsonwebtoken'
import { SECRET_ACCESS_KEY } from '../constant'

type TokenProps = {
  email: string
  eventId: string
  status: string
}

export const createEmailLinkWithToken = ({
  email,
  eventId,
  status,
}: TokenProps) => {
  const newToken = jwt.sign(
    { info: { email, status, eventId } },
    SECRET_ACCESS_KEY,
    {
      expiresIn: '5d',
    },
  )

  const accessLink = `${process.env.WEB_CLIENT_URL}/response-form/?token=${newToken}&id=${eventId}&status=${status}&user=${email}`
  return accessLink
}
