import type { CSSProperties } from 'react'
import { formatRupiah } from '../../../shared/utils/formatters'
import {
  INITIAL_ORDERS_DATA,
  PAYMENT_METHOD_DISTRIBUTIONS,
  REVENUE_METRIC_SUMMARY,
} from '../../transactions/data/transactionFinanceData'
import type {
  AdminOfficialTransactionRecord,
  AdminSalesReportResponse,
} from '../../transactions/services/transactionAdmin.service'

interface OmzetReportPanelProps {
  onNavigate?: (path: string) => void
  salesReport?: AdminSalesReportResponse | null
  officialTransactions?: AdminOfficialTransactionRecord[]
  isLive?: boolean
}

const CHANNEL_COLORS = ['#00B894', '#74B9FF', '#FFE135', '#FF7675', '#B8A9FA']

export function OmzetReportPanel({
  onNavigate,
  salesReport,
  officialTransactions,
  isLive = false,
}: OmzetReportPanelProps) {
  const hasLiveReport = isLive || Boolean(salesReport)
  const totalRevenueNumeric = hasLiveReport
    ? (salesReport?.summary.totalRevenue ?? 0)
    : 0
  const grossRevenue = hasLiveReport
    ? formatRupiah(totalRevenueNumeric)
    : REVENUE_METRIC_SUMMARY.grossRevenue
  // QRIS Dinamis MDR 0.7% sesuai regulasi BI / Xendit QRIS
  const mdrAmount = hasLiveReport
    ? Math.round(totalRevenueNumeric * 0.007)
    : 1255000
  const netRevenueNumeric = Math.max(0, totalRevenueNumeric - mdrAmount)
  const netRevenue = hasLiveReport
    ? formatRupiah(netRevenueNumeric)
    : REVENUE_METRIC_SUMMARY.netRevenue
  const trxCount = hasLiveReport
    ? (salesReport?.summary.totalTransactions ?? 0)
    : REVENUE_METRIC_SUMMARY.successfulOrders
  const pendingDisbursement = hasLiveReport
    ? formatRupiah(netRevenueNumeric)
    : 'Rp 480.150'

  const liveChannels = (() => {
    if (!hasLiveReport) return PAYMENT_METHOD_DISTRIBUTIONS
    const rows = officialTransactions ?? []
    if (rows.length === 0) return []

    const grouped = new Map<string, { count: number; amount: number }>()
    let grandTotal = 0
    for (const trx of rows) {
      const label =
        trx.paymentMethod?.toUpperCase() === 'QRIS'
          ? 'QRIS Dinamis (Xendit)'
          : trx.paymentMethod || 'QRIS Dinamis (Xendit)'
      const cur = grouped.get(label) ?? { count: 0, amount: 0 }
      cur.count += 1
      cur.amount += trx.amount
      grandTotal += trx.amount
      grouped.set(label, cur)
    }

    return Array.from(grouped.entries()).map(([name, val], idx) => ({
      name,
      sharePercent:
        grandTotal > 0 ? Math.round((val.amount / grandTotal) * 100) : 100,
      orderCount: val.count,
      totalAmount: formatRupiah(val.amount),
      color: CHANNEL_COLORS[idx % CHANNEL_COLORS.length],
      icon: 'QR',
    }))
  })()

  const recentRows = hasLiveReport
    ? (officialTransactions ?? []).slice(0, 5).map((trx) => ({
        id: trx.id,
        orderNumber: trx.orderNumber,
        customerName: trx.customerName,
        totalAmountFormatted: trx.amountFormatted,
        paidAt: trx.paidAt,
      }))
    : INITIAL_ORDERS_DATA.filter((o) => o.status === 'PAID')
        .slice(0, 5)
        .map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          customerName: o.customerName,
          totalAmountFormatted: o.totalAmountFormatted,
          paidAt: o.paidAt ?? '-',
        }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Financial KPI Cards */}
      <div className="tf-kpi-grid">
        <div className="tf-kpi-card" style={{ '--card-accent': 'var(--nb-green)' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Omzet Kotor (GMV)</span>
          </div>
          <div className="tf-kpi-value">{grossRevenue}</div>
          <div className="tf-kpi-footer">
            <span>{hasLiveReport ? 'Data Backend Live' : REVENUE_METRIC_SUMMARY.period} • {trxCount} trx</span>
          </div>
        </div>

        <div className="tf-kpi-card" style={{ '--card-accent': 'var(--nb-pink)' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Beban MDR Gateway</span>
          </div>
          <div className="tf-kpi-value">{formatRupiah(mdrAmount)}</div>
          <div className="tf-kpi-footer">
            <span>Estimasi MDR QRIS 0.7% (Xendit)</span>
          </div>
        </div>

        <div className="tf-kpi-card" style={{ '--card-accent': 'var(--nb-yellow)' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Pendapatan Bersih (Net)</span>
          </div>
          <div className="tf-kpi-value">{netRevenue}</div>
          <div className="tf-kpi-footer">
            <span>Setelah potongan fee payment gateway</span>
          </div>
        </div>

        <div className="tf-kpi-card" style={{ '--card-accent': 'var(--nb-blue)' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Estimasi Cair (Settlement)</span>
          </div>
          <div className="tf-kpi-value">{pendingDisbursement}</div>
          <div className="tf-kpi-footer">
            <span>{hasLiveReport ? 'Sinkron dari transaksi terverifikasi' : 'Batch malam ini (23:59 WIB)'}</span>
          </div>
        </div>
      </div>

      {/* Breakdown Section: Payment Channels & Recent Verified Transactions */}
      <div className="tf-breakdown-grid">
        {/* Left: Saluran Pembayaran & Beban MDR */}
        <section className="tf-breakdown-card" aria-label="Distribusi Saluran dan Tarif MDR">
          <div className="tf-card-header">
            <h3 className="tf-card-title">Distribusi Saluran &amp; Tarif MDR</h3>
            <span className="tf-card-tag">{hasLiveReport ? 'LIVE DB' : 'MDR RESMI'}</span>
          </div>

          <div className="tf-share-list">
            {liveChannels.length === 0 ? (
              <div style={{ padding: '12px 0', fontSize: 13, color: 'var(--nb-text-muted)' }}>
                Belum ada transaksi terverifikasi di database.
              </div>
            ) : (
              liveChannels.map((method, idx) => (
                <div key={idx} className="tf-share-row">
                  <div className="tf-share-header">
                    <span>{method.name}</span>
                    <span className="tf-mono">{method.sharePercent}%</span>
                  </div>

                  <div className="tf-progress-track">
                    <div
                      className="tf-progress-fill"
                      style={{
                        width: `${method.sharePercent}%`,
                        backgroundColor: method.color,
                      }}
                    />
                  </div>

                  <div className="tf-share-meta">
                    <span>{method.orderCount} transaksi</span>
                    <span className="tf-mono">{method.totalAmount}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="tf-tariff-note">
            <strong className="tf-tariff-note-title">Catatan Tarif Gateway (Xendit)</strong>
            <ul className="tf-tariff-note-list">
              <li>QRIS Dinamis: MDR 0.7% (regulasi Bank Indonesia)</li>
              <li>Verifikasi otomatis via webhook Xendit (`x-callback-token`)</li>
            </ul>
          </div>
        </section>

        {/* Right: Transaksi Buku Terbaru Terverifikasi */}
        <section className="tf-breakdown-card" aria-label="Transaksi Masuk Terbaru">
          <div className="tf-card-header">
            <h3 className="tf-card-title">Transaksi Masuk Terbaru</h3>
            <button
              type="button"
              className="tf-ghost-link-btn"
              onClick={() => onNavigate?.('/admin/transaksi/pesanan')}
            >
              Lihat Semua
            </button>
          </div>

          <div className="tf-table-responsive">
            <table className="tf-data-table is-compact">
              <thead>
                <tr>
                  <th scope="col">No. Pesanan</th>
                  <th scope="col">Pelanggan</th>
                  <th scope="col" className="is-right">Total Bruto</th>
                  <th scope="col">Waktu Pelunasan</th>
                </tr>
              </thead>
              <tbody>
                {recentRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '16px', color: 'var(--nb-text-muted)' }}>
                      Belum ada transaksi terverifikasi di database.
                    </td>
                  </tr>
                ) : (
                  recentRows.map((o) => (
                    <tr key={o.id}>
                      <td className="tf-mono">{o.orderNumber}</td>
                      <td>{o.customerName}</td>
                      <td className="tf-money">{o.totalAmountFormatted}</td>
                      <td className="tf-td-muted">{o.paidAt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
