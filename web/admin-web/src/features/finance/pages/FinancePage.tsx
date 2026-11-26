import { useState } from 'react'
import { SETTLEMENT_RECORDS_DATA } from '../../transactions/data/transactionFinanceData'
import type { FinanceTab, SettlementRecord } from '../../transactions/types/transactionFinance'
import { Toast, type ToastMessage } from '../../../shared/components/ui'
import { OmzetReportPanel } from '../components/OmzetReportPanel'
import { SettlementBatchModal } from '../components/SettlementBatchModal'
import { SettlementReportPanel } from '../components/SettlementReportPanel'
import '../../../styles/transaction-finance.css'

interface FinancePageProps {
  currentPath?: string
  onNavigate?: (path: string) => void
}

export function FinancePage({
  currentPath = '/admin/keuangan/laporan',
  onNavigate,
}: FinancePageProps) {
  // Derive active tab directly from route path
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

      {/* TAB 1: LAPORAN OMZET & BEBAN GATEWAY */}
      {activeTab === 'omzet' && (
        <OmzetReportPanel onNavigate={onNavigate} />
      )}

      {/* TAB 2: SETTLEMENT & BUKU KAS */}
      {activeTab === 'settlement' && (
        <SettlementReportPanel
          settlements={settlements}
          settlementFilter={settlementFilter}
          setSettlementFilter={setSettlementFilter}
          onSelectSettlement={setSelectedSettlement}
        />
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
