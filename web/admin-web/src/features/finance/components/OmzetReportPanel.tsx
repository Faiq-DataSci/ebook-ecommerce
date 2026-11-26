import type { CSSProperties } from 'react'
import {
  INITIAL_ORDERS_DATA,
  PAYMENT_METHOD_DISTRIBUTIONS,
  REVENUE_METRIC_SUMMARY,
} from '../../transactions/data/transactionFinanceData'

interface OmzetReportPanelProps {
  onNavigate?: (path: string) => void
}

export function OmzetReportPanel({ onNavigate }: OmzetReportPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Financial KPI Cards */}
      <div className="tf-kpi-grid">
        <div className="tf-kpi-card" style={{ '--card-accent': 'var(--nb-green)' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Omzet Kotor (GMV)</span>
          </div>
          <div className="tf-kpi-value">{REVENUE_METRIC_SUMMARY.grossRevenue}</div>
          <div className="tf-kpi-footer">
            <span>{REVENUE_METRIC_SUMMARY.period} • {REVENUE_METRIC_SUMMARY.successfulOrders} trx</span>
          </div>
        </div>

        <div className="tf-kpi-card" style={{ '--card-accent': 'var(--nb-pink)' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Beban MDR Gateway</span>
          </div>
          <div className="tf-kpi-value">Rp 1.255.000</div>
          <div className="tf-kpi-footer">
            <span>Rata-rata 2.3% per transaksi</span>
          </div>
        </div>

        <div className="tf-kpi-card" style={{ '--card-accent': 'var(--nb-yellow)' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Pendapatan Bersih (Net)</span>
          </div>
          <div className="tf-kpi-value">{REVENUE_METRIC_SUMMARY.netRevenue}</div>
          <div className="tf-kpi-footer">
            <span>Setelah potongan fee payment gateway</span>
          </div>
        </div>

        <div className="tf-kpi-card" style={{ '--card-accent': 'var(--nb-blue)' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Dana Menunggu Cair</span>
          </div>
          <div className="tf-kpi-value">Rp 480.150</div>
          <div className="tf-kpi-footer">
            <span>Batch malam ini (23:59 WIB)</span>
          </div>
        </div>
      </div>

      {/* Breakdown Section: Payment Channels & Recent Verified Transactions */}
      <div className="tf-breakdown-grid">
        {/* Left: Saluran Pembayaran & Beban MDR */}
        <section className="tf-breakdown-card" aria-label="Distribusi Saluran dan Tarif MDR">
          <div className="tf-card-header">
            <h3 className="tf-card-title">Distribusi Saluran &amp; Tarif MDR</h3>
            <span className="tf-card-tag">MDR RESMI</span>
          </div>

          <div className="tf-share-list">
            {PAYMENT_METHOD_DISTRIBUTIONS.map((method, idx) => (
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
            ))}
          </div>

          <div className="tf-tariff-note">
            <strong className="tf-tariff-note-title">Catatan Tarif Gateway</strong>
            <ul className="tf-tariff-note-list">
              <li>QRIS Dinamis: MDR 0.7% (regulasi Bank Indonesia)</li>
              <li>Virtual Account Bank: Rp 2.500 flat per transaksi sukses</li>
              <li>E-Wallet (GoPay/OVO): MDR 2.0% per transaksi sukses</li>
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
                {INITIAL_ORDERS_DATA.filter((o) => o.status === 'PAID')
                  .slice(0, 5)
                  .map((o) => (
                    <tr key={o.id}>
                      <td className="tf-mono">{o.orderNumber}</td>
                      <td>{o.customerName}</td>
                      <td className="tf-money">{o.totalAmountFormatted}</td>
                      <td className="tf-td-muted">{o.paidAt}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
