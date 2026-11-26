import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  KPI_STATS_BY_PERIOD,
  RECENT_TRANSACTIONS,
  WEEKLY_SALES_SERIES,
} from '../data/dashboardData'
import type {
  DailySalesPoint,
  DashboardPeriod,
} from '../types/dashboard'
import {
  fetchDashboardSummary,
  subscribeToRealtimeSalesUpdates,
  type DashboardSummaryData,
} from '../services/dashboard.service'
import { formatRupiah } from '../../../shared/utils/formatters'
import { DashboardActivityLog } from './DashboardActivityLog'
import { DashboardKpiCards } from './DashboardKpiCards'
import { DashboardRecentOrders } from './DashboardRecentOrders'
import { DashboardSalesChart } from './DashboardSalesChart'
import { DashboardTopEbooks } from './DashboardTopEbooks'
import { DashboardWelcomeBanner } from './DashboardWelcomeBanner'

interface DashboardContentProps {
  searchQuery: string
  onNavigate: (path: string) => void
  onActionNotice: (message: string) => void
}

const PERIOD_OPTIONS: DashboardPeriod[] = [
  'Hari Ini',
  '7 Hari',
  '30 Hari',
  'Kustom',
]

const PAGE_SIZE = 5
const TOTAL_RECORD_COUNT = 142

