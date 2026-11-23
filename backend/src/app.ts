import cors from 'cors'
import express, { type Request } from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import { authenticate, authorize } from './middlewares/auth.middleware.js'
import { errorHandler } from './middlewares/error.middleware.js'
import { notFoundHandler } from './middlewares/not-found.middleware.js'
import { adminRouter } from './modules/admin/admin.routes.js'
import { authRouter } from './modules/auth/auth.routes.js'
import { categoriesRouter, ebooksRouter } from './modules/catalog/catalog.routes.js'
import { orderRouter } from './modules/orders/order.routes.js'
import { paymentRouter } from './modules/payments/payment.routes.js'
import { recommendationRouter } from './modules/recommendations/recommendation.routes.js'
import { transactionRouter } from './modules/transactions/transaction.routes.js'
import { userRouter } from './modules/users/user.routes.js'
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

app.use('/api/v1/admin', adminRouter)

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/categories', categoriesRouter)
app.use('/api/v1/ebooks', ebooksRouter)
app.use('/api/v1/orders', orderRouter)
app.use('/api/v1/payments', paymentRouter)
app.use('/api/v1/transactions', transactionRouter)
app.use('/api/v1/recommendations', recommendationRouter)

app.use(notFoundHandler)
app.use(errorHandler)
