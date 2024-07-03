import express, { Express } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import { authRouter } from './routes/authRoute'
import { jwtCookieVerify } from './middleware/jwtCookie'
import { handleRefreshToken } from './controllers/refreshTokenController'
import { eventRouter } from './routes/eventRoute'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 8000

app.use(cors({ origin: process.env.WEB_CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/refresh-token', handleRefreshToken)
app.use('/auth', authRouter())
app.use('/event', jwtCookieVerify, eventRouter())

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
