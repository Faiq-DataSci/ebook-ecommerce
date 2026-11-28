import { env } from '../../config/env.js'
import { createXenditDynamicQris } from '../../integrations/payment/xendit.client.js'
import type { AuthenticatedUser } from '../../middlewares/auth.middleware.js'
import { AppError } from '../../utils/app-error.js'
import { userRepository, type UserRepository } from '../users/user.repository.js'
import { orderRepository, type OrderRepository } from './order.repository.js'
import type { CreateOrderInput, GetOrdersQuery } from './order.schema.js'

export class OrderService {
  constructor(
    private orderRepo: OrderRepository = orderRepository,
    private userRepo: UserRepository = userRepository,
  ) {}

  async createOrder(authUser: AuthenticatedUser, input: CreateOrderInput) {
    const user = await this.userRepo.findBySupabaseId(authUser.id)
    if (!user) {
      throw new AppError(404, 'NOT_FOUND', 'Pengguna belum terdaftar di database sistem')
    }

    if (!user.isActive) {
      throw new AppError(403, 'FORBIDDEN', 'Akun pengguna telah dinonaktifkan')
    }

    // Check duplicate existing accesses
    const existingAccesses = await this.orderRepo.findUserAccesses(user.id, input.ebookIds)
    if (existingAccesses.length > 0) {
      const titles = existingAccesses.map((a) => a.ebook.title).join(', ')
      throw new AppError(409, 'CONFLICT', `Anda sudah memiliki hak akses ke e-book: ${titles}`)
    }

    // Fetch active ebooks from DB
    const ebooks = await this.orderRepo.findActiveEbooksByIds(input.ebookIds)
    if (ebooks.length !== input.ebookIds.length) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'Satu atau lebih e-book yang dipilih tidak ditemukan atau sedang tidak aktif',
      )
    }

    // Compute total amount strictly on server from DB prices
    const totalNumber = ebooks.reduce((sum, item) => sum + Number(item.price), 0)
    const totalAmount = totalNumber.toFixed(2)

    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase()
    const orderNumber = `ORD-${Date.now()}-${randomSuffix}`
    const paymentRef = `PAY-${orderNumber}`
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const items = ebooks.map((ebook) => ({
      ebookId: ebook.id,
      unitPrice: Number(ebook.price).toFixed(2),
    }))

    const provider = process.env.PAYMENT_GATEWAY_PROVIDER || env.PAYMENT_GATEWAY_PROVIDER
    const serverKey = process.env.PAYMENT_GATEWAY_SERVER_KEY || env.PAYMENT_GATEWAY_SERVER_KEY
    const shouldGenerateLiveQris =
      provider === 'xendit' && Boolean(serverKey) && process.env.NODE_ENV !== 'test'

    let paymentMethod = 'PENDING'
    let qrPayload:
      | {
          qrId: string
          referenceId: string
          qrString: string
          status: string
          channelCode: string
          expiresAt: string | null
        }
      | undefined

    if (shouldGenerateLiveQris) {
      const qris = await createXenditDynamicQris({
        referenceId: paymentRef,
        amount: totalNumber,
        expiresAt,
      })
      paymentMethod = 'QRIS'
      qrPayload = {
        qrId: qris.qrId,
        referenceId: qris.referenceId,
        qrString: qris.qrString,
        status: qris.status,
        channelCode: qris.channelCode,
        expiresAt: qris.expiresAt,
      }
    }

    const { order, payment } = await this.orderRepo.createOrderTransaction({
      userId: user.id,
      orderNumber,
      totalAmount,
      expiresAt,
      items,
      paymentRef,
      provider,
      paymentMethod,
      qrPayload,
    })

    return { order, payment }
  }

  async getMyOrders(authUser: AuthenticatedUser, query: GetOrdersQuery) {
    const user = await this.userRepo.findBySupabaseId(authUser.id)
    if (!user) {
      throw new AppError(404, 'NOT_FOUND', 'Pengguna belum terdaftar di database sistem')
    }

    const { items, total } = await this.orderRepo.findOrdersByUserId(user.id, query)
    const totalPages = Math.ceil(total / query.limit) || 1

    return {
      items,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
      },
    }
  }

  async getOrderById(authUser: AuthenticatedUser, orderId: string) {
    const user = await this.userRepo.findBySupabaseId(authUser.id)
    if (!user) {
      throw new AppError(404, 'NOT_FOUND', 'Pengguna belum terdaftar di database sistem')
    }

    const order = await this.orderRepo.findOrderById(orderId)
    if (!order) {
      throw new AppError(404, 'NOT_FOUND', 'Pesanan tidak ditemukan')
    }

    // IDOR protection: only owner or ADMIN can view order
    if (order.userId !== user.id && authUser.role !== 'ADMIN') {
      throw new AppError(403, 'FORBIDDEN', 'Anda tidak berhak mengakses pesanan ini')
    }

    return order
  }
}

export const orderService = new OrderService()
