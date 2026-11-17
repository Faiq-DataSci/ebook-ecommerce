import { Router } from 'express'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import {
  createOrderController,
  getMyOrdersController,
  getOrderByIdController,
} from './order.controller.js'
import {
  createOrderSchema,
  getOrdersQuerySchema,
  orderIdParamSchema,
} from './order.schema.js'

export const orderRouter = Router()

orderRouter.use(authenticate)

orderRouter.post('/', validate({ body: createOrderSchema }), createOrderController)
orderRouter.get('/me', validate({ query: getOrdersQuerySchema }), getMyOrdersController)
orderRouter.get('/:id', validate({ params: orderIdParamSchema }), getOrderByIdController)
