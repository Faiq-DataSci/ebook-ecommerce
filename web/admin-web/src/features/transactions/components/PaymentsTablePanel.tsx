import { useState, type CSSProperties } from 'react'
import {
  EmptyState,
  FilterSelect,
  SearchInput,
  StatusBadge,
} from '../../../shared/components/ui'
import type { OrderRecord, PaymentAuditRecord, PaymentStatus } from '../types/transactionFinance'
import { WebhookSimulatorCard } from './WebhookSimulatorCard'

interface PaymentsTablePanelProps {
  orders: OrderRecord[]
  payments: PaymentAuditRecord[]
  filteredPayments: PaymentAuditRecord[]
  paymentSearch: string
  paymentStatusFilter: PaymentStatus
  setPaymentSearch: (val: string) => void
  setPaymentStatusFilter: (val: PaymentStatus) => void
  onSimulateWebhook: (orderNumber?: string, eventType?: 'settlement' | 'expire' | 'cancel') => void
  onSelectPaymentPayload: (payment: PaymentAuditRecord) => void
}

type PaymentSortField = 'paymentCode' | 'orderNumber' | 'customerName' | 'amount' | 'status'
type SortOrder = 'asc' | 'desc'

function renderPaymentStatusBadge(status: PaymentAuditRecord['status']) {
  switch (status) {
    case 'VERIFIED':
      return <StatusBadge status="TERVERIFIKASI" fill="var(--nb-green)" textColor="var(--nb-white)" />
    case 'PENDING':
      return <StatusBadge status="MENUNGGU" fill="var(--nb-yellow)" textColor="var(--nb-black)" />
    case 'EXPIRED':
      return <StatusBadge status="KEDALUWARSA" fill="var(--nb-muted)" textColor="var(--nb-black)" />
    case 'FAILED':
      return <StatusBadge status="GAGAL" fill="var(--nb-pink)" textColor="var(--nb-white)" />
    default:
      return <StatusBadge status={status} fill="var(--nb-muted)" />
  }
}

