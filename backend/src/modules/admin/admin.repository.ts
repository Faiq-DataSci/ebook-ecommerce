import { prisma } from '../../config/prisma.js'
import {
  SIMULATION_SAW_CRITERIA,
  type SawCriterion,
  validateSawWeights,
} from '../../services/saw.service.js'
import { AppError } from '../../utils/app-error.js'
import type {
  CreateEbookInput,
  GetAdminEbooksQuery,
  UpdateEbookInput,
} from './admin.schema.js'

export const adminEbookSelect = {
  id: true,
  categoryId: true,
  title: true,
  author: true,
  description: true,
  price: true,
  coverUrl: true,
  storagePath: true,
  pageCount: true,
  publishedYear: true,
  ratingAvg: true,
  salesCount: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
} as const

export interface WeeklySalesPoint {
  day: string
  date: string
  totalAmount: number
  totalLabel: string
  heightPercent: number
  regulerPercent: number
  bundlingPercent: number
  regulerTooltip: string
  bundlingTooltip: string
  isPeak?: boolean
  peakBadge?: string
}

export interface DashboardSummary {
  totalRevenue: number
  ordersCount: {
    PENDING: number
    PAID: number
    FAILED: number
    EXPIRED: number
    CANCELLED: number
    total: number
  }
  activeEbooksCount: number
  activeCustomersCount: number
  weeklySales?: WeeklySalesPoint[]
  yAxisTicks?: string[]
  lastSyncAt?: string
  source?: string
}

// In-memory persistent store for active criteria (default dari SIMULATION_SAW_CRITERIA)
let activeCriteria: SawCriterion[] = SIMULATION_SAW_CRITERIA.map((c) => ({ ...c }))
let criteriaUpdatedAt = new Date()

export function getActiveCriteriaStore(): { criteria: SawCriterion[]; updatedAt: Date } {
  return {
    criteria: activeCriteria.map((c) => ({ ...c })),
    updatedAt: criteriaUpdatedAt,
  }
}

export function updateActiveCriteriaStore(updates: { id: string; weight: number }[]): {
  criteria: SawCriterion[]
  updatedAt: Date
} {
  const next = activeCriteria.map((c) => {
    const match = updates.find((u) => u.id === c.id)
    if (match) {
      return { ...c, weight: match.weight }
    }
    return { ...c }
  })

  // Validasi aturan bisnis SAW (total == 1.0, tiap bobot > 0)
  validateSawWeights(next)

  activeCriteria = next
  criteriaUpdatedAt = new Date()
  return {
    criteria: activeCriteria.map((c) => ({ ...c })),
    updatedAt: criteriaUpdatedAt,
  }
}

export function resetActiveCriteriaStore(): void {
  activeCriteria = SIMULATION_SAW_CRITERIA.map((c) => ({ ...c }))
  criteriaUpdatedAt = new Date()
}

