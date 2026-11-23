import { Router } from 'express'
import { authenticate, authorize } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { getMyTransactionsController } from './transaction.controller.js'
import { getMyTransactionsQuerySchema } from './transaction.schema.js'

export const transactionRouter = Router()

transactionRouter.get(
  '/my',
  authenticate,
  authorize('CUSTOMER'),
  validate({ query: getMyTransactionsQuerySchema }),
  getMyTransactionsController,
)
