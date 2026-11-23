export type AnalyticsPeriod = '7D' | '30D' | '90D' | 'YTD' | 'CUSTOM'
export type MetricType = 'REVENUE' | 'UNITS' | 'ORDERS'
export type AggregationGrouping = 'DAY' | 'WEEK' | 'MONTH'

export interface AnalyticsKpi {
  id: string
  title: string
  value: string
  numericValue: number
  unit?: string
  comparisonText: string
  growthPercentage: number
  isPositive: boolean
  accentColor: string
  icon: string
  helpTooltip: string
}

export interface TimeSeriesPoint {
  date: string // e.g. "2026-11-17"
  label: string // e.g. "17 Nov"
  revenue: number // Nilai dalam Rupiah
  revenueFormatted: string // "Rp 2.450.000"
  units: number // Jumlah buku terjual
  orders: number // Jumlah pesanan lunas
  sawInfluencedUnits: number // Unit yang terjual via rekomendasi SAW
}

export interface CategoryBreakdownItem {
  id: string
  name: string
  slug: string
  color: string
  revenue: number
  revenueFormatted: string
  percentage: number // Kontribusi % terhadap total omzet
  unitsSold: number
  activeBookCount: number
  topBookTitle: string
}

export interface FunnelStage {
  id: string
  label: string
  count: number
  formattedCount: string
  percentageOfTotal: number
  dropOffRate?: number
  icon: string
  color: string
  description: string
}

export interface PaymentMethodShare {
  id: string
  name: string
  category: 'QRIS' | 'VIRTUAL_ACCOUNT' | 'CREDIT_CARD'
  sharePercentage: number
  transactionCount: number
  volumeFormatted: string
  successRate: number
  color: string
}

export interface TopPerformingEbook {
  id: string
  title: string
  author: string
  category: string
  coverUrl: string | null
  price: string
  unitsSold: number
  totalRevenue: string
  revenueNumeric: number
  conversionRate: string
  rating: string
  sawScore: number
  sawRank: number
  growthRate: number
}

export interface AnalyticsDataset {
  period: AnalyticsPeriod
  periodLabel: string
  kpis: AnalyticsKpi[]
  timeSeries: TimeSeriesPoint[]
  categoryBreakdown: CategoryBreakdownItem[]
  funnelStages: FunnelStage[]
  paymentShares: PaymentMethodShare[]
  topBooks: TopPerformingEbook[]
  sawCorrelation: {
    topSawAvgConversion: string
    regularAvgConversion: string
    upliftPercentage: string
    avgSawScore: number
  }
}
