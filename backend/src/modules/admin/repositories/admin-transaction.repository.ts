import { prisma } from '../../../config/prisma.js'
import { AppError } from '../../../utils/app-error.js'
import type {
  GetAdminOrdersQuery,
  GetAdminPaymentsQuery,
  GetAdminSalesReportQuery,
  GetAdminTransactionsQuery,
} from '../admin.schema.js'

const orderInclude = {
  user: {
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
    },
  },
  items: {
    include: {
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
  payments: {
    orderBy: { createdAt: 'desc' as const },
  },
  transaction: true,
  ebookAccesses: {
    orderBy: { grantedAt: 'desc' as const },
  },
}

function mapRawOrder(order: {
  id: string
  orderNumber: string
  totalAmount: unknown
  status: string
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    fullName: string
    email: string
    phone: string | null
  }
  items: Array<{
    ebookId: string
    unitPrice: unknown
    ebook: {
      id: string
      title: string
      author: string
      coverUrl: string | null
    }
  }>
  payments: Array<{
    id: string
    provider: string
    paymentMethod: string
    amount: unknown
    status: string
    externalRef: string | null
    qrPayload: unknown
    expiresAt: Date | null
    paidAt: Date | null
    createdAt: Date
  }>
  transaction: {
    id: string
    transactionCode: string
    recordedAt: Date
  } | null
  ebookAccesses: Array<{
    id: string
    ebookId: string
    grantedAt: Date
    isRevoked: boolean
  }>
}) {
  const latestPayment = order.payments[0] ?? null
  const hasAccesses = order.ebookAccesses.length > 0
  const allRevoked =
    hasAccesses && order.ebookAccesses.every((access) => access.isRevoked)

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerId: order.user.id,
    customerName: order.user.fullName,
    customerEmail: order.user.email,
    customerPhone: order.user.phone,
    totalAmount: Number(order.totalAmount ?? 0),
    status: order.status,
    paymentMethod: latestPayment?.paymentMethod ?? 'QRIS / Virtual Account',
    paymentGatewayRef: latestPayment?.externalRef ?? null,
    paymentExpiresAt: (latestPayment?.expiresAt ?? order.expiresAt).toISOString(),
    paidAt: latestPayment?.paidAt?.toISOString() ?? null,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    transactionCode: order.transaction?.transactionCode ?? null,
    ebookAccessGranted: hasAccesses,
    ebookAccessRevoked: allRevoked,
    accessCount: order.ebookAccesses.length,
    rawWebhookPayload:
      latestPayment?.qrPayload && typeof latestPayment.qrPayload === 'object'
        ? (latestPayment.qrPayload as Record<string, unknown>)
        : null,
    items: order.items.map((item) => ({
      ebookId: item.ebookId,
      title: item.ebook.title,
      author: item.ebook.author,
      coverUrl: item.ebook.coverUrl,
      price: Number(item.unitPrice ?? 0),
    })),
  }
}

export async function findAdminOrderRecords(query: GetAdminOrdersQuery) {
  const where: Record<string, unknown> = {}

  if (query.status !== 'ALL') {
    where.status = query.status
  }

  if (query.search) {
    where.OR = [
      { orderNumber: { contains: query.search, mode: 'insensitive' } },
      { user: { fullName: { contains: query.search, mode: 'insensitive' } } },
      { user: { email: { contains: query.search, mode: 'insensitive' } } },
      {
        items: {
          some: {
            ebook: { title: { contains: query.search, mode: 'insensitive' } },
          },
        },
      },
    ]
  }

  const skip = (query.page - 1) * query.limit

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
      skip,
      take: query.limit,
    }),
    prisma.order.count({ where }),
  ])

  return {
    items: orders.map(mapRawOrder),
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    },
  }
}

export async function findAdminPaymentRecords(query: GetAdminPaymentsQuery) {
  const where: Record<string, unknown> = {}

  if (query.status !== 'ALL') {
    where.status = query.status
  }

  if (query.search) {
    where.OR = [
      { externalRef: { contains: query.search, mode: 'insensitive' } },
      { paymentMethod: { contains: query.search, mode: 'insensitive' } },
      { order: { orderNumber: { contains: query.search, mode: 'insensitive' } } },
      {
        order: {
          user: { fullName: { contains: query.search, mode: 'insensitive' } },
        },
      },
    ]
  }

  const skip = (query.page - 1) * query.limit

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      include: {
        order: {
          select: {
            orderNumber: true,
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
          },
        },
        transaction: {
          select: {
            transactionCode: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: query.limit,
    }),
    prisma.payment.count({ where }),
  ])

  const items = payments.map((p) => {
    const rawPayload =
      p.qrPayload && typeof p.qrPayload === 'object'
        ? (p.qrPayload as Record<string, unknown>)
        : {
            order_id: p.order.orderNumber,
            payment_type: p.paymentMethod,
            gross_amount: String(Number(p.amount ?? 0)),
            transaction_status: p.status.toLowerCase(),
            external_ref: p.externalRef ?? p.id,
          }

    return {
      id: p.id,
      paymentCode:
        p.transaction?.transactionCode ?? `PAY-${p.id.slice(0, 8).toUpperCase()}`,
      orderNumber: p.order.orderNumber,
      customerName: p.order.user.fullName,
      customerEmail: p.order.user.email,
      provider: p.provider === 'simulator' ? 'simulator' : 'midtrans',
      paymentMethod: p.paymentMethod,
      amount: Number(p.amount ?? 0),
      status: p.status,
      externalRef: p.externalRef ?? `REF-${p.id.slice(0, 8).toUpperCase()}`,
      signatureVerified: p.status === 'VERIFIED',
      receivedAt: (p.paidAt ?? p.updatedAt).toISOString(),
      rawWebhookPayload: rawPayload,
    }
  })

  return {
    items,
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    },
  }
}

