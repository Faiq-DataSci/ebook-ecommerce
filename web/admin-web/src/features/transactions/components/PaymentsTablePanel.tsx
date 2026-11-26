import {
  EmptyState,
  FilterSelect,
  SearchInput,
  StatusBadge,
} from '../../../shared/components/ui'
import type { PaymentAuditRecord, PaymentStatus } from '../types/transactionFinance'

interface PaymentsTablePanelProps {
  payments: PaymentAuditRecord[]
  filteredPayments: PaymentAuditRecord[]
  paymentSearch: string
  paymentStatusFilter: PaymentStatus
  setPaymentSearch: (val: string) => void
  setPaymentStatusFilter: (val: PaymentStatus) => void
  onSimulateWebhook: () => void
  onSelectPaymentPayload: (payment: PaymentAuditRecord) => void
}

function renderPaymentStatusBadge(status: PaymentAuditRecord['status']) {
  switch (status) {
    case 'VERIFIED':
      return <StatusBadge status="TERVERIFIKASI" fill="#00B894" icon="verified" textColor="#FFFFFF" />
    case 'PENDING':
      return <StatusBadge status="PENDING" fill="#FFD23F" icon="hourglass_top" textColor="#000000" />
    case 'EXPIRED':
      return <StatusBadge status="EXPIRED" fill="#DFE6E9" icon="timer_off" textColor="#000000" />
    case 'FAILED':
      return <StatusBadge status="FAILED" fill="#FF6B6B" icon="error" textColor="#FFFFFF" />
    default:
      return <StatusBadge status={status} fill="#DFE6E9" icon="help" />
  }
}

export function PaymentsTablePanel({
  filteredPayments,
  paymentSearch,
  paymentStatusFilter,
  setPaymentSearch,
  setPaymentStatusFilter,
  onSimulateWebhook,
  onSelectPaymentPayload,
}: PaymentsTablePanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Simulator Webhook Bar */}
      <div className="tf-simulator-card">
        <div className="tf-simulator-info">
          <span className="tf-simulator-title">
            <span className="material-symbols-outlined" style={{ color: '#0984E3' }}>developer_mode</span>
            Simulator Transaksi &amp; Webhook Gateway
          </span>
          <span style={{ fontSize: 13, color: 'var(--nb-black)' }}>
            Uji langsung penerimaan webhook settlement HMAC SHA512 dan aktivasi hak akses otomatis pada pesanan tertunda.
          </span>
        </div>
        <button
          type="button"
          className="tf-action-btn"
          style={{ backgroundColor: '#00B894', color: '#FFFFFF', height: '40px', padding: '0 16px' }}
          onClick={onSimulateWebhook}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
          <span>Simulasi Trigger Webhook Lunas</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="tf-filter-bar">
        <div className="tf-filter-left">
          <SearchInput
            value={paymentSearch}
            onChange={setPaymentSearch}
            placeholder="Cari kode payment, ref gateway, atau pelanggan..."
          />
          <FilterSelect
            label="Status Pembayaran"
            value={paymentStatusFilter}
            onChange={(val) => setPaymentStatusFilter(val as PaymentStatus)}
            options={[
              { value: 'ALL', label: 'Semua Status' },
              { value: 'VERIFIED', label: 'Terverifikasi (VERIFIED)' },
              { value: 'PENDING', label: 'Pending (MENUNGGU)' },
              { value: 'EXPIRED', label: 'Expired (KEDALUWARSA)' },
            ]}
          />
        </div>
        <div className="tf-filter-right">
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--nb-text-muted)' }}>
            {filteredPayments.length} Pembayaran
          </span>
        </div>
      </div>

      {/* Table of Payments */}
      <div className="tf-table-card">
        <div className="tf-table-responsive">
          <table className="tf-table">
            <thead>
              <tr>
                <th>Kode Pembayaran</th>
                <th>Nomor Pesanan</th>
                <th>Pelanggan</th>
                <th>Metode &amp; Gateway</th>
                <th>External Reference</th>
                <th style={{ textAlign: 'right' }}>Nominal</th>
                <th>Status Signature</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Audit Webhook</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: 0 }}>
                    <EmptyState
                      icon="receipt"
                      title="Tidak Ada Riwayat Pembayaran"
                      description="Belum ada transaksi pembayaran yang cocok dengan filter Anda."
                    />
                  </td>
                </tr>
              ) : (
                filteredPayments.map((pay) => (
                  <tr key={pay.id}>
                    <td>
                      <span className="tf-mono" style={{ color: '#6C5CE7' }}>
                        {pay.paymentCode}
                      </span>
                      <div style={{ fontSize: 11, color: 'var(--nb-text-muted)' }}>
                        {pay.receivedAt}
                      </div>
                    </td>
                    <td>
                      <span className="tf-mono" style={{ color: '#0984E3' }}>
                        {pay.orderNumber}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{pay.customerName}</div>
                      <div style={{ fontSize: 11, color: 'var(--nb-text-muted)' }}>{pay.customerEmail}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{pay.paymentMethod}</span>
                      <div style={{ fontSize: 10, color: 'var(--nb-text-muted)' }}>Provider: {pay.provider}</div>
                    </td>
                    <td>
                      <span className="tf-mono" style={{ fontSize: 12 }}>
                        {pay.externalRef}
                      </span>
                    </td>
                    <td className="tf-money">{pay.amountFormatted}</td>
                    <td>
                      {pay.signatureVerified ? (
                        <span
                          className="tf-mono"
                          style={{
                            fontSize: 11,
                            backgroundColor: '#E3FAFC',
                            border: '1px solid #000000',
                            padding: '2px 6px',
                            color: '#0C8599',
                          }}
                        >
                          HMAC SHA512 Valid
                        </span>
                      ) : (
                        <span style={{ fontSize: 11, color: '#FF6B6B' }}>Unverified</span>
                      )}
                    </td>
                    <td>{renderPaymentStatusBadge(pay.status)}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className="tf-action-btn"
                        onClick={() => onSelectPaymentPayload(pay)}
                        title="Tinjau Raw Payload JSON Webhook Gateway"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>code</span>
                        <span>Payload JSON</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
