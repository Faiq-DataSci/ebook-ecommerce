import { useMemo, useState } from 'react'
import {
  EmptyState,
  Pagination,
  SearchInput,
  SimulationBadge,
  TableSkeleton,
  Toast,
  type ToastMessage,
} from '../../../shared/components/ui'
import {
  generateAnalyticsCsv,
  getAnalyticsDataset,
} from '../data/analyticsData'
import type {
  AnalyticsPeriod,
  MetricType,
  TimeSeriesPoint,
  TopPerformingEbook,
} from '../types/analytics'

interface AnalyticsPageProps {
  onNavigate?: (path: string) => void
}

export function AnalyticsPage({ onNavigate }: AnalyticsPageProps) {
  // 1. Filter Periode
  const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod>('30D')
  const [customStart, setCustomStart] = useState<string>('2026-11-01')
  const [customEnd, setCustomEnd] = useState<string>('2026-11-23')

  // 2. Metrik Grafik
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('REVENUE')
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null)

  // 3. Tab & Pencarian Tabel E-Book
  const [topBooksTab, setTopBooksTab] = useState<'ALL' | 'GROWTH' | 'REVENUE' | 'SAW'>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const pageSize = 5

  // 4. Loading & Toasts
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (type: 'success' | 'error' | 'info' | 'warning', text: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, type, text }])
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Dapatkan dataset sesuai periode
  const dataset = useMemo(() => {
    return getAnalyticsDataset(selectedPeriod, customStart, customEnd)
  }, [selectedPeriod, customStart, customEnd])

  // Aksi Segarkan Data
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      addToast('info', 'Data analitik bisnis dan agregasi penjualan berhasil disegarkan.')
    }, 450)
  }

  // Aksi Ekspor CSV
  const handleExportCsv = () => {
    try {
      const csvContent = generateAnalyticsCsv(dataset)
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const timestamp = new Date().toISOString().split('T')[0]
      link.setAttribute('href', url)
      link.setAttribute('download', `laporan-analitik-bisnis-${selectedPeriod}-${timestamp}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      addToast('success', `Laporan analitik bisnis (${dataset.periodLabel}) berhasil diunduh dalam format CSV.`)
    } catch {
      addToast('error', 'Gagal membuat berkas ekspor laporan CSV.')
    }
  }

  // Kalkulasi Skala Grafik
  const maxMetricValue = useMemo(() => {
    if (!dataset.timeSeries.length) return 1
    const values = dataset.timeSeries.map((p) => {
      if (selectedMetric === 'REVENUE') return p.revenue
      if (selectedMetric === 'UNITS') return p.units
      return p.orders
    })
    return Math.max(...values, 1)
  }, [dataset.timeSeries, selectedMetric])

  // Mini Rangkuman Grafik
  const chartHighlights = useMemo(() => {
    if (!dataset.timeSeries.length) {
      return { peak: null, lowest: null, avg: 0 }
    }
    let peak = dataset.timeSeries[0]
    let lowest = dataset.timeSeries[0]
    let sum = 0

    dataset.timeSeries.forEach((pt) => {
      const val =
        selectedMetric === 'REVENUE'
          ? pt.revenue
          : selectedMetric === 'UNITS'
            ? pt.units
            : pt.orders

      const peakVal =
        selectedMetric === 'REVENUE'
          ? peak.revenue
          : selectedMetric === 'UNITS'
            ? peak.units
            : peak.orders

      const lowVal =
        selectedMetric === 'REVENUE'
          ? lowest.revenue
          : selectedMetric === 'UNITS'
            ? lowest.units
            : lowest.orders

      if (val > peakVal) peak = pt
      if (val < lowVal) lowest = pt
      sum += val
    })

    const avg = Math.round(sum / dataset.timeSeries.length)
    return { peak, lowest, avg }
  }, [dataset.timeSeries, selectedMetric])

  // Filter Tabel Top Books
  const filteredBooks = useMemo(() => {
    let list: TopPerformingEbook[] = [...dataset.topBooks]

    // Tab filter
    if (topBooksTab === 'GROWTH') {
      list.sort((a, b) => b.growthRate - a.growthRate)
    } else if (topBooksTab === 'REVENUE') {
      list.sort((a, b) => b.revenueNumeric - a.revenueNumeric)
    } else if (topBooksTab === 'SAW') {
      list.sort((a, b) => b.sawScore - a.sawScore)
    }

    // Search query
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q),
      )
    }

    return list
  }, [dataset.topBooks, topBooksTab, searchQuery])

  // Paginasi Tabel
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / pageSize))
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredBooks.slice(start, start + pageSize)
  }, [filteredBooks, currentPage, pageSize])

  const getMetricColor = () => {
    switch (selectedMetric) {
      case 'REVENUE':
        return 'var(--nb-yellow)'
      case 'UNITS':
        return 'var(--nb-blue)'
      case 'ORDERS':
        return 'var(--nb-green)'
    }
  }

  const formatMetricValue = (point: TimeSeriesPoint) => {
    switch (selectedMetric) {
      case 'REVENUE':
        return point.revenueFormatted
      case 'UNITS':
        return `${point.units} eksemplar`
      case 'ORDERS':
        return `${point.orders} transaksi`
    }
  }

  return (
    <div className="analytics-container">
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* --------------------------------------------------------------------
          1. Header & Action Bar
          -------------------------------------------------------------------- */}
      <div className="analytics-header-card">
        <div className="analytics-title-group">
          <div className="analytics-title-row">
            <h1 className="analytics-title">Analitik Bisnis & Penjualan</h1>
            <SimulationBadge />
          </div>
          <p className="analytics-subtitle">
            Pusat inteligensi transaksi, agregasi omzet penjualan, metrik konversi, dan performa rekomendasi SPK SAW.
          </p>
        </div>

        <div className="analytics-actions-group">
          <button
            type="button"
            className="nb-btn nb-page-btn"
            onClick={handleRefresh}
            title="Segarkan data analitik dari backend"
            disabled={isLoading}
          >
            <span
              className={`material-symbols-outlined ${isLoading ? 'nb-spin' : ''}`}
              aria-hidden="true"
            >
              refresh
            </span>
            <span>Segarkan</span>
          </button>

          <button
            type="button"
            className="nb-btn catalog-primary-btn"
            onClick={handleExportCsv}
            title="Unduh laporan lengkap dalam format CSV"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              download
            </span>
            <span>Ekspor Laporan (CSV)</span>
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------------
          2. Filter Periode Bar
          -------------------------------------------------------------------- */}
      <div className="analytics-period-bar">
        <div className="analytics-period-pills" role="tablist" aria-label="Pilih Rentang Waktu">
          {(
            [
              { key: '7D', label: '7 Hari Terakhir' },
              { key: '30D', label: '30 Hari Terakhir' },
              { key: '90D', label: 'Triwulan Ini (90 Hari)' },
              { key: 'YTD', label: 'Tahun Berjalan (YTD)' },
              { key: 'CUSTOM', label: 'Rentang Kustom' },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={selectedPeriod === item.key}
              className={`analytics-period-btn ${selectedPeriod === item.key ? 'is-active' : ''}`}
              onClick={() => {
                setSelectedPeriod(item.key)
                setCurrentPage(1)
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden="true">
                calendar_today
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="analytics-period-label">
          <span>Periode: <strong>{dataset.periodLabel}</strong></span>
        </div>
      </div>

      {/* Kotak Input Rentang Tanggal Kustom bila dipilih */}
      {selectedPeriod === 'CUSTOM' && (
        <div className="analytics-custom-date-box" role="region" aria-label="Pilihan Rentang Tanggal Kustom">
          <span style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', fontSize: 13 }}>
            Tentukan Rentang Tanggal:
          </span>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <span>Mulai:</span>
            <input
              type="date"
              className="analytics-date-input"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
            />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <span>Sampai:</span>
            <input
              type="date"
              className="analytics-date-input"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
            />
          </label>
          <button
            type="button"
            className="nb-btn nb-page-btn"
            style={{ padding: '4px 10px', fontSize: 12 }}
            onClick={() => {
              addToast('info', `Rentang tanggal diperbarui: ${customStart} s/d ${customEnd}`)
            }}
          >
            Terapkan Filter
          </button>
        </div>
      )}

      {/* --------------------------------------------------------------------
          3. Executive KPI Grid (Zona 2)
          -------------------------------------------------------------------- */}
      <div className="analytics-kpi-grid">
        {dataset.kpis.map((kpi) => (
          <div key={kpi.id} className="analytics-kpi-card">
            <div className="analytics-kpi-top">
              <span className="analytics-kpi-title">{kpi.title}</span>
              <div
                className="analytics-kpi-icon-box"
                style={{ backgroundColor: kpi.accentColor }}
                title={kpi.helpTooltip}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  {kpi.icon}
                </span>
              </div>
            </div>

            <div className="analytics-kpi-val-row">
              <span className="analytics-kpi-value">{kpi.value}</span>
              {kpi.unit && <span className="analytics-kpi-unit">{kpi.unit}</span>}
            </div>

            <div className="analytics-kpi-footer">
              <span
                className={`analytics-kpi-pill ${
                  kpi.id === 'kpi-saw-impact'
                    ? 'is-saw'
                    : kpi.isPositive
                      ? 'is-positive'
                      : 'is-negative'
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 13 }}
                  aria-hidden="true"
                >
                  {kpi.isPositive ? 'trending_up' : 'trending_down'}
                </span>
                <span>+{kpi.growthPercentage}%</span>
              </span>
              <span style={{ color: 'var(--nb-text-muted)' }}>{kpi.comparisonText}</span>
            </div>
          </div>
        ))}
      </div>

      {/* --------------------------------------------------------------------
          4. Grafik Tren Interaktif (Multi-Metric Timeline Chart)
          -------------------------------------------------------------------- */}
      <div className="analytics-chart-card">
        <div className="analytics-chart-header">
          <div className="analytics-chart-title-box">
            <h2 className="analytics-chart-title">Histogram Tren Kinerja Penjualan</h2>
            <p className="analytics-chart-subtitle">
              Distribusi volume transaksi harian dengan penanda porsi kontribusi rekomendasi SPK SAW (aksen lavender).
            </p>
          </div>

          <div className="analytics-chart-controls">
            <div className="analytics-metric-toggles" role="group" aria-label="Pilih Metrik Grafik">
              <button
                type="button"
                className={`analytics-metric-toggle-btn ${selectedMetric === 'REVENUE' ? 'is-active' : ''}`}
                onClick={() => setSelectedMetric('REVENUE')}
              >
                Pendapatan (Rp)
              </button>
              <button
                type="button"
                className={`analytics-metric-toggle-btn ${selectedMetric === 'UNITS' ? 'is-active' : ''}`}
                onClick={() => setSelectedMetric('UNITS')}
              >
                Unit Terjual
              </button>
              <button
                type="button"
                className={`analytics-metric-toggle-btn ${selectedMetric === 'ORDERS' ? 'is-active' : ''}`}
                onClick={() => setSelectedMetric('ORDERS')}
              >
                Pesanan Lunas
              </button>
            </div>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="analytics-chart-canvas-wrap">
          <div className="analytics-bars-row">
            {dataset.timeSeries.map((point, idx) => {
              const currentVal =
                selectedMetric === 'REVENUE'
                  ? point.revenue
                  : selectedMetric === 'UNITS'
                    ? point.units
                    : point.orders

              const heightPercent = Math.max(8, Math.round((currentVal / maxMetricValue) * 100))
              const sawPercent =
                point.units > 0
                  ? Math.min(100, Math.round((point.sawInfluencedUnits / point.units) * 100))
                  : 0

              const isHovered = hoveredPointIndex === idx

              return (
                <div
                  key={point.date}
                  className="analytics-bar-col"
                  onMouseEnter={() => setHoveredPointIndex(idx)}
                  onMouseLeave={() => setHoveredPointIndex(null)}
                  tabIndex={0}
                  role="graphics-symbol"
                  aria-label={`${point.label}: ${formatMetricValue(point)}`}
                  onFocus={() => setHoveredPointIndex(idx)}
                  onBlur={() => setHoveredPointIndex(null)}
                >
                  {/* Tooltip Hover Popover */}
                  {isHovered && (
                    <div className="analytics-bar-tooltip">
                      <strong style={{ fontFamily: 'var(--font-heading)' }}>
                        {point.date} ({point.label})
                      </strong>
                      <div style={{ color: 'var(--nb-black)', fontWeight: 700 }}>
                        {selectedMetric === 'REVENUE' && `Omzet: ${point.revenueFormatted}`}
                        {selectedMetric === 'UNITS' && `Volume: ${point.units} eksemplar`}
                        {selectedMetric === 'ORDERS' && `Pesanan: ${point.orders} transaksi`}
                      </div>
                      <div style={{ color: '#4B5563', fontSize: 10 }}>
                        Terjual: {point.units} buku ({point.sawInfluencedUnits} via SAW)
                      </div>
                    </div>
                  )}

                  {/* Batang Histogram */}
                  <div
                    className="analytics-bar-pillar"
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: getMetricColor(),
                    }}
                  >
                    {/* Aksen Porsi SAW di puncak batang */}
                    {sawPercent > 0 && (
                      <div
                        className="analytics-bar-saw-stripe"
                        style={{ height: `${Math.min(heightPercent, 8)}px` }}
                        title={`Porsi konversi rekomendasi SAW: ${sawPercent}%`}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Sumbu X Label */}
          <div className="analytics-x-axis-row">
            {dataset.timeSeries.map((point) => (
              <span key={`lbl-${point.date}`} className="analytics-x-axis-label">
                {point.label}
              </span>
            ))}
          </div>
        </div>

        {/* Ringkasan Strip di Bawah Grafik */}
        <div className="analytics-chart-summary-strip">
          <div className="analytics-summary-chip">
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#16A34A' }}>
              arrow_circle_up
            </span>
            <span>
              Penjualan Tertinggi:{' '}
              <strong>
                {chartHighlights.peak?.label} (
                {selectedMetric === 'REVENUE'
                  ? chartHighlights.peak?.revenueFormatted
                  : selectedMetric === 'UNITS'
                    ? `${chartHighlights.peak?.units} buku`
                    : `${chartHighlights.peak?.orders} pesanan`}
                )
              </strong>
            </span>
          </div>

          <div className="analytics-summary-chip">
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#DC2626' }}>
              arrow_circle_down
            </span>
            <span>
              Penjualan Terendah:{' '}
              <strong>
                {chartHighlights.lowest?.label} (
                {selectedMetric === 'REVENUE'
                  ? chartHighlights.lowest?.revenueFormatted
                  : selectedMetric === 'UNITS'
                    ? `${chartHighlights.lowest?.units} buku`
                    : `${chartHighlights.lowest?.orders} pesanan`}
                )
              </strong>
            </span>
          </div>

          <div className="analytics-summary-chip">
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#2563EB' }}>
              functions
            </span>
            <span>
              Rata-rata Harian:{' '}
              <strong>
                {selectedMetric === 'REVENUE'
                  ? new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      maximumFractionDigits: 0,
                    }).format(chartHighlights.avg)
                  : `${chartHighlights.avg} ${selectedMetric === 'UNITS' ? 'buku' : 'pesanan'}`}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------
          5. Grid 2 Kolom: Corong Konversi & Kontribusi Kategori
          -------------------------------------------------------------------- */}
      <div className="analytics-two-col-grid">
        {/* Kolom 1: Corong Konversi Pembayaran (Purchase Funnel) */}
        <div className="analytics-panel-card">
          <div className="analytics-panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined" aria-hidden="true">
                filter_alt
              </span>
              <h2 className="analytics-panel-title">Corong Konversi Pembayaran</h2>
            </div>
            <span className="analytics-drop-pill" style={{ backgroundColor: '#DCFCE7', color: '#166534', borderColor: '#166534' }}>
              Tingkat Konversi Lunas: 8.0%
            </span>
          </div>

          <p style={{ margin: 0, fontSize: 12, color: 'var(--nb-text-muted)' }}>
            Perjalanan pembeli dari penelusuran katalog hingga penyelesaian pembayaran invoice resmi.
          </p>

          <div className="analytics-funnel-list">
            {dataset.funnelStages.map((stage, idx) => (
              <div key={stage.id} className="analytics-funnel-step">
                <div className="analytics-funnel-step-head">
                  <div className="analytics-funnel-step-label">
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: stage.color }}>
                      {stage.icon}
                    </span>
                    <span>
                      {idx + 1}. {stage.label}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="analytics-funnel-step-metric">
                      {stage.formattedCount}
                    </span>
                    {stage.dropOffRate && (
                      <span className="analytics-drop-pill" title="Tingkat pembatalan sebelum tahap ini">
                        -{stage.dropOffRate}% Drop
                      </span>
                    )}
                  </div>
                </div>

                <div className="analytics-funnel-bar-outer">
                  <div
                    className="analytics-funnel-bar-fill"
                    style={{
                      width: `${stage.percentageOfTotal}%`,
                      backgroundColor: stage.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Pangsa Metode Pembayaran */}
          <div style={{ marginTop: 8, paddingTop: 14, borderTop: 'var(--nb-border-2)' }}>
            <h3 style={{ margin: '0 0 10px 0', fontFamily: 'var(--font-heading)', fontSize: 13, textTransform: 'uppercase' }}>
              Distribusi Metode Pembayaran
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dataset.paymentShares.map((pay) => (
                <div key={pay.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                    <span style={{ fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                      {pay.name}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                      {pay.sharePercentage}% ({pay.volumeFormatted})
                    </span>
                  </div>
                  <div style={{ height: 10, width: '100%', backgroundColor: 'var(--nb-paper)', border: '1px solid #000' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pay.sharePercentage}%`,
                        backgroundColor: pay.color,
                        borderRight: '1px solid #000',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kolom 2: Kontribusi Kategori E-Book */}
        <div className="analytics-panel-card">
          <div className="analytics-panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined" aria-hidden="true">
                pie_chart
              </span>
              <h2 className="analytics-panel-title">Kontribusi Kategori E-Book</h2>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700 }}>
              5 Kategori Aktif
            </span>
          </div>

          <p style={{ margin: 0, fontSize: 12, color: 'var(--nb-text-muted)' }}>
            Persentase pembagian omzet dan buku terlaris pada masing-masing domain keilmuan e-book.
          </p>

          <div className="analytics-category-list">
            {dataset.categoryBreakdown.map((cat) => (
              <div key={cat.id} className="analytics-category-item">
                <div className="analytics-category-meta-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: 12,
                        height: 12,
                        backgroundColor: cat.color,
                        border: '1px solid #000',
                      }}
                    />
                    <span className="analytics-category-name">{cat.name}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="analytics-category-rev">{cat.revenueFormatted}</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        fontWeight: 700,
                        backgroundColor: 'var(--nb-paper)',
                        padding: '1px 6px',
                        border: '1px solid #000',
                      }}
                    >
                      {cat.percentage}%
                    </span>
                  </div>
                </div>

                <div className="analytics-cat-progress-outer">
                  <div
                    className="analytics-cat-progress-fill"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--nb-text-muted)' }}>
                  <span>{cat.unitsSold} buku terjual ({cat.activeBookCount} judul aktif)</span>
                  <span style={{ fontStyle: 'italic', maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Top: {cat.topBookTitle.replace('DATA SIMULASI — ', '')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: 'var(--nb-border-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Kelola detail taksonomi kategori:</span>
            <button
              type="button"
              className="nb-btn nb-page-btn"
              style={{ fontSize: 11, padding: '4px 10px' }}
              onClick={() => onNavigate?.('/admin/katalog/kategori')}
            >
              Buka Katalog Kategori
            </button>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------
          6. SPK SAW Intelligence Insight Banner
          -------------------------------------------------------------------- */}
      <div className="analytics-saw-banner" role="region" aria-label="Wawasan Algoritma SPK SAW">
        <div className="analytics-saw-banner-left">
          <div className="analytics-saw-icon-badge">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 28, color: '#4338CA' }}
              aria-hidden="true"
            >
              auto_awesome
            </span>
          </div>

          <div>
            <h3 className="analytics-saw-title">
              Inteligensi Rekomendasi SAW Berkontribusi Signifikan Terhadap Konversi
            </h3>
            <p className="analytics-saw-desc">
              Analisis korelasi menunjukkan bahwa e-book yang memperoleh <strong>Skor SAW Tinggi (Top 5 Peringkat)</strong> menghasilkan rata-rata tingkat konversi pembelian <strong>6.2%</strong> (dibandingkan 4.6% pada buku non-rekomendasi). Peringkat e-book terhitung murni di backend sesuai bobot kriteria resmi.
            </p>
          </div>
        </div>

        <div className="analytics-saw-banner-right">
          <button
            type="button"
            className="nb-btn is-active"
            style={{
              backgroundColor: 'var(--nb-white)',
              color: 'var(--nb-black)',
              border: 'var(--nb-border-2)',
              boxShadow: 'var(--nb-shadow-sm)',
              padding: '10px 16px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: 12,
            }}
            onClick={() => onNavigate?.('/admin/spk/matriks')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden="true">
              calculate
            </span>
            <span>Audit Matriks SPK SAW</span>
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------------
          7. Tabel Performa E-Book Teratas (Zona C)
          -------------------------------------------------------------------- */}
      <div className="analytics-table-card">
        <div className="analytics-table-controls">
          <div className="analytics-table-tabs" role="tablist" aria-label="Tab Pilihan Performa E-Book">
            {(
              [
                { key: 'ALL', label: 'Semua E-Book' },
                { key: 'GROWTH', label: 'Pertumbuhan Tertinggi (Velocity)' },
                { key: 'REVENUE', label: 'Omzet Terbesar' },
                { key: 'SAW', label: 'Rekomendasi Teratas SAW' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={topBooksTab === tab.key}
                className={`analytics-tab-btn ${topBooksTab === tab.key ? 'is-active' : ''}`}
                onClick={() => {
                  setTopBooksTab(tab.key)
                  setCurrentPage(1)
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ width: '100%', maxWidth: 320 }}>
            <SearchInput
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val)
                setCurrentPage(1)
              }}
              onClear={() => setSearchQuery('')}
              placeholder="Cari judul, penulis, atau kategori..."
              ariaLabel="Cari tabel performa e-book"
            />
          </div>
        </div>

        {/* Tabel Data Padat */}
        {isLoading ? (
          <TableSkeleton rows={pageSize} cols={8} />
        ) : filteredBooks.length === 0 ? (
          <EmptyState
            icon="menu_book"
            title="Tidak ada e-book yang cocok"
            description={`Tidak ditemukan data performa e-book untuk kriteria pencarian "${searchQuery}".`}
            actionLabel="Reset Pencarian"
            onAction={() => setSearchQuery('')}
          />
        ) : (
          <div className="nb-table-container">
            <table className="analytics-table" aria-label="Tabel Matriks Performa E-Book">
              <thead>
                <tr>
                  <th scope="col" style={{ width: 60, textAlign: 'center' }}>
                    Rank
                  </th>
                  <th scope="col">Judul E-Book</th>
                  <th scope="col" style={{ width: 180 }}>
                    Kategori & Penulis
                  </th>
                  <th scope="col" style={{ width: 110, textAlign: 'right' }}>
                    Harga Satuan
                  </th>
                  <th scope="col" style={{ width: 100, textAlign: 'right' }}>
                    Terjual
                  </th>
                  <th scope="col" style={{ width: 130, textAlign: 'right' }}>
                    Total Omzet
                  </th>
                  <th scope="col" style={{ width: 110, textAlign: 'center' }}>
                    Pertumbuhan
                  </th>
                  <th scope="col" style={{ width: 120, textAlign: 'center' }}>
                    Skor SAW
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedBooks.map((book) => (
                  <tr key={book.id}>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        className={`analytics-rank-badge ${
                          book.sawRank === 1
                            ? 'rank-1'
                            : book.sawRank === 2
                              ? 'rank-2'
                              : book.sawRank === 3
                                ? 'rank-3'
                                : ''
                        }`}
                      >
                        #{book.sawRank}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--nb-black)' }}>
                        {book.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#F59E0B' }}>
                          star
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>
                          {book.rating}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--nb-text-muted)' }}>
                          • Konversi: {book.conversionRate}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{book.category}</div>
                      <div style={{ fontSize: 11, color: 'var(--nb-text-muted)', marginTop: 2 }}>
                        {book.author.replace('DATA SIMULASI — ', '')}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      {book.price}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                      {book.unitsSold.toLocaleString('id-ID')}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#065F46' }}>
                      {book.totalRevenue}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="analytics-kpi-pill is-positive">
                        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>
                          trending_up
                        </span>
                        <span>+{book.growthRate}%</span>
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="analytics-saw-score-chip" title={`Skor SPK Simple Additive Weighting: ${book.sawScore}`}>
                        <span className="material-symbols-outlined" style={{ fontSize: 13, color: '#4338CA' }}>
                          stars
                        </span>
                        <span>{book.sawScore.toFixed(3)}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginasi Footer */}
        {filteredBooks.length > 0 && (
          <div style={{ borderTop: 'var(--nb-border-2)', paddingTop: 14 }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredBooks.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}
