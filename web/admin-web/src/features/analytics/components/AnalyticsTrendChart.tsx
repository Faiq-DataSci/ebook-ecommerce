import { useState, useMemo } from 'react'
import type { MetricType, TimeSeriesPoint } from '../types/analytics'

interface AnalyticsTrendChartProps {
  timeSeries: TimeSeriesPoint[]
  selectedMetric: MetricType
  setSelectedMetric: (metric: MetricType) => void
}

export function AnalyticsTrendChart({
  timeSeries,
  selectedMetric,
  setSelectedMetric,
}: AnalyticsTrendChartProps) {
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null)

  const maxMetricValue = useMemo(() => {
    if (!timeSeries.length) return 1
    const values = timeSeries.map((p) => {
      if (selectedMetric === 'REVENUE') return p.revenue
      if (selectedMetric === 'UNITS') return p.units
      return p.orders
    })
    return Math.max(...values, 1)
  }, [timeSeries, selectedMetric])

  const chartHighlights = useMemo(() => {
    if (!timeSeries.length) {
      return { peak: null, lowest: null, avg: 0 }
    }
    let peak = timeSeries[0]
    let lowest = timeSeries[0]
    let sum = 0

    timeSeries.forEach((pt) => {
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

    const avg = Math.round(sum / timeSeries.length)
    return { peak, lowest, avg }
  }, [timeSeries, selectedMetric])

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
          {timeSeries.map((point, idx) => {
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
          {timeSeries.map((point) => (
            <span key={`lbl-${point.date}`} className="analytics-x-axis-label">
              {point.label}
            </span>
          ))}
        </div>
      </div>

      {/* Ringkasan Strip di Bawah Grafik */}
      <div className="analytics-chart-summary-strip">
        <div className="analytics-summary-chip">
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
  )
}
