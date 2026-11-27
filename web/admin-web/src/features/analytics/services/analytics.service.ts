import { formatRupiah } from '../../../shared/utils/formatters'
import { fetchAdminSalesReport } from '../../transactions/services/transactionAdmin.service'
import { getAnalyticsDataset } from '../data/analyticsData'
import type {
  AnalyticsDataset,
  AnalyticsPeriod,
  TimeSeriesPoint,
  TopPerformingEbook,
} from '../types/analytics'

function resolveDateRange(
  period: AnalyticsPeriod,
  customStart?: string,
  customEnd?: string,
): { startDate?: string; endDate?: string; groupBy: 'day' | 'month' } {
  const today = new Date()
  const toIsoDate = (d: Date) => d.toISOString().slice(0, 10)

  if (period === 'CUSTOM') {
    return {
      startDate: customStart || undefined,
      endDate: customEnd || undefined,
      groupBy: 'day',
    }
  }

  if (period === 'YTD') {
    return {
      startDate: `${today.getUTCFullYear()}-01-01`,
      endDate: toIsoDate(today),
      groupBy: 'month',
    }
  }

  const days = period === '7D' ? 7 : period === '90D' ? 90 : 30
  const start = new Date(today)
  start.setUTCDate(start.getUTCDate() - days)
  return {
    startDate: toIsoDate(start),
    endDate: toIsoDate(today),
    groupBy: period === '90D' ? 'month' : 'day',
  }
}

export async function fetchAnalyticsDataset(
  period: AnalyticsPeriod,
  customStart?: string,
  customEnd?: string,
): Promise<{ dataset: AnalyticsDataset; isSimulated: boolean }> {
  const fallback = getAnalyticsDataset(period, customStart, customEnd)
  const range = resolveDateRange(period, customStart, customEnd)

  try {
    const report = await fetchAdminSalesReport(range)
    if (!report || report.summary.totalTransactions === 0) {
      return { dataset: fallback, isSimulated: true }
    }

    const totalRevenue = report.summary.totalRevenue
    const totalTransactions = report.summary.totalTransactions
    const averageOrderValue = report.summary.averageOrderValue
    const totalUnits = report.topEbooks.reduce((acc, item) => acc + item.unitsSold, 0)

    const liveKpis = fallback.kpis.map((kpi) => {
      if (kpi.id === 'kpi-revenue') {
        return {
          ...kpi,
          value: formatRupiah(totalRevenue),
          numericValue: totalRevenue,
          comparisonText: 'Data agregasi transaksi resmi backend',
        }
      }
      if (kpi.id === 'kpi-orders' || kpi.id === 'kpi-transactions') {
        return {
          ...kpi,
          value: String(totalTransactions),
          numericValue: totalTransactions,
          comparisonText: 'Transaksi terverifikasi (backend)',
        }
      }
      if (kpi.id === 'kpi-aov') {
        return {
          ...kpi,
          value: formatRupiah(averageOrderValue),
          numericValue: averageOrderValue,
          comparisonText: 'Rata-rata nilai transaksi aktual',
        }
      }
      if (kpi.id === 'kpi-units') {
        return {
          ...kpi,
          value: String(totalUnits),
          numericValue: totalUnits,
          comparisonText: 'Total lisensi e-book terjual',
        }
      }
      return kpi
    })

    const liveSeries: TimeSeriesPoint[] = report.series.map((pt) => ({
      date: pt.period,
      label: pt.period,
      revenue: pt.revenue,
      revenueFormatted: formatRupiah(pt.revenue),
      units: pt.transactionsCount,
      orders: pt.transactionsCount,
      sawInfluencedUnits: Math.max(0, Math.round(pt.transactionsCount * 0.6)),
    }))

    const liveTopBooks: TopPerformingEbook[] = report.topEbooks.map((book, idx) => ({
      id: book.ebookId,
      title: book.title,
      author: 'Penulis Terdaftar',
      category: book.categoryName,
      coverUrl: null,
      price: formatRupiah(
        book.unitsSold > 0 ? Math.round(book.revenue / book.unitsSold) : book.revenue,
      ),
      unitsSold: book.unitsSold,
      totalRevenue: formatRupiah(book.revenue),
      revenueNumeric: book.revenue,
      conversionRate: '-',
      rating: '-',
      sawScore: 0,
      sawRank: idx + 1,
      growthRate: 0,
    }))

    return {
      dataset: {
        ...fallback,
        kpis: liveKpis,
        timeSeries: liveSeries.length > 0 ? liveSeries : fallback.timeSeries,
        topBooks: liveTopBooks.length > 0 ? liveTopBooks : fallback.topBooks,
      },
      isSimulated: false,
    }
  } catch {
    return { dataset: fallback, isSimulated: true }
  }
}
