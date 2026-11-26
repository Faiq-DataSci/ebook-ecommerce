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
        <div className="tf-kpi-card" style={{ '--card-accent': '#00B894' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Omzet Kotor (GMV)</span>
            <span className="material-symbols-outlined" style={{ color: '#00B894' }}>trending_up</span>
          </div>
          <div className="tf-kpi-value">{REVENUE_METRIC_SUMMARY.grossRevenue}</div>
          <div className="tf-kpi-footer">
            <span>{REVENUE_METRIC_SUMMARY.period} • {REVENUE_METRIC_SUMMARY.successfulOrders} trx</span>
          </div>
        </div>

        <div className="tf-kpi-card" style={{ '--card-accent': '#FF6B6B' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Beban MDR Gateway</span>
            <span className="material-symbols-outlined" style={{ color: '#FF6B6B' }}>price_check</span>
          </div>
          <div className="tf-kpi-value" style={{ color: '#D63031' }}>Rp 1.255.000</div>
          <div className="tf-kpi-footer">
            <span>Rata-rata 2.3% per transaksi</span>
          </div>
        </div>

        <div className="tf-kpi-card" style={{ '--card-accent': '#FFD23F' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Pendapatan Bersih (Net)</span>
            <span className="material-symbols-outlined" style={{ color: '#E17055' }}>account_balance_wallet</span>
          </div>
          <div className="tf-kpi-value">{REVENUE_METRIC_SUMMARY.netRevenue}</div>
          <div className="tf-kpi-footer">
            <span>Setelah potongan fee payment gateway</span>
          </div>
        </div>

        <div className="tf-kpi-card" style={{ '--card-accent': '#74B9FF' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Dana Menunggu Cair</span>
            <span className="material-symbols-outlined" style={{ color: '#0984E3' }}>hourglass_bottom</span>
          </div>
          <div className="tf-kpi-value" style={{ color: '#0984E3' }}>Rp 480.150</div>
          <div className="tf-kpi-footer">
            <span>Batch malam ini (23:59 WIB)</span>
          </div>
        </div>
      </div>

      {/* Breakdown Section: Payment Channels & Top E-Book Sales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Left: Saluran Pembayaran & Beban MDR */}
        <div className="tf-breakdown-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 800 }}>
              Distribusi Saluran &amp; Tarif MDR
            </h3>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--nb-text-muted)' }}>MDR RESMI</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {PAYMENT_METHOD_DISTRIBUTIONS.map((method, idx) => (
              <div key={idx} className="tf-share-row">
                <div className="tf-share-header">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{method.icon}</span>
                    {method.name}
                  </span>
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

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--nb-text-muted)' }}>
                  <span>{method.orderCount} transaksi</span>
                  <span className="tf-mono">{method.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '8px', padding: '12px', border: '1.5px dashed #000', backgroundColor: '#F8F9FA', fontSize: '12px' }}>
            <strong>Catatan Tarif Gateway:</strong>
            <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
              <li>QRIS Dinamis: MDR 0.7% (regulasi Bank Indonesia)</li>
              <li>Virtual Account Bank: Rp 2.500 flat per transaksi sukses</li>
              <li>E-Wallet (GoPay/OVO): MDR 2.0% per transaksi sukses</li>
            </ul>
          </div>
        </div>

        {/* Right: Transaksi Buku Terbaru Terverifikasi */}
        <div className="tf-breakdown-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 800 }}>
              Transaksi Masuk Terbaru
            </h3>
            <button
              type="button"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700, color: '#0984E3' }}
              onClick={() => onNavigate?.('/admin/transaksi/pesanan')}
            >
              Lihat Semua ↗
            </button>
          </div>

          <div className="tf-table-responsive">
            <table className="tf-data-table">
              <thead>
                <tr>
                  <th>No Pesanan</th>
                  <th>Pelanggan</th>
                  <th>Total Bruto</th>
                  <th>Waktu Pelunasan</th>
                </tr>
              </thead>
              <tbody>
                {INITIAL_ORDERS_DATA.filter((o) => o.status === 'PAID')
                  .slice(0, 5)
                  .map((o) => (
                    <tr key={o.id}>
                      <td className="tf-mono" style={{ fontWeight: 700 }}>{o.orderNumber}</td>
                      <td>{o.customerName}</td>
                      <td className="tf-money">{o.totalAmountFormatted}</td>
                      <td style={{ fontSize: 12 }}>{o.paidAt}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
