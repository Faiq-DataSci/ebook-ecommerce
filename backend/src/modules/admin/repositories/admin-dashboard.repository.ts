import { prisma } from '../../../config/prisma.js'

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

const DAY_LABELS = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'] as const

function computeChartScale(maxDayAmount: number): { ceiling: number; yAxisTicks: string[] } {
  if (maxDayAmount > 10_000_000) {
    const ceiling = Math.ceil(maxDayAmount / 5_000_000) * 5_000_000
    return {
      ceiling,
      yAxisTicks: [
        `${(ceiling / 1_000_000).toFixed(1)}M`,
        `${((ceiling * 0.75) / 1_000_000).toFixed(1)}M`,
        `${((ceiling * 0.5) / 1_000_000).toFixed(1)}M`,
        `${((ceiling * 0.25) / 1_000_000).toFixed(1)}M`,
        '0',
      ],
    }
  }
  if (maxDayAmount > 5_000_000) {
    return { ceiling: 10_000_000, yAxisTicks: ['10.0M', '7.5M', '5.0M', '2.5M', '0'] }
  }
  if (maxDayAmount > 1_000_000) {
    return { ceiling: 5_000_000, yAxisTicks: ['5.0M', '3.8M', '2.5M', '1.3M', '0'] }
  }
  if (maxDayAmount > 500_000) {
    return { ceiling: 1_000_000, yAxisTicks: ['1.0M', '750k', '500k', '250k', '0'] }
  }
  if (maxDayAmount > 100_000) {
    return { ceiling: 500_000, yAxisTicks: ['500k', '375k', '250k', '125k', '0'] }
  }
  return { ceiling: 100_000, yAxisTicks: ['100k', '75k', '50k', '25k', '0'] }
}

function formatDayTotalLabel(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `${Math.round(amount / 1_000)}k`
  return `${amount}`
}

export async function getDashboardSummaryRecord(): Promise<DashboardSummary> {
  const [revenueSum, groupedOrders, activeEbooksCount, activeCustomersCount] =
    await Promise.all([
      prisma.transaction.aggregate({ _sum: { amount: true } }),
      prisma.order.groupBy({ by: ['status'], _count: true }),
      prisma.ebook.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: 'CUSTOMER', isActive: true } }),
    ])

  const totalRevenue = revenueSum._sum.amount ? Number(revenueSum._sum.amount) : 0
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

  const now = new Date()
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const [recentCurrentTrx, recentCurrentOrders] = await Promise.all([
    prisma.transaction.count({ where: { recordedAt: { gte: sevenDaysAgo } } }),
    prisma.order.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
  ])

  let anchorDate = now
  // Gunakan tanggal transaksi/order terbaru bila 7 hari kalender terakhir masih kosong
  if (recentCurrentTrx === 0 && recentCurrentOrders === 0) {
    const [latestTx, latestOrder] = await Promise.all([
      prisma.transaction.findFirst({
        orderBy: { recordedAt: 'desc' },
        select: { recordedAt: true },
      }),
      prisma.order.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
    ])
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

  const [recentTransactions, recentOrders] = await Promise.all([
    prisma.transaction.findMany({
      where: { recordedAt: { gte: windowStart, lte: windowEnd } },
      select: { amount: true, recordedAt: true },
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: windowStart, lte: windowEnd } },
      select: { totalAmount: true, status: true, createdAt: true },
    }),
  ])

  const weeklySales: WeeklySalesPoint[] = []
  let maxDayAmount = 0

  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(anchorDate)
    d.setDate(d.getDate() - i)
    const dayKey = d.toISOString().split('T')[0]!
    const dayLabel = DAY_LABELS[d.getDay()]!

    const dayTrx = recentTransactions.filter(
      (t) => t.recordedAt.toISOString().split('T')[0] === dayKey,
    )
    const dayOrders = recentOrders.filter(
      (o) => o.createdAt.toISOString().split('T')[0] === dayKey,
    )

    let totalDayAmount = dayTrx.reduce((sum, t) => sum + Number(t.amount), 0)
    if (totalDayAmount === 0) {
      totalDayAmount = dayOrders
        .filter((o) => o.status === 'PAID')
        .reduce((sum, o) => sum + Number(o.totalAmount), 0)
    }

    if (totalDayAmount > maxDayAmount) {
      maxDayAmount = totalDayAmount
    }

    const paidCount = dayOrders.filter((o) => o.status === 'PAID').length
    const totalOrdersInDay = dayOrders.length || (totalDayAmount > 0 ? 1 : 0)
    const regulerPercent =
      totalOrdersInDay > 0
        ? Math.round((paidCount / totalOrdersInDay) * 100) || (totalDayAmount > 0 ? 100 : 0)
        : 0

    weeklySales.push({
      day: dayLabel,
      date: dayKey,
      totalAmount: totalDayAmount,
      totalLabel: formatDayTotalLabel(totalDayAmount),
      heightPercent: 0,
      regulerPercent,
      bundlingPercent: 100 - regulerPercent,
      regulerTooltip: `Lunas: Rp ${totalDayAmount.toLocaleString('id-ID')}`,
      bundlingTooltip: `Pesanan: ${dayOrders.length}`,
    })
  }

  const { ceiling, yAxisTicks } = computeChartScale(maxDayAmount)

  let peakIndex = 0
  let peakVal = -1
  weeklySales.forEach((point, idx) => {
    point.heightPercent =
      point.totalAmount > 0
        ? Math.min(100, Math.max(16, Math.round((point.totalAmount / ceiling) * 100)))
        : 8
    if (point.totalAmount > peakVal) {
      peakVal = point.totalAmount
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
