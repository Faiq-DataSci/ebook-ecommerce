import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  KPI_STATS_BY_PERIOD,
  RECENT_TRANSACTIONS,
  WEEKLY_SALES_SERIES,
} from '../data/dashboardData'
import type {
  BestsellingBookItem,
  DailySalesPoint,
  DashboardPeriod,
  KpiStatItem,
  TransactionRecord,
  TransactionStatus,
} from '../types/dashboard'
import {
  fetchDashboardSummary,
  subscribeToRealtimeSalesUpdates,
  type DashboardSummaryData,
} from '../services/dashboard.service'
import {
  fetchAdminSalesReport,
  fetchAdminTransactionsData,
} from '../../transactions/services/transactionAdmin.service'
import { formatRupiah } from '../../../shared/utils/formatters'
import { DashboardKpiCards } from './DashboardKpiCards'
import { DashboardRecentOrders } from './DashboardRecentOrders'
import { DashboardQuickShortcuts } from './DashboardQuickShortcuts'
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
const RANK_COLORS = ['#FFE135', '#74C0FC', '#51CF66', '#FF8787', '#B8A9FA']

function mapOrderStatusToTxStatus(
  status: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'CANCELLED',
): TransactionStatus {
  if (status === 'PAID') return 'LUNAS'
  if (status === 'PENDING') return 'MENUNGGU'
  return 'KEDALUWARSA'
}

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
  const [liveTransactions, setLiveTransactions] = useState<
    TransactionRecord[] | null
  >(null)
  const [liveTopBooks, setLiveTopBooks] = useState<
    BestsellingBookItem[] | undefined
  >(undefined)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)

  const loadAllDashboardData = useCallback(async () => {
    const [summary, txData, salesReport] = await Promise.all([
      fetchDashboardSummary(),
      fetchAdminTransactionsData().catch(() => null),
      fetchAdminSalesReport({ groupBy: 'day' }).catch(() => null),
    ])

    if (summary) {
      setLiveSummary(summary)
      setLastSyncTime(new Date())
    }

    if (txData && Array.isArray(txData.orders)) {
      const mappedTx: TransactionRecord[] = txData.orders.map((ord) => ({
        code: ord.orderNumber,
        bookTitle:
          ord.items.length > 1
            ? `${ord.items[0]?.title ?? 'E-Book'} (+${ord.items.length - 1} lainnya)`
            : ord.items[0]?.title ?? 'E-Book Digital',
        customerName: ord.customerName,
        customerEmail: ord.customerEmail,
        paymentMethod: ord.paymentMethod || 'QRIS',
        amount: ord.totalAmountFormatted,
        status: mapOrderStatusToTxStatus(ord.status),
      }))
      setLiveTransactions(mappedTx)
    }

    if (salesReport) {
      const maxUnits = Math.max(
        1,
        ...salesReport.topEbooks.map((item) => item.unitsSold),
      )
      const mappedBooks: BestsellingBookItem[] = salesReport.topEbooks
        .slice(0, 5)
        .map((book, idx) => ({
          rank: `#${idx + 1}`,
          rankBg: RANK_COLORS[idx % RANK_COLORS.length],
          soldText: `${book.unitsSold} terjual`,
          title: book.title,
          progressPercent: Math.max(
            12,
            Math.round((book.unitsSold / maxUnits) * 100),
          ),
          barBg: RANK_COLORS[idx % RANK_COLORS.length],
        }))
      setLiveTopBooks(mappedBooks)
    }

    return Boolean(summary)
  }, [])

  const handleSyncData = useCallback(
    async (isManual = false) => {
      if (isManual) {
        setIsSyncing(true)
      }
      try {
        const ok = await loadAllDashboardData()
        if (ok && isManual) {
          onActionNotice(
            'Dashboard berhasil disinkronkan dengan data database terkini!',
          )
        }
      } finally {
        if (isManual) {
          setIsSyncing(false)
        }
      }
    },
    [loadAllDashboardData, onActionNotice],
  )

  useEffect(() => {
    let isMounted = true

    const safeSync = () => {
      if (isMounted) {
        void loadAllDashboardData()
      }
    }

    // 1. Initial Fetch
    safeSync()

    // 2. Real-time Subscription via Supabase WebSocket (orders & transactions)
    const unsubscribe = subscribeToRealtimeSalesUpdates(safeSync)

    // 3. Heartbeat Auto-Polling interval setiap 30 detik
    const pollInterval = window.setInterval(safeSync, 30000)

    return () => {
      isMounted = false
      unsubscribe()
      window.clearInterval(pollInterval)
    }
  }, [loadAllDashboardData])

  const kpiCards: KpiStatItem[] = useMemo(() => {
    const baseCards = KPI_STATS_BY_PERIOD[selectedPeriod]
    if (!liveSummary) return baseCards

    const totalOrders = liveSummary.ordersCount.total
    const paidOrders = liveSummary.ordersCount.PAID
    const pendingOrders = liveSummary.ordersCount.PENDING
    const paidRatio =
      totalOrders > 0 ? Math.round((paidOrders / totalOrders) * 100) : 0

    return baseCards.map((card, index) => {
      if (index === 0) {
        return {
          ...card,
          value: formatRupiah(liveSummary.totalRevenue),
          deltaBadgeText: 'LIVE DB',
          deltaLabel: 'akumulasi transaksi terverifikasi',
          footerLeftText: `Lunas: ${paidOrders} order`,
          footerRightText: `Pending: ${pendingOrders}`,
        }
      }
      if (index === 1) {
        return {
          ...card,
          value: String(totalOrders),
          deltaBadgeText: `${paidRatio}% LUNAS`,
          deltaLabel: 'rasio pelunasan order',
          footerLeftText: `Berhasil: ${paidOrders}`,
          footerRightText: `Menunggu: ${pendingOrders}`,
        }
      }
      if (index === 2) {
        return {
          ...card,
          value: String(liveSummary.activeEbooksCount),
          deltaBadgeText: 'KATALOG',
          deltaLabel: 'e-book aktif di database',
          footerLeftText: 'Storage PDF Privat',
          footerRightText: 'Signed URL Aktif',
        }
      }
      return {
        ...card,
        value: String(liveSummary.activeCustomersCount),
        deltaBadgeText: 'XENDIT QRIS',
        deltaLabel: 'pelanggan aktif terdaftar',
        footerLeftText: 'Supabase Auth',
        footerRightText: 'RBAC Aktif',
      }
    })
  }, [liveSummary, selectedPeriod])

  const chartSeries: DailySalesPoint[] = useMemo(() => {
    if (liveSummary?.weeklySales && liveSummary.weeklySales.length === 7) {
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
    return 'Total: Rp 0'
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
        totalLabel: '0',
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
    return 'Rp 0 / hari'
  }, [chartSeries])

  const sourceTransactions = liveTransactions ?? RECENT_TRANSACTIONS
  const totalRecordCount = liveTransactions
    ? liveTransactions.length
    : RECENT_TRANSACTIONS.length

  const filteredTransactions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return sourceTransactions
    return sourceTransactions.filter(
      (item) =>
        item.code.toLowerCase().includes(q) ||
        item.bookTitle.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.customerEmail.toLowerCase().includes(q) ||
        item.paymentMethod.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q),
    )
  }, [searchQuery, sourceTransactions])

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
            totalRecordCount={totalRecordCount}
            safePage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* RIGHT COLUMN (4 COLS): Quick Shortcuts + Top Bestseller */}
        <div className="dashboard-col-right">
          <DashboardQuickShortcuts onNavigate={onNavigate} />
          <DashboardTopEbooks
            books={liveTopBooks}
            isLive={Boolean(liveSummary)}
          />
        </div>
      </section>
    </>
  )
}
