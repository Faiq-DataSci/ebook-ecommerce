import { prisma } from '../../config/prisma.js'
import type { GetMyTransactionsQuery } from './transaction.schema.js'

const transactionSelect = {
  id: true,
  transactionCode: true,
  amount: true,
  recordedAt: true,
  order: {
    select: {
      id: true,
      orderNumber: true,
      status: true,
      items: {
        select: {
          id: true,
          ebookId: true,
          unitPrice: true,
          ebook: {
            select: {
              id: true,
              title: true,
              author: true,
              coverUrl: true,
            },
          },
        },
      },
    },
  },
  payment: {
    select: {
      id: true,
      provider: true,
      paymentMethod: true,
      status: true,
      paidAt: true,
    },
  },
} as const

export class TransactionRepository {
  async findByUserId(userId: string, query: GetMyTransactionsQuery) {
    const where = {
      userId,
      ...(query.startDate || query.endDate
        ? {
            recordedAt: {
              ...(query.startDate ? { gte: query.startDate } : {}),
              ...(query.endDate ? { lte: query.endDate } : {}),
            },
          }
        : {}),
    }

    const [items, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        select: transactionSelect,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { recordedAt: 'desc' },
      }),
      prisma.transaction.count({ where }),
    ])

    return { items, total }
  }
}

export const transactionRepository = new TransactionRepository()
