import { useState } from 'react'
import type { DailySalesPoint } from '../types/dashboard'

interface DashboardSalesChartProps {
  chartSeries: DailySalesPoint[]
  weeklyTotalFormatted: string
  yAxisLabels: string[]
  peakPoint: DailySalesPoint
  averageDailyFormatted: string
  isSyncing: boolean
  lastSyncTime: Date | null
  onSyncData: (isManual?: boolean) => void
}

export function DashboardSalesChart({
  chartSeries,
  weeklyTotalFormatted,
  yAxisLabels,
  peakPoint,
  averageDailyFormatted,
  isSyncing,
  lastSyncTime,
  onSyncData,
}: DashboardSalesChartProps) {
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null)

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div className="chart-title-group">
          <div className="chart-title-row">
            <h2 className="chart-heading">
              MONITORING PENJUALAN MINGGUAN
            </h2>
            <div
              className="badge-live-sync"
              title="Sinkronisasi real-time dengan database PostgreSQL Supabase aktif"
            >
              <span className="live-pulse-dot" aria-hidden="true" />
              <span>REAL-TIME DB</span>
            </div>
            <button
              type="button"
              className="btn-chart-sync"
              onClick={() => onSyncData(true)}
              disabled={isSyncing}
              title="Muat ulang data penjualan terkini dari database"
            >
              <span>{isSyncing ? 'SINKRON...' : 'SINKRONKAN'}</span>
            </button>
          </div>
          <p className="chart-subtitle">
            Omzet &amp; Volume Transaksi (Senin - Minggu) • Sumber Database PostgreSQL
            {lastSyncTime && (
              <span className="chart-sync-time">
                • Terakhir Sinkron: {lastSyncTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            )}
          </p>
        </div>

        <div className="chart-legend-row">
          <div className="chart-legend-pill">
            <span
              className="legend-swatch"
              style={{ backgroundColor: '#FFD23F' }}
            />
            <span>Transaksi Lunas (PAID)</span>
          </div>
          <div className="chart-legend-pill">
            <span
              className="legend-swatch"
              style={{ backgroundColor: '#74B9FF' }}
            />
            <span>Menunggu Pembayaran</span>
          </div>
          <div className="chart-total-pill">{weeklyTotalFormatted}</div>
        </div>
      </div>

      {/* Stacked Bar Chart with Neubrutalist Y-Axis Gridlines */}
      <div className="chart-plot-box">
        <div className="chart-plot-inner">
          <div className="chart-y-grid" aria-hidden="true">
            {yAxisLabels.map((label) => {
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
            {chartSeries.map((point, idx) => {
              const isHovered = hoveredBarIndex === idx
              return (
                <div
                  key={point.day}
                  className={`chart-bar-col ${isHovered ? 'is-hovered' : ''}`}
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                  tabIndex={0}
                  role="region"
                  aria-label={`Data penjualan ${point.day}: ${point.totalLabel}`}
                >
                  {/* Interactive Tooltip Popover on Hover */}
                  {isHovered && (
                    <div className="chart-hover-popover" role="tooltip">
                      <span className="chart-hover-title">
                        {point.day} {point.isPeak ? '• PUNCAK SEPEKAN' : '• PENJUALAN'}
                      </span>
                      <span className="chart-hover-value">
                        {point.totalLabel}
                      </span>
                      <div className="chart-hover-row">
                        <span
                          className="chart-hover-dot"
                          style={{ backgroundColor: '#FFD23F' }}
                        />
                        <span>{point.regulerTooltip}</span>
                      </div>
                      <div className="chart-hover-row">
                        <span
                          className="chart-hover-dot"
                          style={{ backgroundColor: '#74B9FF' }}
                        />
                        <span>{point.bundlingTooltip}</span>
                      </div>
                    </div>
                  )}

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
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom Insight Bar */}
      <div className="chart-insights-grid">
        <div className="chart-insight-box">
          <div className="insight-left">
            <span style={{ fontWeight: 700 }}>Puncak Transaksi:</span>
          </div>
          <span className="insight-badge-green">
            {peakPoint.day} ({peakPoint.totalLabel})
          </span>
        </div>

        <div className="chart-insight-box">
          <div className="insight-left">
            <span style={{ fontWeight: 700, color: '#404040' }}>
              Rata-rata:
            </span>
            <strong style={{ fontWeight: 900 }}>{averageDailyFormatted}</strong>
          </div>
          <div className="insight-left">
            <span style={{ fontWeight: 700, color: '#404040' }}>
              Status:
            </span>
            <strong className="insight-badge-yellow">Lunas Terverifikasi</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
