import express, { Express } from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import cors from 'cors'

import { eventRouter } from './routes/event-router'
import { authRouter } from './routes/auth-router'
import { jwtMiddleware } from './middleware/jwt-middleware'

import { getRefreshTokenHandler } from './controllers/auth/get-refresh-token'
import { getPublicEventsHandler } from './controllers/event/get-public-events'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 8000

app.use(cors({ origin: process.env.WEB_CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/api/refresh-token', getRefreshTokenHandler)
app.get('/api/event/all', getPublicEventsHandler)
app.use('/api/auth', authRouter())

/* PROTECTED ROUTES BELOW THE MIDDLEWARE */
app.use(jwtMiddleware)
app.use('/api/event', eventRouter())

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