export async function toggleAdminOrderAccessRecord(
  orderId: string,
  isRevoked: boolean,
  actorSupabaseId?: string,
) {
  const existing = await prisma.order.findUnique({
    where: { id: orderId },
    include: { ebookAccesses: true },
  })

  if (!existing) {
    throw new AppError(404, 'ORDER_NOT_FOUND', 'Pesanan tidak ditemukan')
  }

  if (existing.ebookAccesses.length === 0) {
    throw new AppError(
      400,
      'ACCESS_NOT_GRANTED',
      'Pesanan ini belum memiliki hak akses e-book digital yang dapat diubah',
    )
  }

  let actorId: string | null = null
  if (actorSupabaseId) {
    const actor = await prisma.user.findUnique({
      where: { supabaseUserId: actorSupabaseId },
      select: { id: true },
    })
    actorId = actor?.id ?? null
  }

  await prisma.$transaction([
    prisma.ebookAccess.updateMany({
      where: { orderId },
      data: { isRevoked },
    }),
    prisma.auditLog.create({
      data: {
        actorId,
        action: isRevoked
          ? 'ADMIN_REVOKE_EBOOK_ACCESS'
          : 'ADMIN_RESTORE_EBOOK_ACCESS',
        entityType: 'ORDER',
        entityId: orderId,
        metadata: {
          orderNumber: existing.orderNumber,
          isRevoked,
          affectedAccessCount: existing.ebookAccesses.length,
        },
      },
    }),
  ])

  const updated = await prisma.order.findUnique({
    where: { id: orderId },
    include: orderInclude,
  })

  if (!updated) {
    throw new AppError(404, 'ORDER_NOT_FOUND', 'Pesanan tidak ditemukan')
  }

  return mapRawOrder(updated)
}

export async function findAdminOrderByIdRecord(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: orderInclude,
  })

  if (!order) {
    throw new AppError(404, 'ORDER_NOT_FOUND', 'Pesanan tidak ditemukan')
  }

  return {
    ...mapRawOrder(order),
    payments: order.payments.map((payment) => ({
      id: payment.id,
      provider: payment.provider,
      paymentMethod: payment.paymentMethod,
      amount: Number(payment.amount ?? 0),
      status: payment.status,
      externalRef: payment.externalRef,
      expiresAt: payment.expiresAt?.toISOString() ?? null,
      paidAt: payment.paidAt?.toISOString() ?? null,
      createdAt: payment.createdAt.toISOString(),
    })),
    ebookAccesses: order.ebookAccesses.map((access) => ({
      id: access.id,
      ebookId: access.ebookId,
      grantedAt: access.grantedAt.toISOString(),
      isRevoked: access.isRevoked,
    })),
  }
}

function buildDateRangeFilter(startDate?: string, endDate?: string) {
  if (!startDate && !endDate) return undefined
  const range: Record<string, Date> = {}
  if (startDate) {
    range.gte = new Date(startDate)
  }
  if (endDate) {
    const end = new Date(endDate)
    if (endDate.length <= 10) {
      end.setUTCHours(23, 59, 59, 999)
    }
    range.lte = end
  }
  return range
}

export async function findAdminTransactionRecords(query: GetAdminTransactionsQuery) {
  const where: Record<string, unknown> = {}

  const recordedAtRange = buildDateRangeFilter(query.startDate, query.endDate)
  if (recordedAtRange) {
    where.recordedAt = recordedAtRange
  }

  if (query.search) {
    where.OR = [
      { transactionCode: { contains: query.search, mode: 'insensitive' } },
      { order: { orderNumber: { contains: query.search, mode: 'insensitive' } } },
      { user: { fullName: { contains: query.search, mode: 'insensitive' } } },
      { user: { email: { contains: query.search, mode: 'insensitive' } } },
    ]
  }

  const skip = (query.page - 1) * query.limit

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            items: {
              include: {
                ebook: {
                  select: {
                    id: true,
                    title: true,
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
            externalRef: true,
            paidAt: true,
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { recordedAt: 'desc' },
      skip,
      take: query.limit,
    }),
    prisma.transaction.count({ where }),
  ])

  const items = transactions.map((trx) => ({
    id: trx.id,
    transactionCode: trx.transactionCode,
    orderId: trx.orderId,
    orderNumber: trx.order.orderNumber,
    orderStatus: trx.order.status,
    paymentId: trx.paymentId,
    paymentProvider: trx.payment.provider,
    paymentMethod: trx.payment.paymentMethod,
    paymentRef: trx.payment.externalRef,
    customerId: trx.user.id,
    customerName: trx.user.fullName,
    customerEmail: trx.user.email,
    amount: Number(trx.amount ?? 0),
    recordedAt: trx.recordedAt.toISOString(),
    paidAt: trx.payment.paidAt?.toISOString() ?? null,
    items: trx.order.items.map((item) => ({
      ebookId: item.ebook.id,
      title: item.ebook.title,
      unitPrice: Number(item.unitPrice ?? 0),
    })),
  }))

  return {
    items,
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    },
  }
}

