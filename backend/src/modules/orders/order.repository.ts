import { prisma } from '../../config/prisma.js'
import type { GetOrdersQuery } from './order.schema.js'

export const orderItemSelect = {
  id: true,
  orderId: true,
  ebookId: true,
  unitPrice: true,
  ebook: {
    select: {
      id: true,
      title: true,
      author: true,
      price: true,
      coverUrl: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  },
} as const

export const orderDetailSelect = {
  id: true,
  userId: true,
  orderNumber: true,
  totalAmount: true,
  status: true,
  expiresAt: true,
  createdAt: true,
  updatedAt: true,
  items: {
    select: orderItemSelect,
  },
  payments: {
    select: {
      id: true,
      provider: true,
      paymentMethod: true,
      amount: true,
      status: true,
      externalRef: true,
      expiresAt: true,
      paidAt: true,
      createdAt: true,
    },
  },
} as const

export class OrderRepository {
  async findUserAccesses(userId: string, ebookIds: string[]) {
    return prisma.ebookAccess.findMany({
      where: {
        userId,
        ebookId: { in: ebookIds },
        isRevoked: false,
      },
      include: {
        ebook: {
          select: { id: true, title: true },
        },
      },
    })
  }

  async findActiveEbooksByIds(ebookIds: string[]) {
    return prisma.ebook.findMany({
      where: {
        id: { in: ebookIds },
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        price: true,
        isActive: true,
      },
    })
  }

  async createOrderTransaction(params: {
    userId: string
    orderNumber: string
    totalAmount: string
    expiresAt: Date
    items: Array<{ ebookId: string; unitPrice: string }>
    paymentRef: string
  }) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: params.userId,
          orderNumber: params.orderNumber,
          totalAmount: params.totalAmount,
          status: 'PENDING',
          expiresAt: params.expiresAt,
          items: {
            create: params.items.map((item) => ({
              ebookId: item.ebookId,
              unitPrice: item.unitPrice,
            })),
          },
        },
        select: orderDetailSelect,
      })

      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          provider: 'midtrans',
          paymentMethod: 'PENDING',
          amount: params.totalAmount,
          status: 'PENDING',
          externalRef: params.paymentRef,
          expiresAt: params.expiresAt,
        },
      })

      return { order, payment }
    })
  }

  async findOrdersByUserId(userId: string, query: GetOrdersQuery) {
    const skip = (query.page - 1) * query.limit
    const take = query.limit

    const where: Record<string, unknown> = { userId }
    if (query.status) {
      where.status = query.status
    }

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        select: orderDetailSelect,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ])

    return { items, total }
  }

  async findOrderById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      select: orderDetailSelect,
    })
  }
}

export const orderRepository = new OrderRepository()