export function DashboardContent({
  searchQuery,
  onNavigate,
  onActionNotice,
}: DashboardContentProps) {
  const [selectedPeriod, setSelectedPeriod] =
    useState<DashboardPeriod>('7 Hari')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [liveSummary, setLiveSummary] =
    useState<DashboardSummaryData | null>(null)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)

  const handleSyncData = useCallback(async (isManual = false) => {
    if (isManual) {
      setIsSyncing(true)
    }
    try {
      const data = await fetchDashboardSummary()
      if (data) {
        setLiveSummary(data)
        setLastSyncTime(new Date())
        if (isManual) {
          onActionNotice('Diagram penjualan berhasil disinkronkan dengan data database terkini!')
        }
      }
    } finally {
      if (isManual) {
        setIsSyncing(false)
      }
    }
  }, [onActionNotice])

  useEffect(() => {
    let isMounted = true

    // 1. Initial Fetch
    fetchDashboardSummary().then((data) => {
      if (isMounted && data) {
        setLiveSummary(data)
        setLastSyncTime(new Date())
      }
    })

    // 2. Real-time Subscription via Supabase WebSocket (orders & transactions)
    const unsubscribe = subscribeToRealtimeSalesUpdates(() => {
      if (isMounted) {
        fetchDashboardSummary().then((data) => {
          if (isMounted && data) {
            setLiveSummary(data)
            setLastSyncTime(new Date())
          }
        })
      }
    })

    // 3. Heartbeat Auto-Polling interval setiap 15 detik
    const pollInterval = window.setInterval(() => {
      if (isMounted) {
        fetchDashboardSummary().then((data) => {
          if (isMounted && data) {
            setLiveSummary(data)
            setLastSyncTime(new Date())
          }
        })
      }
    }, 15000)

    return () => {
      isMounted = false
      unsubscribe()
      window.clearInterval(pollInterval)
    }
  }, [])

  const kpiCards = KPI_STATS_BY_PERIOD[selectedPeriod]

  const chartSeries: DailySalesPoint[] = useMemo(() => {
    if (
      liveSummary?.weeklySales &&
      liveSummary.weeklySales.length === 7 &&
      liveSummary.weeklySales.some((d) => d.totalAmount > 0)
    ) {
      return liveSummary.weeklySales.map((d) => ({
        day: d.day,
        date: d.date,
        totalLabel: d.totalLabel,
        totalNumeric: d.totalAmount,
        heightPercent: d.heightPercent,
        regulerPercent: d.regulerPercent,
        bundlingPercent: d.bundlingPercent,
        regulerTooltip: d.regulerTooltip,
        bundlingTooltip: d.bundlingTooltip,
        isPeak: d.isPeak,
        peakBadge: d.peakBadge,
      }))
    }
    return WEEKLY_SALES_SERIES
  }, [liveSummary])

  const weeklyTotalFormatted = useMemo(() => {
    const sum = chartSeries.reduce(
      (acc, curr) => acc + (curr.totalNumeric || 0),
      0,
    )
    if (sum > 0) {
      if (sum >= 1_000_000) {
        return `Total: Rp ${(sum / 1_000_000).toFixed(2)}M`
      }
      return `Total: ${formatRupiah(sum)}`
    }
    return 'Total: Rp 42.85M'
  }, [chartSeries])

  const yAxisLabels = useMemo(() => {
    if (liveSummary?.yAxisTicks && liveSummary.yAxisTicks.length === 5) {
      return liveSummary.yAxisTicks
    }
    return ['10.0M', '7.5M', '5.0M', '2.5M', '0']
  }, [liveSummary])

  const peakPoint = useMemo(() => {
    return (
      chartSeries.find((p) => p.isPeak) ||
      chartSeries[5] ||
      chartSeries[0] || {
        day: 'SAB',
        totalLabel: '8.6M',
      }
    )
  }, [chartSeries])

  const averageDailyFormatted = useMemo(() => {
    const sum = chartSeries.reduce(
      (acc, curr) => acc + (curr.totalNumeric || 0),
      0,
    )
    if (sum > 0) {
      const avg = Math.round(sum / chartSeries.length)
      if (avg >= 1_000_000) {
        return `Rp ${(avg / 1_000_000).toFixed(2)}M / hari`
      }
      return `${formatRupiah(avg)} / hari`
    }
    return 'Rp 6.12M / hari'
  }, [chartSeries])

  const filteredTransactions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return RECENT_TRANSACTIONS
    return RECENT_TRANSACTIONS.filter(
      (item) =>
        item.code.toLowerCase().includes(q) ||
        item.bookTitle.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.customerEmail.toLowerCase().includes(q) ||
        item.paymentMethod.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q),
    )
  }, [searchQuery])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / PAGE_SIZE),
  )
  const safePage = Math.min(currentPage, totalPages)

  const visibleTransactions = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return filteredTransactions.slice(start, start + PAGE_SIZE)
  }, [filteredTransactions, safePage])

  const handleDownloadCsv = () => {
    const headers = [
      'Kode Transaksi',
      'Judul E-Book',
      'Pelanggan',
      'Email',
      'Metode Pembayaran',
      'Nominal',
      'Status',
    ]
    const rows = filteredTransactions.map((row) => [
      row.code,
      `"${row.bookTitle.replace(/"/g, '""')}"`,
      `"${row.customerName}"`,
      row.customerEmail,
      `"${row.paymentMethod}"`,
      `"${row.amount}"`,
      row.status,
    ])
    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `laporan-transaksi-ebook-${selectedPeriod
      .toLowerCase()
      .replace(/\s+/g, '-')}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    onActionNotice(
      `File CSV transaksi (${filteredTransactions.length} baris) berhasil diunduh.`,
    )
  }

  return (
    <>
      {/* 1. WELCOME BANNER & ACTION HEADER */}
      <DashboardWelcomeBanner
        selectedPeriod={selectedPeriod}
        periodOptions={PERIOD_OPTIONS}
        onSelectPeriod={setSelectedPeriod}
        onAddEbook={() => onNavigate('/admin/katalog/ebook')}
        onDownloadCsv={handleDownloadCsv}
      />

      {/* 2. 4 KPI STAT CARDS */}
      <DashboardKpiCards cards={kpiCards} />

      {/* 3. 2-COLUMN MAIN GRID */}
      <section className="dashboard-main-grid">
        {/* LEFT COLUMN (8 COLS): Monitoring Penjualan + Transaksi Table */}
        <div className="dashboard-col-left">
          <DashboardSalesChart
            chartSeries={chartSeries}
            weeklyTotalFormatted={weeklyTotalFormatted}
            yAxisLabels={yAxisLabels}
            peakPoint={peakPoint}
            averageDailyFormatted={averageDailyFormatted}
            isSyncing={isSyncing}
            lastSyncTime={lastSyncTime}
            onSyncData={handleSyncData}
          />

          <DashboardRecentOrders
            visibleTransactions={visibleTransactions}
            searchQuery={searchQuery}
            filteredTransactionsCount={filteredTransactions.length}
            totalRecordCount={TOTAL_RECORD_COUNT}
            safePage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* RIGHT COLUMN (4 COLS): Top Bestseller + Quick Action + Activity Feed */}
        <div className="dashboard-col-right">
          <DashboardTopEbooks onNavigate={onNavigate} />
          <DashboardActivityLog />
        </div>
      </section>
    </>
  )
}
