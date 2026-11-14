import { useMemo, useState } from 'react'
import {
  KPI_STATS_BY_PERIOD,
  QUICK_ACTIONS,
  RECENT_TRANSACTIONS,
  TOP_BESTSELLING_EBOOKS,
  WEEKLY_SALES_SERIES,
} from '../../data/dashboardData'
import type { DashboardPeriod, TransactionStatus } from '../../types/admin'

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

function getStatusBadgeClass(status: TransactionStatus): string {
  switch (status) {
    case 'LUNAS':
      return 'status-badge lunas'
    case 'MENUNGGU':
      return 'status-badge menunggu'
    case 'KEDALUWARSA':
      return 'status-badge kedaluwarsa'
  }
}

export function DashboardContent({
  searchQuery,
  onNavigate,
  onActionNotice,
}: DashboardContentProps) {
  const [selectedPeriod, setSelectedPeriod] =
    useState<DashboardPeriod>('7 Hari')
  const [currentPage, setCurrentPage] = useState<number>(1)

  const kpiCards = KPI_STATS_BY_PERIOD[selectedPeriod]

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
      <section className="welcome-banner" aria-label="Ikhtisar Utama Dashboard">
        <div className="welcome-top-stripe" aria-hidden="true">
          <div style={{ backgroundColor: '#FFD23F' }} />
          <div style={{ backgroundColor: '#74B9FF' }} />
          <div style={{ backgroundColor: '#88D498' }} />
        </div>

        <div className="welcome-left">
          <div className="welcome-badges-row">
            <span className="badge-ikhtisar">IKHTISAR UTAMA</span>
            <span className="badge-sistem-live">
              <span className="live-solid-dot" aria-hidden="true" />
              <span>SISTEM LIVE // MINGGU 18 • MEI 2025</span>
            </span>
          </div>

          <div>
            <h1 className="welcome-title">Selamat datang kembali, Faiq!</h1>
            <p className="welcome-subtitle">
              Pantau performa penjualan katalog e-book, kelola verifikasi
              transaksi otomatis, dan pantau proteksi DRM terkini.
            </p>
          </div>

          <div className="welcome-pills-row">
            <div className="welcome-pill-white">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16 }}
                aria-hidden="true"
              >
                local_fire_department
              </span>
              <span>14 Pesanan Baru Hari Ini</span>
            </div>
            <div className="welcome-pill-green">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16 }}
                aria-hidden="true"
              >
                verified_user
              </span>
              <span>DRM Engine: 100% Aktif</span>
            </div>
          </div>
        </div>

        <div className="welcome-right">
          <div
            className="period-switcher"
            role="group"
            aria-label="Filter Periode"
          >
            {PERIOD_OPTIONS.map((period) => {
              const active = selectedPeriod === period
              return (
                <button
                  key={period}
                  type="button"
                  className={`period-btn ${active ? 'is-active' : ''}`}
                  aria-pressed={active}
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period}
                </button>
              )
            })}
          </div>

          <div className="welcome-actions">
            <button
              type="button"
              className="btn-primary-add nb-btn"
              onClick={() => onNavigate('/admin/katalog/ebook')}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 18, fontWeight: 700 }}
                aria-hidden="true"
              >
                add_circle
              </span>
              <span>+ Tambah E-Book</span>
            </button>
            <button
              type="button"
              className="btn-secondary-csv nb-btn"
              onClick={handleDownloadCsv}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 18 }}
                aria-hidden="true"
              >
                download
              </span>
              <span>Unduh CSV</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. 4 KPI STAT CARDS */}
      <section className="kpi-grid" aria-label="Ringkasan Statistik Utama">
        {kpiCards.map((card) => (
          <div
            key={card.id}
            className="kpi-card nb-btn"
            role="region"
            aria-label={card.title}
          >
            <div
              className="kpi-card-header"
              style={{ backgroundColor: card.headerBg }}
            >
              <span className="kpi-card-title">{card.title}</span>
              <div className="kpi-icon-box" aria-hidden="true">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 15, fontWeight: 700 }}
                >
                  {card.icon}
                </span>
              </div>
            </div>

            <div className="kpi-card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span className="kpi-value">{card.value}</span>
                <div className="kpi-delta-row">
                  <span
                    className="kpi-delta-badge"
                    style={{
                      backgroundColor: card.deltaBadgeBg,
                      color: card.deltaBadgeColor,
                    }}
                  >
                    {card.deltaBadgeText}
                  </span>
                  <span className="kpi-delta-label">{card.deltaLabel}</span>
                </div>
              </div>

              <div className="kpi-progress-section">
                <div className="kpi-progress-labels">
                  <span>{card.footerLeftText}</span>
                  <span className="kpi-progress-strong">
                    {card.footerRightText}
                  </span>
                </div>
                <div className="kpi-progress-track">
                  {card.segments.map((seg, idx) => (
                    <div
                      key={idx}
                      className="kpi-progress-fill"
                      style={{
                        width: `${seg.widthPercent}%`,
                        backgroundColor: seg.bgColor,
                        borderRight:
                          idx === card.segments.length - 1 &&
                          seg.widthPercent === 100
                            ? 'none'
                            : '1px solid #000000',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 3. 2-COLUMN MAIN GRID */}
      <section className="dashboard-main-grid">
        {/* LEFT COLUMN (8 COLS): Monitoring Penjualan + Transaksi Table */}
        <div className="dashboard-col-left">
          {/* Monitoring Penjualan Mingguan (Grafik Batang) */}
          <div className="chart-card">
            <div className="chart-card-header">
              <div className="chart-title-group">
                <div className="chart-title-row">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 24 }}
                    aria-hidden="true"
                  >
                    monitoring
                  </span>
                  <h2 className="chart-heading">
                    MONITORING PENJUALAN MINGGUAN
                  </h2>
                  <span className="badge-live-stats">LIVE STATS</span>
                </div>
                <p className="chart-subtitle">
                  Omzet &amp; Volume Transaksi (Senin - Minggu) • Siklus Mei
                  2025
                </p>
              </div>

              <div className="chart-legend-row">
                <div className="chart-legend-pill">
                  <span
                    className="legend-swatch"
                    style={{ backgroundColor: '#FFD23F' }}
                  />
                  <span>E-Book Reguler</span>
                </div>
                <div className="chart-legend-pill">
                  <span
                    className="legend-swatch"
                    style={{ backgroundColor: '#74B9FF' }}
                  />
                  <span>Bundling E-Book</span>
                </div>
                <div className="chart-total-pill">Total: Rp 42.85M</div>
              </div>
            </div>

            {/* Stacked Bar Chart with Neubrutalist Y-Axis Gridlines */}
            <div className="chart-plot-box">
              <div className="chart-plot-inner">
                <div className="chart-y-grid" aria-hidden="true">
                  {['10.0M', '7.5M', '5.0M', '2.5M', '0'].map((label) => {
                    const isZero = label === '0'
                    return (
                      <div key={label} className="chart-y-row">
                        <span
                          className={`chart-y-label ${isZero ? 'is-zero' : ''}`}
                        >
                          {label}
                        </span>
                        <div
                          className={`chart-y-line ${isZero ? 'is-zero' : ''}`}
                        />
                      </div>
                    )
                  })}
                </div>

                <div className="chart-bars-row">
                  {WEEKLY_SALES_SERIES.map((point) => (
                    <div key={point.day} className="chart-bar-col">
                      {point.isPeak ? (
                        <div className="chart-peak-group">
                          <span className="chart-peak-badge">
                            {point.peakBadge}
                          </span>
                          <span className="chart-peak-value">
                            {point.totalLabel}
                          </span>
                        </div>
                      ) : (
                        <span className="chart-bar-value-tag">
                          {point.totalLabel}
                        </span>
                      )}

                      <div
                        className="chart-bar-stack"
                        style={{ height: `${point.heightPercent}%` }}
                      >
                        <div
                          className="chart-segment-reguler"
                          style={{ height: `${point.regulerPercent}%` }}
                          title={point.regulerTooltip}
                        />
                        <div
                          className="chart-segment-bundling"
                          style={{ height: `${point.bundlingPercent}%` }}
                          title={point.bundlingTooltip}
                        />
                      </div>

                      <span
                        className={`chart-day-label ${
                          point.isPeak ? 'is-peak' : ''
                        }`}
                      >
                        {point.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Insight Bar */}
            <div className="chart-insights-grid">
              <div className="chart-insight-box">
                <div className="insight-left">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16 }}
                    aria-hidden="true"
                  >
                    event_available
                  </span>
                  <span style={{ fontWeight: 700 }}>Puncak Transaksi:</span>
                </div>
                <span className="insight-badge-green">
                  Sabtu, 17 Mei (Rp 8.62M)
                </span>
              </div>

              <div className="chart-insight-box">
                <div className="insight-left">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16 }}
                    aria-hidden="true"
                  >
                    query_stats
                  </span>
                  <span style={{ fontWeight: 700, color: '#404040' }}>
                    Rasio Konversi:
                  </span>
                  <strong className="insight-badge-yellow">68.4%</strong>
                </div>
                <div className="insight-left">
                  <span style={{ fontWeight: 700, color: '#404040' }}>
                    Rata-rata:
                  </span>
                  <strong style={{ fontWeight: 900 }}>Rp 6.12M / hari</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Tabel Live Stream Transaksi & Pesanan Terbaru */}
          <div className="transactions-card">
            <div className="transactions-header">
              <div className="transactions-title-group">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 24 }}
                  aria-hidden="true"
                >
                  receipt
                </span>
                <h2 className="transactions-heading">
                  Live Stream Transaksi Terbaru
                </h2>
              </div>

              <div className="transactions-sync-status">
                <span className="status-square-dot" aria-hidden="true" />
                <span>Realtime Auto-Sync</span>
              </div>
            </div>

            <div className="table-scroll-wrap">
              <table className="nb-table">
                <thead>
                  <tr>
                    <th scope="col">Kode Transaksi</th>
                    <th scope="col">Judul E-Book</th>
                    <th scope="col">Pelanggan</th>
                    <th scope="col">Metode</th>
                    <th scope="col" style={{ textAlign: 'right' }}>
                      Nominal
                    </th>
                    <th scope="col" style={{ textAlign: 'center' }}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleTransactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          textAlign: 'center',
                          padding: '24px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                        }}
                      >
                        Tidak ada transaksi yang cocok dengan pencarian &ldquo;
                        {searchQuery}&rdquo;.
                      </td>
                    </tr>
                  ) : (
                    visibleTransactions.map((trx) => (
                      <tr key={trx.code}>
                        <td className="td-code">{trx.code}</td>
                        <td className="td-book-title">{trx.bookTitle}</td>
                        <td>
                          <div className="td-customer">
                            <span className="td-customer-name">
                              {trx.customerName}
                            </span>
                            <span className="td-customer-email">
                              {trx.customerEmail}
                            </span>
                          </div>
                        </td>
                        <td className="td-method">{trx.paymentMethod}</td>
                        <td className="td-amount">{trx.amount}</td>
                        <td className="td-status">
                          <span className={getStatusBadgeClass(trx.status)}>
                            {trx.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="transactions-footer">
              <span>
                Menampilkan {visibleTransactions.length} dari{' '}
                {searchQuery.trim()
                  ? filteredTransactions.length
                  : TOTAL_RECORD_COUNT}{' '}
                pesanan
              </span>

              <div
                className="pagination-group"
                role="navigation"
                aria-label="Paginasi Transaksi"
              >
                <button
                  type="button"
                  className="page-btn nb-btn"
                  disabled={safePage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  &lt; PREV
                </button>
                {[1, 2, 3].map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    className={`page-btn nb-btn ${
                      safePage === pageNum ? 'is-active' : ''
                    }`}
                    aria-current={safePage === pageNum ? 'page' : undefined}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  type="button"
                  className="page-btn nb-btn"
                  disabled={safePage >= totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  NEXT &gt;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 COLS): Top Bestseller + Quick Action */}
        <div className="dashboard-col-right">
          {/* Top Bestselling E-Book */}
          <div className="bestseller-card">
            <div className="widget-header">
              <div className="widget-title-row">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 20 }}
                  aria-hidden="true"
                >
                  trophy
                </span>
                <h2 className="widget-heading">Top Bestselling E-Book</h2>
              </div>
              <span className="widget-tag">MEI 2025</span>
            </div>

            <div className="bestseller-list">
              {TOP_BESTSELLING_EBOOKS.map((book) => (
                <div key={book.rank} className="bestseller-item">
                  <div className="bestseller-top-row">
                    <span
                      className="bestseller-rank"
                      style={{ backgroundColor: book.rankBg }}
                    >
                      {book.rank}
                    </span>
                    <span className="bestseller-sold">{book.soldText}</span>
                  </div>
                  <h3 className="bestseller-title">{book.title}</h3>
                  <div className="bestseller-bar-track">
                    <div
                      className="bestseller-bar-fill"
                      style={{
                        width: `${book.progressPercent}%`,
                        backgroundColor: book.barBg,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pintasan Cepat (Aksi Admin) */}
          <div className="quick-actions-card">
            <div className="widget-header">
              <h2 className="widget-heading widget-title-row">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 18 }}
                  aria-hidden="true"
                >
                  bolt
                </span>
                <span>Pintasan Cepat</span>
              </h2>
              <span className="widget-tag">AKSI ADMIN</span>
            </div>

            <div className="quick-actions-grid">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  className="quick-action-btn nb-btn"
                  style={{ backgroundColor: action.bgColor }}
                  onClick={() => onNavigate(action.targetPath)}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 20 }}
                    aria-hidden="true"
                  >
                    {action.icon}
                  </span>
                  <span className="quick-action-label">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