export async function getAdminSalesReportRecord(query: GetAdminSalesReportQuery) {
  const where: Record<string, unknown> = {}
  const recordedAtRange = buildDateRangeFilter(query.startDate, query.endDate)
  if (recordedAtRange) {
    where.recordedAt = recordedAtRange
  }

  const transactions = await prisma.transaction.findMany({
    where,
    include: {
      order: {
        select: {
          items: {
            include: {
              ebook: {
                select: {
                  id: true,
                  title: true,
                  category: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { recordedAt: 'asc' },
  })

  let totalRevenue = 0
  const periodMap = new Map<string, { period: string; revenue: number; transactionsCount: number }>()
  const ebookMap = new Map<
    string,
    { ebookId: string; title: string; categoryName: string; unitsSold: number; revenue: number }
  >()

  for (const trx of transactions) {
    const amount = Number(trx.amount ?? 0)
    totalRevenue += amount

    const iso = trx.recordedAt.toISOString()
    const periodKey = query.groupBy === 'month' ? iso.slice(0, 7) : iso.slice(0, 10)
    const periodBucket = periodMap.get(periodKey) ?? {
      period: periodKey,
      revenue: 0,
      transactionsCount: 0,
    }
    periodBucket.revenue += amount
    periodBucket.transactionsCount += 1
    periodMap.set(periodKey, periodBucket)

    for (const item of trx.order.items) {
      const unitPrice = Number(item.unitPrice ?? 0)
      const existingEbook = ebookMap.get(item.ebook.id) ?? {
        ebookId: item.ebook.id,
        title: item.ebook.title,
        categoryName: item.ebook.category?.name ?? 'Umum',
        unitsSold: 0,
        revenue: 0,
      }
      existingEbook.unitsSold += 1
      existingEbook.revenue += unitPrice
      ebookMap.set(item.ebook.id, existingEbook)
    }
  }

  const totalTransactions = transactions.length
  const averageOrderValue =
    totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0

  const topEbooks = Array.from(ebookMap.values())
    .sort((a, b) => b.revenue - a.revenue || b.unitsSold - a.unitsSold)
    .slice(0, 10)

  return {
    period: {
      startDate: query.startDate ?? null,
      endDate: query.endDate ?? null,
      groupBy: query.groupBy,
    },
    summary: {
      totalRevenue,
      totalTransactions,
      averageOrderValue,
    },
    series: Array.from(periodMap.values()),
    topEbooks,
  }
}

export async function toggleAdminAccessByIdRecord(
  accessId: string,
  isRevoked: boolean,
  actorSupabaseId?: string,
) {
  const existing = await prisma.ebookAccess.findUnique({
    where: { id: accessId },
    include: {
      user: { select: { id: true, fullName: true, email: true } },
      ebook: { select: { id: true, title: true } },
      order: { select: { id: true, orderNumber: true } },
    },
  })

  if (!existing) {
    throw new AppError(404, 'ACCESS_NOT_FOUND', 'Hak akses e-book tidak ditemukan')
  }

  let actorId: string | null = null
  if (actorSupabaseId) {
    const actor = await prisma.user.findUnique({
      where: { supabaseUserId: actorSupabaseId },
      select: { id: true },
    })
    actorId = actor?.id ?? null
  }

  const [updated] = await prisma.$transaction([
    prisma.ebookAccess.update({
      where: { id: accessId },
      data: { isRevoked },
    }),
    prisma.auditLog.create({
      data: {
        actorId,
        action: isRevoked
          ? 'ADMIN_REVOKE_EBOOK_ACCESS'
          : 'ADMIN_RESTORE_EBOOK_ACCESS',
        entityType: 'EBOOK_ACCESS',
        entityId: accessId,
        metadata: {
          orderNumber: existing.order.orderNumber,
          ebookId: existing.ebookId,
          userId: existing.userId,
          isRevoked,
        },
      },
    }),
  ])

  return {
    id: updated.id,
    userId: updated.userId,
    customerName: existing.user.fullName,
    customerEmail: existing.user.email,
    ebookId: updated.ebookId,
    ebookTitle: existing.ebook.title,
    orderId: updated.orderId,
    orderNumber: existing.order.orderNumber,
    grantedAt: updated.grantedAt.toISOString(),
    isRevoked: updated.isRevoked,
  }
}