export class AdminRepository {
  async getDashboardSummary(): Promise<DashboardSummary> {
    // 1. Total revenue dari transaksi yang tercatat
    const revenueSum = await prisma.transaction.aggregate({
      _sum: { amount: true },
    })
    const totalRevenue = revenueSum._sum.amount ? Number(revenueSum._sum.amount) : 0

    // 2. Orders per status
    const groupedOrders = await prisma.order.groupBy({
      by: ['status'],
      _count: true,
    })
    const ordersCount = {
      PENDING: 0,
      PAID: 0,
      FAILED: 0,
      EXPIRED: 0,
      CANCELLED: 0,
      total: 0,
    }
    for (const item of groupedOrders) {
      if (item.status in ordersCount) {
        ordersCount[item.status as keyof typeof ordersCount] = item._count
        ordersCount.total += item._count
      }
    }

    // 3. Ebook aktif
    const activeEbooksCount = await prisma.ebook.count({
      where: { isActive: true },
    })

    // 4. Pelanggan aktif
    const activeCustomersCount = await prisma.user.count({
      where: { role: 'CUSTOMER', isActive: true },
    })

    // 5. Agregasi penjualan mingguan riil dari transaksi & order secara real-time
    const dayLabels = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB']
    const now = new Date()
    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    // Deteksi apakah minggu berjalan saat ini sudah memiliki data transaksi/order
    const recentCurrentTrx = await prisma.transaction.count({
      where: { recordedAt: { gte: sevenDaysAgo } },
    })
    const recentCurrentOrders = await prisma.order.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    })

    let anchorDate = now
    // Jika dalam 7 hari terakhir kalender hari ini kosong, gunakan tanggal transaksi/order terbaru di database
    if (recentCurrentTrx === 0 && recentCurrentOrders === 0) {
      const latestTx = await prisma.transaction.findFirst({
        orderBy: { recordedAt: 'desc' },
        select: { recordedAt: true },
      })
      const latestOrder = await prisma.order.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      })
      const candidates = [latestTx?.recordedAt, latestOrder?.createdAt].filter(Boolean) as Date[]
      if (candidates.length > 0) {
        anchorDate = new Date(Math.max(...candidates.map((d) => d.getTime())))
      }
    }

    const windowStart = new Date(anchorDate)
    windowStart.setDate(windowStart.getDate() - 6)
    windowStart.setHours(0, 0, 0, 0)

    const windowEnd = new Date(anchorDate)
    windowEnd.setHours(23, 59, 59, 999)

    const recentTransactions = await prisma.transaction.findMany({
      where: {
        recordedAt: { gte: windowStart, lte: windowEnd },
      },
      select: {
        amount: true,
        recordedAt: true,
      },
    })

    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: windowStart, lte: windowEnd },
      },
      select: {
        totalAmount: true,
        status: true,
        createdAt: true,
      },
    })

    const weeklySales: WeeklySalesPoint[] = []
    let maxDayAmount = 0
    for (let i = 6; i >= 0; i--) {
      const d = new Date(anchorDate)
      d.setDate(d.getDate() - i)
      const dayKey = d.toISOString().split('T')[0]!
      const dayLabel = dayLabels[d.getDay()]!

      const dayTrx = recentTransactions.filter(
        (t) => t.recordedAt.toISOString().split('T')[0] === dayKey,
      )
      const dayOrders = recentOrders.filter(
        (o) => o.createdAt.toISOString().split('T')[0] === dayKey,
      )

      let totalDayAmount = dayTrx.reduce((sum, t) => sum + Number(t.amount), 0)
      if (totalDayAmount === 0) {
        // Fallback ke total pesanan berstatus PAID jika ada
        const paidOrdersAmount = dayOrders
          .filter((o) => o.status === 'PAID')
          .reduce((sum, o) => sum + Number(o.totalAmount), 0)
        totalDayAmount = paidOrdersAmount
      }

      if (totalDayAmount > maxDayAmount) {
        maxDayAmount = totalDayAmount
      }

      const paidCount = dayOrders.filter((o) => o.status === 'PAID').length
      const totalOrdersInDay = dayOrders.length || (totalDayAmount > 0 ? 1 : 0)
      const regulerPercent = totalOrdersInDay > 0
        ? Math.round((paidCount / totalOrdersInDay) * 100) || (totalDayAmount > 0 ? 100 : 0)
        : 0
      const bundlingPercent = 100 - regulerPercent

      weeklySales.push({
        day: dayLabel,
        date: dayKey,
        totalAmount: totalDayAmount,
        totalLabel:
          totalDayAmount >= 1_000_000
            ? `${(totalDayAmount / 1_000_000).toFixed(1)}M`
            : totalDayAmount >= 1_000
              ? `${Math.round(totalDayAmount / 1_000)}k`
              : `${totalDayAmount}`,
        heightPercent: 0,
        regulerPercent,
        bundlingPercent,
        regulerTooltip: `Lunas: Rp ${totalDayAmount.toLocaleString('id-ID')}`,
        bundlingTooltip: `Pesanan: ${dayOrders.length}`,
      })
    }

    // Tentukan ceiling dan dynamic Y-Axis ticks berdasarkan skala transaksi riil
    let ceiling = 100_000
    let yAxisTicks: string[] = ['100k', '75k', '50k', '25k', '0']

    if (maxDayAmount > 10_000_000) {
      ceiling = Math.ceil(maxDayAmount / 5_000_000) * 5_000_000
      yAxisTicks = [
        `${(ceiling / 1_000_000).toFixed(1)}M`,
        `${((ceiling * 0.75) / 1_000_000).toFixed(1)}M`,
        `${((ceiling * 0.5) / 1_000_000).toFixed(1)}M`,
        `${((ceiling * 0.25) / 1_000_000).toFixed(1)}M`,
        '0',
      ]
    } else if (maxDayAmount > 5_000_000) {
      ceiling = 10_000_000
      yAxisTicks = ['10.0M', '7.5M', '5.0M', '2.5M', '0']
    } else if (maxDayAmount > 1_000_000) {
      ceiling = 5_000_000
      yAxisTicks = ['5.0M', '3.8M', '2.5M', '1.3M', '0']
    } else if (maxDayAmount > 500_000) {
      ceiling = 1_000_000
      yAxisTicks = ['1.0M', '750k', '500k', '250k', '0']
    } else if (maxDayAmount > 100_000) {
      ceiling = 500_000
      yAxisTicks = ['500k', '375k', '250k', '125k', '0']
    } else if (maxDayAmount > 0) {
      ceiling = 100_000
      yAxisTicks = ['100k', '75k', '50k', '25k', '0']
    }

    let peakIndex = 0
    let peakVal = -1
    weeklySales.forEach((p, idx) => {
      p.heightPercent = p.totalAmount > 0
        ? Math.min(100, Math.max(16, Math.round((p.totalAmount / ceiling) * 100)))
        : 8
      if (p.totalAmount > peakVal) {
        peakVal = p.totalAmount
        peakIndex = idx
      }
    })

    const peakItem = weeklySales[peakIndex]
    if (peakItem && peakVal > 0) {
      peakItem.isPeak = true
      peakItem.peakBadge = 'PUNCAK'
    }

    return {
      totalRevenue,
      ordersCount,
      activeEbooksCount,
      activeCustomersCount,
      weeklySales,
      yAxisTicks,
      lastSyncAt: new Date().toISOString(),
      source: 'DATABASE_POSTGRESQL',
    }
  }

  getActiveSawCriteria() {
    return getActiveCriteriaStore()
  }

  updateActiveSawCriteria(updates: { id: string; weight: number }[]) {
    return updateActiveCriteriaStore(updates)
  }

  async findAdminEbooks(query: GetAdminEbooksQuery) {
    const skip = (query.page - 1) * query.limit
    const take = query.limit

    const where: Record<string, unknown> = {}

    if (query.status === 'AKTIF') {
      where.isActive = true
    } else if (query.status === 'ARSIP') {
      where.isActive = false
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { author: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {
      [query.sortBy]: query.sortOrder,
    }

    const [items, total] = await Promise.all([
      prisma.ebook.findMany({
        where,
        select: adminEbookSelect,
        skip,
        take,
        orderBy,
      }),
      prisma.ebook.count({ where }),
    ])

    return {
      items,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit) || 1,
      },
    }
  }

  async createEbook(data: CreateEbookInput) {
    const categoryExists = await prisma.category.findUnique({
      where: { id: data.categoryId },
    })
    if (!categoryExists) {
      throw new AppError(404, 'NOT_FOUND', 'Kategori e-book tidak ditemukan')
    }

    return prisma.ebook.create({
      data: {
        categoryId: data.categoryId,
        title: data.title,
        author: data.author,
        description: data.description,
        price: data.price,
        coverUrl: data.coverUrl ?? null,
        storagePath: data.storagePath || 'ebooks-private/default.pdf',
        pageCount: data.pageCount ?? null,
        publishedYear: data.publishedYear ?? null,
        isActive: data.isActive ?? true,
      },
      select: adminEbookSelect,
    })
  }

  async updateEbook(id: string, data: UpdateEbookInput) {
    const existing = await prisma.ebook.findUnique({
      where: { id },
    })
    if (!existing) {
      throw new AppError(404, 'NOT_FOUND', 'E-book tidak ditemukan')
    }

    if (data.categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: data.categoryId },
      })
      if (!categoryExists) {
        throw new AppError(404, 'NOT_FOUND', 'Kategori e-book tidak ditemukan')
      }
    }

    return prisma.ebook.update({
      where: { id },
      data: {
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.author !== undefined && { author: data.author }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.coverUrl !== undefined && { coverUrl: data.coverUrl }),
        ...(data.storagePath !== undefined && { storagePath: data.storagePath }),
        ...(data.pageCount !== undefined && { pageCount: data.pageCount }),
        ...(data.publishedYear !== undefined && { publishedYear: data.publishedYear }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      select: adminEbookSelect,
    })
  }

  async toggleEbookStatus(id: string, isActive: boolean) {
    const existing = await prisma.ebook.findUnique({
      where: { id },
    })
    if (!existing) {
      throw new AppError(404, 'NOT_FOUND', 'E-book tidak ditemukan')
    }

    return prisma.ebook.update({
      where: { id },
      data: { isActive },
      select: adminEbookSelect,
    })
  }
}

export const adminRepository = new AdminRepository()
