import { prisma } from '../../../config/prisma.js'
import { AppError } from '../../../utils/app-error.js'
import type { GetAdminCustomersQuery } from '../admin.schema.js'

const customerInclude = {
  orders: {
    orderBy: { createdAt: 'desc' as const },
    include: { _count: { select: { items: true } } },
  },
  ebookAccesses: {
    orderBy: { grantedAt: 'desc' as const },
    include: {
      ebook: { select: { title: true, author: true } },
      order: { select: { orderNumber: true } },
    },
  },
}

interface RawUserWithRelations {
  id: string
  fullName: string
  email: string
  phone: string | null
  role: 'CUSTOMER' | 'ADMIN'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  orders: Array<{
    id: string
    orderNumber: string
    totalAmount: unknown
    status: string
    createdAt: Date
    _count: { items: number }
  }>
  ebookAccesses: Array<{
    id: string
    ebookId: string
    grantedAt: Date
    isRevoked: boolean
    ebook: { title: string; author: string }
    order: { orderNumber: string }
  }>
}

function mapUserToAdminCustomer(user: RawUserWithRelations) {
  const paidOrders = user.orders.filter((o) => o.status === 'PAID')
  const totalSpent = paidOrders.reduce((sum, o) => sum + Number(o.totalAmount ?? 0), 0)
  const activeAccessCount = user.ebookAccesses.filter((a) => !a.isRevoked).length

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    ordersCount: user.orders.length,
    paidOrdersCount: paidOrders.length,
    totalSpent,
    ownedEbooksCount: user.ebookAccesses.length,
    activeAccessCount,
    orders: user.orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      totalAmount: Number(o.totalAmount ?? 0),
      status: o.status,
      createdAt: o.createdAt.toISOString(),
      itemCount: o._count.items,
    })),
    ebookAccesses: user.ebookAccesses.map((a) => ({
      id: a.id,
      ebookId: a.ebookId,
      ebookTitle: a.ebook.title,
      ebookAuthor: a.ebook.author,
      orderNumber: a.order.orderNumber,
      grantedAt: a.grantedAt.toISOString(),
      isRevoked: a.isRevoked,
    })),
  }
}

export async function findAdminCustomerRecords(query: GetAdminCustomersQuery) {
  const where: Record<string, unknown> = {}

  if (query.status === 'ACTIVE') {
    where.isActive = true
  } else if (query.status === 'INACTIVE') {
    where.isActive = false
  }

  if (query.role !== 'ALL') {
    where.role = query.role
  }

  if (query.search) {
    where.OR = [
      { fullName: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
      { phone: { contains: query.search, mode: 'insensitive' } },
    ]
  }

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [rawUsers, totalCustomers, activeCustomers, inactiveCustomers, newCustomersLast30Days] =
    await Promise.all([
      prisma.user.findMany({
        where,
        include: customerInclude,
        orderBy:
          query.sortBy === 'totalSpent'
            ? { createdAt: 'desc' }
            : { [query.sortBy]: query.sortOrder },
      }),
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: false } }),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    ])

  const mapped = rawUsers.map(mapUserToAdminCustomer)

  if (query.sortBy === 'totalSpent') {
    mapped.sort((a, b) =>
      query.sortOrder === 'asc' ? a.totalSpent - b.totalSpent : b.totalSpent - a.totalSpent,
    )
  }

  const total = mapped.length
  const skip = (query.page - 1) * query.limit
  const items = mapped.slice(skip, skip + query.limit)

  return {
    data: {
      items,
      summary: {
        totalCustomers,
        activeCustomers,
        inactiveCustomers,
        newCustomersLast30Days,
      },
    },
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    },
  }
}

export async function findAdminCustomerByIdRecord(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: customerInclude,
  })

  if (!user) {
    throw new AppError(404, 'NOT_FOUND', 'Data pelanggan tidak ditemukan')
  }

  return mapUserToAdminCustomer(user)
}

export async function toggleAdminCustomerStatusRecord(id: string, isActive: boolean) {
  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) {
    throw new AppError(404, 'NOT_FOUND', 'Data pelanggan tidak ditemukan')
  }

  if (existing.role === 'ADMIN' && !isActive) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'Akun dengan role ADMIN tidak dapat dinonaktifkan melalui manajemen pelanggan',
    )
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { isActive },
    include: customerInclude,
  })

  return mapUserToAdminCustomer(updated)
}
