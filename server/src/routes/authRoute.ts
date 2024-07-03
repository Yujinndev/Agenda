import {
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/authController'
import { Router } from 'express'

export const authRouter = () => {
  const router = Router()

  router.post('/login', loginUser)
  router.post('/logout', logoutUser)
  router.post('/register', registerUser)

  return router
}
