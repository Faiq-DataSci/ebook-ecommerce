import cors from 'cors'
import express, { type Request } from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import { authenticate, authorize } from './middlewares/auth.middleware.js'
import { errorHandler } from './middlewares/error.middleware.js'
import { notFoundHandler } from './middlewares/not-found.middleware.js'
import { sendSuccess } from './utils/response.js'

export interface RequestWithRawBody extends Request {
  rawBody?: Buffer
}

const allowedOrigins = env.CORS_ORIGINS.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

export const app = express()

app.use(helmet())
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }
      callback(new Error('Origin tidak diizinkan oleh kebijakan CORS'))
    },
    credentials: true,
  }),
)
app.use(
  express.json({
    limit: '1mb',
    verify(req, _res, buf) {
      ;(req as RequestWithRawBody).rawBody = buf
    },
  }),
)

app.get('/api/v1/health', (_req, res) => {
  sendSuccess(
    res,
    {
      status: 'ok',
      environment: env.NODE_ENV,
    },
    200,
    undefined,
    'Backend E-Book Store siap',
  )
})

app.get('/api/v1/admin/ping', authenticate, authorize('ADMIN'), (_req, res) => {
  sendSuccess(res, { pong: true })
})

app.use(notFoundHandler)
app.use(errorHandler)
