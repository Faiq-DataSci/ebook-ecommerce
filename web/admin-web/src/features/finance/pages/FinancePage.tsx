import { useState, type CSSProperties } from 'react'
import {
  SETTLEMENT_RECORDS_DATA,
  INITIAL_ORDERS_DATA,
  PAYMENT_METHOD_DISTRIBUTIONS,
  REVENUE_METRIC_SUMMARY,
} from '../../transactions/data/transactionFinanceData'
import type { FinanceTab, SettlementRecord } from '../../transactions/types/transactionFinance'
import { Toast, type ToastMessage, StatusBadge } from '../../../shared/components/ui'
import { SettlementBatchModal } from '../components/SettlementBatchModal'
import '../../../styles/transaction-finance.css'

interface FinancePageProps {
  currentPath?: string
  onNavigate?: (path: string) => void
}

export function FinancePage({
  currentPath = '/admin/keuangan/laporan',
  onNavigate,
}: FinancePageProps) {
  // Derive active tab directly from route path (single source of truth)
  const activeTab: FinanceTab = currentPath.includes('/settlement')
    ? 'settlement'
    : 'omzet'

  const handleTabChange = (tab: FinanceTab) => {
    if (onNavigate) {
      if (tab === 'settlement') onNavigate('/admin/keuangan/settlement')
      else onNavigate('/admin/keuangan/laporan')
    }
  }

  // State: Settlement
  const [settlements] = useState<SettlementRecord[]>(SETTLEMENT_RECORDS_DATA)
  const [settlementFilter, setSettlementFilter] = useState<'ALL' | 'SETTLED' | 'PROCESSING'>('ALL')
  const [selectedSettlement, setSelectedSettlement] = useState<SettlementRecord | null>(null)

  // State: Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const showToast = (type: ToastMessage['type'], text: string) => {
    setToasts((prev) => [
      ...prev,
      { id: 'toast-' + Date.now() + Math.random(), type, text },
    ])
  }
  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Filtered settlements
  const filteredSettlements = settlements.filter((s) => {
    if (settlementFilter === 'ALL') return true
    return s.status === settlementFilter
  })

  // Action: Export Financial CSV
  const handleExportFinanceCSV = () => {
    const headers = [
      'Ref Settlement Batch',
      'Tanggal',
      'Jumlah Pesanan',
      'Gross Amount (Rp)',
      'Gateway MDR Fee (Rp)',
      'Net Payout (Rp)',
      'Bank Tujuan',
      'No. Rekening',
      'Status',
    ]
    const rows = settlements.map((s) => [
      s.batchReference,
      `"${s.date}"`,
      s.orderCount,
      s.totalGross,
      s.gatewayMdrFee,
      s.netPayout,
      `"${s.destinationBank}"`,
      `"${s.bankAccountNumber}"`,
      s.status,
    ])
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `buku-besar-keuangan-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showToast('success', 'Rekapitulasi keuangan & settlement CSV berhasil diunduh.')
  }

  const renderSettlementStatusBadge = (status: SettlementRecord['status']) => {
    switch (status) {
      case 'SETTLED':
        return <StatusBadge status="DITRANSFER (CAIR)" fill="#00B894" icon="check_circle" textColor="#FFFFFF" />
      case 'PROCESSING':
        return <StatusBadge status="PROSES BATCH" fill="#FFD23F" icon="pending" textColor="#000000" />
      case 'SCHEDULED':
        return <StatusBadge status="TERJADWAL" fill="#74B9FF" icon="schedule" textColor="#000000" />
    }
  }

  return (
    <div className="tf-page-container">
      {/* Page Header */}
      <div className="tf-page-header">
        <div className="tf-title-group">
          <div className="tf-header-title-row">
            <span
              className="tf-badge"
              style={{ backgroundColor: 'var(--nb-yellow)', color: '#000000' }}
            >
              KEUANGAN &amp; PEMBUKUAN
            </span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--nb-text-muted)' }}>
              DATA SIMULASI
            </span>
          </div>
          <h1 className="tf-page-title">Keuangan &amp; Pembukuan Toko E-Book</h1>
          <p className="tf-page-subtitle">
            Rekonsiliasi Omzet (GMV), Potongan MDR Payment Gateway, Laba Bersih, &amp; Riwayat Settlement ke Rekening Giro
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="tf-action-btn"
            style={{ height: '40px', padding: '0 16px', backgroundColor: 'var(--nb-white)' }}
            onClick={() => onNavigate?.('/admin/transaksi/pesanan')}
            title="Beralih ke Operasional Transaksi"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#0984E3' }}>receipt_long</span>
            <span>Buka Transaksi Pesanan</span>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
          </button>

          <button
            type="button"
            className="tf-action-btn"
            style={{ height: '40px', padding: '0 16px', backgroundColor: 'var(--nb-yellow)' }}
            onClick={handleExportFinanceCSV}
            title="Unduh Buku Besar Keuangan CSV"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>file_download</span>
            <span>Unduh Buku Kas (CSV)</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation Strip */}
      <div className="tf-nav-tabs" role="tablist" aria-label="Navigasi Submenu Keuangan">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'omzet'}
          className={`tf-tab-btn ${activeTab === 'omzet' ? 'is-active' : ''}`}
          onClick={() => handleTabChange('omzet')}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>query_stats</span>
          <span>Laporan Omzet &amp; Beban Gateway</span>
          <span className="tf-tab-badge" style={{ backgroundColor: '#00B894' }}>IDR</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'settlement'}
          className={`tf-tab-btn ${activeTab === 'settlement' ? 'is-active' : ''}`}
          onClick={() => handleTabChange('settlement')}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>account_balance</span>
          <span>Settlement &amp; Buku Kas</span>
          <span className="tf-tab-badge" style={{ backgroundColor: '#74B9FF' }}>
            {settlements.filter((s) => s.status === 'PROCESSING').length} Proses
          </span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: LAPORAN OMZET & BEBAN GATEWAY
          ========================================================================= */}
      {activeTab === 'omzet' && (
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
      )}

      {/* =========================================================================
          TAB 2: SETTLEMENT & BUKU KAS
          ========================================================================= */}
      {activeTab === 'settlement' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Escrow Bank Account Banner */}
          <div
            style={{
              padding: '16px 20px',
              border: '2.5px solid #000000',
              boxShadow: '4px 4px 0px #000000',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  backgroundColor: '#74B9FF',
                  border: '2px solid #000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                }}
              >
                🏦
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--nb-text-muted)' }}>
                  REKENING PENAMPUNG SETTLEMENT RESMI
                </div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>
                  Bank Central Asia (BCA) — 8820-192-331 (PT Buku Kita Digital)
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="material-symbols-outlined" style={{ color: '#00B894', fontSize: 20 }}>verified</span>
              <span style={{ fontSize: 12, fontWeight: 700 }}>Auto-Disbursement Midtrans Terhubung (H+1)</span>
            </div>
          </div>

          {/* Table Card */}
          <div className="tf-table-card">
            <div className="tf-table-header">
              <div className="tf-table-title-row">
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>receipt</span>
                <span className="tf-table-title">Buku Besar Kas &amp; Batch Pencairan Dana</span>
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>Status:</span>
                <select
                  value={settlementFilter}
                  onChange={(e) => setSettlementFilter(e.target.value as 'ALL' | 'SETTLED' | 'PROCESSING')}
                  className="tf-filter-select"
                >
                  <option value="ALL">Semua Batch</option>
                  <option value="SETTLED">Sudah Cair (Settled)</option>
                  <option value="PROCESSING">Sedang Diproses</option>
                </select>
              </div>
            </div>

            <div className="tf-table-responsive">
              <table className="tf-data-table">
                <thead>
                  <tr>
                    <th>Ref Batch</th>
                    <th>Waktu Settlement</th>
                    <th>Trx</th>
                    <th>Gross Masuk</th>
                    <th>Potongan MDR</th>
                    <th>Net Ditransfer</th>
                    <th>Rekening Tujuan</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSettlements.map((batch) => (
                    <tr key={batch.id}>
                      <td className="tf-mono" style={{ fontWeight: 700 }}>
                        {batch.batchReference}
                      </td>
                      <td style={{ fontSize: 12 }}>{batch.date}</td>
                      <td style={{ fontWeight: 700 }}>{batch.orderCount} pesanan</td>
                      <td className="tf-money">{batch.totalGrossFormatted}</td>
                      <td className="tf-money" style={{ color: '#D63031' }}>
                        - {batch.gatewayMdrFeeFormatted}
                      </td>
                      <td className="tf-money" style={{ color: '#00B894', fontWeight: 800 }}>
                        {batch.netPayoutFormatted}
                      </td>
                      <td style={{ fontSize: 12 }}>
                        {batch.destinationBank}
                      </td>
                      <td>{renderSettlementStatusBadge(batch.status)}</td>
                      <td>
                        <button
                          type="button"
                          className="tf-action-btn"
                          style={{ padding: '4px 10px', fontSize: 12 }}
                          onClick={() => setSelectedSettlement(batch)}
                          title="Lihat Rincian Batch"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>info</span>
                          <span>Rincian</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SETTLEMENT BATCH DETAIL MODAL */}
      {selectedSettlement && (
        <SettlementBatchModal
          settlement={selectedSettlement}
          onClose={() => setSelectedSettlement(null)}
          onDownloadProof={() => {
            showToast('success', `Bukti transfer batch ${selectedSettlement.batchReference} telah disiapkan.`)
            setSelectedSettlement(null)
          }}
        />
      )}

      {/* Toast Notification */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
