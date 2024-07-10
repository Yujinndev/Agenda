import { Router } from 'express'

import { loginUserHandler } from '../controllers/auth/login-user'
import { logoutUserHandler } from '../controllers/auth/logout-user'
import { registerUserHandler } from '../controllers/auth/register-user'

export const authRouter = () => {
  const router = Router()

  router.post('/login', loginUserHandler)
  router.post('/logout', logoutUserHandler)
  router.post('/register', registerUserHandler)

  return router
}
