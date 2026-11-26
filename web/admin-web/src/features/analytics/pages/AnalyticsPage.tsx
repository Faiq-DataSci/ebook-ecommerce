import { useMemo, useState } from 'react'
import {
  SimulationBadge,
  Toast,
  type ToastMessage,
} from '../../../shared/components/ui'
import { AnalyticsConversionPanels } from '../components/AnalyticsConversionPanels'
import { AnalyticsKpiCards } from '../components/AnalyticsKpiCards'
import { AnalyticsTopBooksTable } from '../components/AnalyticsTopBooksTable'
import { AnalyticsTrendChart } from '../components/AnalyticsTrendChart'
import {
  generateAnalyticsCsv,
  getAnalyticsDataset,
} from '../data/analyticsData'
import type {
  AnalyticsPeriod,
  MetricType,
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

  return (
    <div className="analytics-container">
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* 1. Header & Action Bar */}
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

      {/* 2. Filter Periode Bar */}
      <div className="analytics-period-bar">
        <div className="analytics-period-pills" role="tablist" aria-label="Pilih Rentang Waktu">
          {(
            [
              { key: '7D', label: '7 Hari Terakhir' },
              { key: '30D', label: '30 Hari Terakhir' },
              { key: '90D', label: '3 Bulan (Kuartal)' },
              { key: 'YTD', label: 'Tahun Berjalan (YTD)' },
              { key: 'CUSTOM', label: 'Rentang Kustom' },
            ] as const
          ).map((p) => (
            <button
              key={p.key}
              type="button"
              role="tab"
              aria-selected={selectedPeriod === p.key}
              className={`analytics-period-btn ${selectedPeriod === p.key ? 'is-active' : ''}`}
              onClick={() => setSelectedPeriod(p.key)}
            >
              {p.label}
            </button>
          ))}
        </div>

        {selectedPeriod === 'CUSTOM' ? (
          <div className="analytics-custom-range-inputs">
            <label htmlFor="analytics-date-start" className="nb-form-label" style={{ margin: 0 }}>
              Dari:
            </label>
            <input
              id="analytics-date-start"
              type="date"
              className="nb-form-input font-mono-nb"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
            />
            <label htmlFor="analytics-date-end" className="nb-form-label" style={{ margin: 0 }}>
              Sampai:
            </label>
            <input
              id="analytics-date-end"
              type="date"
              className="nb-form-input font-mono-nb"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
            />
          </div>
        ) : (
          <span className="analytics-period-label-tag">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              date_range
            </span>
            <span>{dataset.periodLabel}</span>
          </span>
        )}
      </div>

      {/* 3. Executive KPI Grid (Zona 2) */}
      <AnalyticsKpiCards kpis={dataset.kpis} />

      {/* 4. Grafik Tren Interaktif (Multi-Metric Timeline Chart) */}
      <AnalyticsTrendChart
        timeSeries={dataset.timeSeries}
        selectedMetric={selectedMetric}
        setSelectedMetric={setSelectedMetric}
      />

      {/* 5. Grid 2 Kolom: Corong Konversi & Kontribusi Kategori + SAW Banner */}
      <AnalyticsConversionPanels
        dataset={dataset}
        onNavigate={onNavigate}
      />

      {/* 6. Tabel Performa E-Book Teratas (Zona C) */}
      <AnalyticsTopBooksTable
        topBooksTab={topBooksTab}
        searchQuery={searchQuery}
        paginatedBooks={paginatedBooks}
        filteredBooksCount={filteredBooks.length}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        setTopBooksTab={setTopBooksTab}
        setSearchQuery={setSearchQuery}
        setCurrentPage={setCurrentPage}
      />
    </div>
  )
}
