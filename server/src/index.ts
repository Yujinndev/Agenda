import express, { Express } from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import cors from 'cors'

import { authRouter } from './routes/auth-router'
import { eventRouter } from './routes/event-router'
import { groupRouter } from './routes/group-router'
import { jwtMiddleware } from './middleware/jwt-middleware'

import { getRefreshTokenHandler } from './controllers/user/get-refresh-token-handler'

import { getEventHandler } from './controllers/event/get-event-handler'
import { getPublicEventsHandler } from './controllers/event/get-public-events-handler'
import { createCommitteeResponseHandler } from './controllers/committee/committee-response-handler'

import { getPublicGroupHandler } from './controllers/group/get-public-group-handler'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 8000

app.use(cors({ origin: process.env.WEB_CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/api/event/:id', getEventHandler)
app.get('/api/event/public/:page', getPublicEventsHandler)
app.post('/api/event/approval/response', createCommitteeResponseHandler)

app.get('/api/group/public', getPublicGroupHandler)

app.get('/api/refresh-token', getRefreshTokenHandler)
app.use('/api/auth', authRouter())
/* PROTECTED ROUTES BELOW THE MIDDLEWARE */
app.use(jwtMiddleware)
app.use('/api/event', eventRouter())
app.use('/api/group', groupRouter())

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
