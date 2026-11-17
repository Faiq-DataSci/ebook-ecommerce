import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../../utils/app-error.js'
import { sendSuccess } from '../../utils/response.js'
import { orderService } from './order.service.js'
import type { CreateOrderInput, GetOrdersQuery, OrderIdParam } from './order.schema.js'

export async function createOrderController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHENTICATED', 'Token autentikasi diperlukan')
    }
    const result = await orderService.createOrder(req.user, req.body as CreateOrderInput)
    sendSuccess(res, result, 201, undefined, 'Pesanan berhasil dibuat')
  } catch (err) {
    next(err)
  }
}

export async function getMyOrdersController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHENTICATED', 'Token autentikasi diperlukan')
    }
    const query = req.query as unknown as GetOrdersQuery
    const { items, meta } = await orderService.getMyOrders(req.user, query)
    sendSuccess(res, items, 200, meta, 'Daftar pesanan berhasil diambil')
  } catch (err) {
    next(err)
  }
}

export async function getOrderByIdController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHENTICATED', 'Token autentikasi diperlukan')
    }
    const params = req.params as unknown as OrderIdParam
    const order = await orderService.getOrderById(req.user, params.id)
    sendSuccess(res, order, 200, undefined, 'Detail pesanan berhasil ditemukan')
  } catch (err) {
    next(err)
  }
}