export function PaymentsTablePanel({
  orders,
  payments,
  filteredPayments,
  paymentSearch,
  paymentStatusFilter,
  setPaymentSearch,
  setPaymentStatusFilter,
  onSimulateWebhook,
  onSelectPaymentPayload,
}: PaymentsTablePanelProps) {
  // Sort state
  const [sortField, setSortField] = useState<PaymentSortField>('paymentCode')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const verifiedCount = payments.filter((p) => p.status === 'VERIFIED').length
  const pendingCount = payments.filter((p) => p.status === 'PENDING').length
  const expiredCount = payments.filter((p) => p.status === 'EXPIRED').length
  const failedCount = payments.filter((p) => p.status === 'FAILED').length

  // Sorting
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    let comparison: number
    if (sortField === 'paymentCode') {
      comparison = a.paymentCode.localeCompare(b.paymentCode)
    } else if (sortField === 'orderNumber') {
      comparison = a.orderNumber.localeCompare(b.orderNumber)
    } else if (sortField === 'customerName') {
      comparison = a.customerName.localeCompare(b.customerName)
    } else if (sortField === 'amount') {
      comparison = a.amount - b.amount
    } else if (sortField === 'status') {
      comparison = a.status.localeCompare(b.status)
    } else {
      comparison = 0
    }
    return sortOrder === 'asc' ? comparison : -comparison
  })

  const handleToggleSort = (field: PaymentSortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Simulator Webhook Console (Interactive Control Deck) */}
      <WebhookSimulatorCard
        orders={orders}
        onFireWebhook={onSimulateWebhook}
      />

      {/* Mini KPI Cards for Webhook & Payments */}
      <div className="tf-kpi-grid">
        <div className="tf-kpi-card" style={{ '--card-accent': '#6C5CE7' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Total Log Webhook</span>
          </div>
          <div className="tf-kpi-value">{payments.length} Callback</div>
          <div className="tf-kpi-footer">
            <span>Tercatat pada tabel audit sistem</span>
          </div>
        </div>

        <div className="tf-kpi-card" style={{ '--card-accent': 'var(--nb-green)' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Integritas Signature</span>
          </div>
          <div className="tf-kpi-value">{verifiedCount} / {payments.length} Valid</div>
          <div className="tf-kpi-footer">
            <span>100% Lolos anti-spoofing HMAC</span>
          </div>
        </div>

        <div className="tf-kpi-card" style={{ '--card-accent': 'var(--nb-yellow)' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Menunggu Callback</span>
          </div>
          <div className="tf-kpi-value">{pendingCount} Transaksi</div>
          <div className="tf-kpi-footer">
            <span>Menunggu pembayaran pelanggan</span>
          </div>
        </div>
      </div>

      {/* Filter Bar with Quick Status Chips */}
      <div className="tf-filter-bar">
        <div className="tf-filter-row">
          <div className="tf-filter-left">
            <SearchInput
              value={paymentSearch}
              onChange={setPaymentSearch}
              placeholder="Cari kode payment, nomor pesanan, ref gateway, pelanggan..."
            />
            <FilterSelect
              label="Filter Status"
              value={paymentStatusFilter}
              onChange={(val) => setPaymentStatusFilter(val as PaymentStatus)}
              options={[
                { value: 'ALL', label: 'Semua Status Pembayaran' },
                { value: 'VERIFIED', label: 'Terverifikasi (VERIFIED)' },
                { value: 'PENDING', label: 'Pending (MENUNGGU)' },
                { value: 'EXPIRED', label: 'Expired (KEDALUWARSA)' },
                { value: 'FAILED', label: 'Gagal (FAILED)' },
              ]}
            />
          </div>
          <div className="tf-filter-right">
            <span className="tf-tab-badge">
              {sortedPayments.length} dari {payments.length} Callback
            </span>
          </div>
        </div>

        {/* Quick Filter Chips */}
        <div className="tf-chips-row">
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--nb-text-muted)' }}>
            Filter Cepat:
          </span>
          <button
            type="button"
            className={`tf-filter-chip ${paymentStatusFilter === 'ALL' ? 'is-active' : ''}`}
            onClick={() => setPaymentStatusFilter('ALL')}
          >
            <span>Semua</span>
            <span className="tf-mono">({payments.length})</span>
          </button>
          <button
            type="button"
            className={`tf-filter-chip ${paymentStatusFilter === 'VERIFIED' ? 'is-active' : ''}`}
            onClick={() => setPaymentStatusFilter('VERIFIED')}
          >
            <span style={{ color: 'var(--nb-green)', fontSize: '10px' }}>●</span>
            <span>Terverifikasi</span>
            <span className="tf-mono">({verifiedCount})</span>
          </button>
          <button
            type="button"
            className={`tf-filter-chip ${paymentStatusFilter === 'PENDING' ? 'is-active' : ''}`}
            onClick={() => setPaymentStatusFilter('PENDING')}
          >
            <span style={{ color: '#D97706', fontSize: '10px' }}>●</span>
            <span>Pending</span>
            <span className="tf-mono">({pendingCount})</span>
          </button>
          <button
            type="button"
            className={`tf-filter-chip ${paymentStatusFilter === 'EXPIRED' ? 'is-active' : ''}`}
            onClick={() => setPaymentStatusFilter('EXPIRED')}
          >
            <span style={{ color: 'var(--nb-text-muted)', fontSize: '10px' }}>●</span>
            <span>Expired</span>
            <span className="tf-mono">({expiredCount})</span>
          </button>
          <button
            type="button"
            className={`tf-filter-chip ${paymentStatusFilter === 'FAILED' ? 'is-active' : ''}`}
            onClick={() => setPaymentStatusFilter('FAILED')}
          >
            <span style={{ color: 'var(--nb-pink)', fontSize: '10px' }}>●</span>
            <span>Gagal</span>
            <span className="tf-mono">({failedCount})</span>
          </button>
        </div>
      </div>

      {/* Table of Payments & Webhook Audits */}
      <div className="tf-table-card">
        <div className="tf-table-responsive">
          <table className="tf-table">
            <thead>
              <tr>
                <th
                  className="is-sortable"
                  aria-sort={sortField === 'paymentCode' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                  onClick={() => handleToggleSort('paymentCode')}
                >
                  <span>Kode Pembayaran</span>
                </th>
                <th
                  className="is-sortable"
                  aria-sort={sortField === 'orderNumber' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                  onClick={() => handleToggleSort('orderNumber')}
                >
                  <span>Nomor Pesanan</span>
                </th>
                <th
                  className="is-sortable"
                  aria-sort={sortField === 'customerName' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                  onClick={() => handleToggleSort('customerName')}
                >
                  <span>Pelanggan</span>
                </th>
                <th>Metode &amp; Gateway</th>
                <th>External Reference</th>
                <th
                  style={{ textAlign: 'right' }}
                  className="is-sortable"
                  aria-sort={sortField === 'amount' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                  onClick={() => handleToggleSort('amount')}
                >
                  <span>Nominal</span>
                </th>
                <th>Status Signature</th>
                <th
                  className="is-sortable"
                  aria-sort={sortField === 'status' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                  onClick={() => handleToggleSort('status')}
                >
                  <span>Status</span>
                </th>
                <th style={{ textAlign: 'center' }}>Audit Webhook</th>
              </tr>
            </thead>
            <tbody>
              {sortedPayments.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: 0 }}>
                    <EmptyState
                      title="Tidak Ada Riwayat Pembayaran"
                      description="Belum ada transaksi pembayaran yang cocok dengan filter pencarian Anda."
                    />
                  </td>
                </tr>
              ) : (
                sortedPayments.map((pay) => {
                  const initialLetter = pay.customerName.charAt(0).toUpperCase() || 'P'
                  return (
                    <tr key={pay.id}>
                      <td>
                        <span className="tf-mono" style={{ color: '#6C5CE7', fontSize: '13px' }}>
                          {pay.paymentCode}
                        </span>
                        <div style={{ fontSize: '11px', color: 'var(--nb-text-muted)', marginTop: '2px' }}>
                          {pay.receivedAt}
                        </div>
                      </td>

                      <td>
                        <span className="tf-mono" style={{ color: 'var(--nb-blue)', fontSize: '13px' }}>
                          {pay.orderNumber}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="tf-avatar-badge" style={{ backgroundColor: 'var(--nb-blue)', color: 'var(--nb-white)' }}>
                            {initialLetter}
                          </span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '13px' }}>{pay.customerName}</div>
                            <div className="tf-mono" style={{ fontSize: '11px', color: 'var(--nb-text-muted)' }}>
                              {pay.customerEmail}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>{pay.paymentMethod}</div>
                        <div className="tf-mono" style={{ fontSize: '10.5px', color: 'var(--nb-text-muted)' }}>
                          Provider: {pay.provider === 'xendit' ? 'Xendit QRIS' : pay.provider}
                        </div>
                      </td>

                      <td>
                        <span className="tf-mono" style={{ fontSize: '12px' }}>
                          {pay.externalRef}
                        </span>
                      </td>

                      <td className="tf-money">
                        <span style={{ fontSize: '13.5px' }}>{pay.amountFormatted}</span>
                      </td>

                      <td>
                        {pay.signatureVerified ? (
                          <span
                            className="tf-mono"
                            style={{
                              fontSize: '11px',
                              backgroundColor: '#E3FAFC',
                              border: '1.5px solid var(--nb-black)',
                              padding: '2px 8px',
                              color: '#0C8599',
                              display: 'inline-flex',
                              alignItems: 'center',
                            }}
                          >
                            <span>
                              {pay.provider === 'xendit'
                                ? 'Xendit Callback Valid'
                                : 'HMAC SHA512 Valid'}
                            </span>
                          </span>
                        ) : (
                          <span
                            className="tf-mono"
                            style={{
                              fontSize: '11px',
                              backgroundColor: 'var(--nb-pink)',
                              color: 'var(--nb-white)',
                              border: '1.5px solid var(--nb-black)',
                              padding: '2px 8px',
                            }}
                          >
                            Unverified
                          </span>
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
                          <span>Payload JSON</span>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
