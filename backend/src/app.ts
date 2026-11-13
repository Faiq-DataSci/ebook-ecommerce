import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import { authenticate, authorize } from './middlewares/auth.middleware.js'
import { errorHandler } from './middlewares/error.middleware.js'

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
app.use(express.json({ limit: '1mb' }))

app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend E-Book Store siap',
    data: {
      status: 'ok',
      environment: env.NODE_ENV,
    },
  })
})

app.get('/api/v1/admin/ping', authenticate, authorize('ADMIN'), (_req, res) => {
  res.status(200).json({ success: true, data: { pong: true } })
})

app.use(errorHandler)
