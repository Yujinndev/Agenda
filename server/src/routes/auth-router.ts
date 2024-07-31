import { Router } from 'express'
import { loginUserHandler } from '../controllers/user/login-user-handler'
import { logoutUserHandler } from '../controllers/user/logout-user-handler'
import { registerUserHandler } from '../controllers/user/register-user-handler'

export const authRouter = () => {
  const router = Router()

  router.post('/login', loginUserHandler)
  router.post('/logout', logoutUserHandler)
  router.post('/register', registerUserHandler)
  return router
}
