import { useState, type CSSProperties } from 'react'
import {
  EmptyState,
  FilterSelect,
  Pagination,
  SearchInput,
  StatusBadge,
} from '../../../shared/components/ui'
import type { OrderRecord, OrderStatus } from '../types/transactionFinance'
import { OrdersBatchActionBar } from './OrdersBatchActionBar'

interface OrdersTablePanelProps {
  orders: OrderRecord[]
  filteredOrders: OrderRecord[]
  orderSearch: string
  orderStatusFilter: OrderStatus
  orderPage: number
  orderPageSize: number
  setOrderSearch: (val: string) => void
  setOrderStatusFilter: (val: OrderStatus) => void
  setOrderPage: (page: number) => void
  onSelectOrder: (order: OrderRecord) => void
}

type SortField = 'orderNumber' | 'createdAt' | 'customerName' | 'totalAmount' | 'status'
type SortOrder = 'asc' | 'desc'

function renderOrderStatusBadge(status: OrderRecord['status']) {
  switch (status) {
    case 'PAID':
      return <StatusBadge status="LUNAS" fill="var(--nb-green)" textColor="var(--nb-white)" />
    case 'PENDING':
      return <StatusBadge status="MENUNGGU" fill="var(--nb-yellow)" textColor="var(--nb-black)" />
    case 'EXPIRED':
      return <StatusBadge status="KEDALUWARSA" fill="var(--nb-muted)" textColor="var(--nb-black)" />
    case 'CANCELLED':
      return <StatusBadge status="DIBATALKAN" fill="var(--nb-pink)" textColor="var(--nb-white)" />
    default:
      return <StatusBadge status={status} fill="var(--nb-muted)" />
  }
}

export function OrdersTablePanel({
  orders,
  filteredOrders,
  orderSearch,
  orderStatusFilter,
  orderPage,
  orderPageSize,
  setOrderSearch,
  setOrderStatusFilter,
  setOrderPage,
  onSelectOrder,
}: OrdersTablePanelProps) {
  // Sort state
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Expanded row state
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Payment method filter
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('ALL')

  const paidOrders = orders.filter((o) => o.status === 'PAID')
  const pendingOrders = orders.filter((o) => o.status === 'PENDING')
  const failedOrExpiredOrders = orders.filter((o) => ['EXPIRED', 'CANCELLED', 'FAILED'].includes(o.status))
  const totalOmzet = paidOrders.reduce((acc, o) => acc + o.totalAmount, 0)

  // Apply payment method filter
  const furtherFiltered = filteredOrders.filter((order) => {
    if (paymentMethodFilter === 'ALL') return true
    return order.paymentMethod.toLowerCase().includes(paymentMethodFilter.toLowerCase())
  })

  // Apply sorting
  const sortedOrders = [...furtherFiltered].sort((a, b) => {
    let comparison: number
    if (sortField === 'orderNumber') {
      comparison = a.orderNumber.localeCompare(b.orderNumber)
    } else if (sortField === 'customerName') {
      comparison = a.customerName.localeCompare(b.customerName)
    } else if (sortField === 'totalAmount') {
      comparison = a.totalAmount - b.totalAmount
    } else if (sortField === 'status') {
      comparison = a.status.localeCompare(b.status)
    } else {
      comparison = a.id.localeCompare(b.id)
    }
    return sortOrder === 'asc' ? comparison : -comparison
  })

  const displayedOrders = sortedOrders.slice(
    (orderPage - 1) * orderPageSize,
    orderPage * orderPageSize,
  )

  const handleToggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(displayedOrders.map((o) => o.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const handleExportSelected = () => {
    const selectedOrders = orders.filter((o) => selectedIds.includes(o.id))
    const headers = ['Nomor Pesanan', 'Pelanggan', 'Email', 'Total (Rp)', 'Status']
    const rows = selectedOrders.map((o) => [
      o.orderNumber,
      `"${o.customerName}"`,
      o.customerEmail,
      o.totalAmount,
      o.status,
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `pesanan-terpilih-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Mini KPI Cards (Neubrutalism Zona C) */}
      <div className="tf-kpi-grid">
        <div className="tf-kpi-card" style={{ '--card-accent': 'var(--nb-green)' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Pesanan Lunas (PAID)</span>
          </div>
          <div className="tf-kpi-value">{paidOrders.length} Pesanan</div>
          <div className="tf-kpi-footer">
            <span>Akses PDF aktif di perpustakaan</span>
          </div>
        </div>

        <div className="tf-kpi-card" style={{ '--card-accent': 'var(--nb-yellow)' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Menunggu Bayar</span>
          </div>
          <div className="tf-kpi-value">{pendingOrders.length} Tagihan</div>
          <div className="tf-kpi-footer">
            <span>Batas waktu bayar 15–30 menit</span>
          </div>
        </div>

        <div className="tf-kpi-card" style={{ '--card-accent': 'var(--nb-blue)' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Total Omzet Pesanan</span>
          </div>
          <div className="tf-kpi-value">Rp {totalOmzet.toLocaleString('id-ID')}</div>
          <div className="tf-kpi-footer">
            <span>Akumulasi transaksi tervalidasi</span>
          </div>
        </div>

        <div className="tf-kpi-card" style={{ '--card-accent': 'var(--nb-pink)' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Batal / Kedaluwarsa</span>
          </div>
          <div className="tf-kpi-value">{failedOrExpiredOrders.length} Pesanan</div>
          <div className="tf-kpi-footer">
            <span>Hak akses tidak diterbitkan</span>
          </div>
        </div>
      </div>

      {/* Filter Bar with Quick Status Chips */}
      <div className="tf-filter-bar">
        <div className="tf-filter-row">
          <div className="tf-filter-left">
            <SearchInput
              value={orderSearch}
              onChange={(val) => {
                setOrderSearch(val)
                setOrderPage(1)
              }}
              placeholder="Cari no. order, nama pelanggan, email, judul buku..."
            />
            <FilterSelect
              label="Filter Status"
              value={orderStatusFilter}
              onChange={(val) => {
                setOrderStatusFilter(val as OrderStatus)
                setOrderPage(1)
              }}
              options={[
                { value: 'ALL', label: 'Semua Status Pesanan' },
                { value: 'PAID', label: 'Lunas (PAID)' },
                { value: 'PENDING', label: 'Menunggu (PENDING)' },
                { value: 'EXPIRED', label: 'Kedaluwarsa (EXPIRED)' },
                { value: 'CANCELLED', label: 'Dibatalkan (CANCELLED)' },
              ]}
            />
            <FilterSelect
              label="Kanal Bayar"
              value={paymentMethodFilter}
              onChange={(val) => {
                setPaymentMethodFilter(val)
                setOrderPage(1)
              }}
              options={[
                { value: 'ALL', label: 'Semua Metode Pembayaran' },
                { value: 'qris', label: 'QRIS Dinamis' },
                { value: 'bca', label: 'BCA Virtual Account' },
                { value: 'mandiri', label: 'Mandiri Bill Payment' },
                { value: 'gopay', label: 'GoPay E-Wallet' },
              ]}
            />
          </div>
          <div className="tf-filter-right">
            <span className="tf-tab-badge">
              Ditemukan {sortedOrders.length} dari {orders.length}
            </span>
          </div>
        </div>

        {/* Quick Filter Chips (1-Click Access) */}
        <div className="tf-chips-row">
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--nb-text-muted)' }}>
            Filter Cepat:
          </span>
          <button
            type="button"
            className={`tf-filter-chip ${orderStatusFilter === 'ALL' ? 'is-active' : ''}`}
            onClick={() => {
              setOrderStatusFilter('ALL')
              setOrderPage(1)
            }}
          >
            <span>Semua</span>
            <span className="tf-mono">({orders.length})</span>
          </button>
          <button
            type="button"
            className={`tf-filter-chip ${orderStatusFilter === 'PAID' ? 'is-active' : ''}`}
            onClick={() => {
              setOrderStatusFilter('PAID')
              setOrderPage(1)
            }}
          >
            <span style={{ color: 'var(--nb-green)', fontSize: '10px' }}>●</span>
            <span>Lunas</span>
            <span className="tf-mono">({paidOrders.length})</span>
          </button>
          <button
            type="button"
            className={`tf-filter-chip ${orderStatusFilter === 'PENDING' ? 'is-active' : ''}`}
            onClick={() => {
              setOrderStatusFilter('PENDING')
              setOrderPage(1)
            }}
          >
            <span style={{ color: '#D97706', fontSize: '10px' }}>●</span>
            <span>Menunggu</span>
            <span className="tf-mono">({pendingOrders.length})</span>
          </button>
          <button
            type="button"
            className={`tf-filter-chip ${orderStatusFilter === 'EXPIRED' ? 'is-active' : ''}`}
            onClick={() => {
              setOrderStatusFilter('EXPIRED')
              setOrderPage(1)
            }}
          >
            <span style={{ color: 'var(--nb-text-muted)', fontSize: '10px' }}>●</span>
            <span>Kedaluwarsa</span>
            <span className="tf-mono">({orders.filter((o) => o.status === 'EXPIRED').length})</span>
          </button>
          <button
            type="button"
            className={`tf-filter-chip ${orderStatusFilter === 'CANCELLED' ? 'is-active' : ''}`}
            onClick={() => {
              setOrderStatusFilter('CANCELLED')
              setOrderPage(1)
            }}
          >
            <span style={{ color: 'var(--nb-pink)', fontSize: '10px' }}>●</span>
            <span>Dibatalkan</span>
            <span className="tf-mono">({orders.filter((o) => o.status === 'CANCELLED').length})</span>
          </button>
        </div>
      </div>

      {/* Table of Orders (Zona C Padat Data, Sortable & Selectable) */}
      <div className="tf-table-card">
        <div className="tf-table-responsive">
          <table className="tf-table">
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    className="tf-checkbox"
                    aria-label="Pilih seluruh pesanan pada halaman ini"
                    checked={displayedOrders.length > 0 && displayedOrders.every((o) => selectedIds.includes(o.id))}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th
                  className="is-sortable"
                  aria-sort={sortField === 'orderNumber' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                  onClick={() => handleToggleSort('orderNumber')}
                >
                  <span>No. Pesanan</span>
                </th>
                <th
                  className="is-sortable"
                  aria-sort={sortField === 'customerName' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                  onClick={() => handleToggleSort('customerName')}
                >
                  <span>Pelanggan</span>
                </th>
                <th>Item E-Book</th>
                <th
                  style={{ textAlign: 'right' }}
                  className="is-sortable"
                  aria-sort={sortField === 'totalAmount' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                  onClick={() => handleToggleSort('totalAmount')}
                >
                  <span>Total Tagihan</span>
                </th>
                <th>Metode Pembayaran</th>
                <th
                  className="is-sortable"
                  aria-sort={sortField === 'status' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                  onClick={() => handleToggleSort('status')}
                >
                  <span>Status Pesanan</span>
                </th>
                <th>Hak Akses PDF</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {displayedOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: 0 }}>
                    <EmptyState
                      title="Tidak Ada Pesanan Ditemukan"
                      description="Coba ubah kata kunci pencarian atau reset filter status pesanan."
                    />
                  </td>
                </tr>
              ) : (
                displayedOrders.map((order) => {
                  const initialLetter = order.customerName.charAt(0).toUpperCase() || 'P'
                  const isSelected = selectedIds.includes(order.id)
                  const isExpanded = expandedId === order.id

                  return (
                    <>
                      <tr key={order.id} className={isSelected ? 'is-selected' : ''}>
                        <td style={{ textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            className="tf-checkbox"
                            aria-label={`Pilih pesanan ${order.orderNumber}`}
                            checked={isSelected}
                            onChange={() => handleToggleSelectRow(order.id)}
                          />
                        </td>

                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => setExpandedId(isExpanded ? null : order.id)}
                              aria-label={isExpanded ? 'Tutup rincian cepat' : 'Buka rincian cepat'}
                              style={{
                                background: 'var(--nb-paper)',
                                border: '1.5px solid var(--nb-black)',
                                cursor: 'pointer',
                                padding: '0 5px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '12px',
                                fontWeight: 800,
                                lineHeight: '18px',
                                color: 'var(--nb-black)',
                              }}
                            >
                              {isExpanded ? '-' : '+'}
                            </button>
                            <div>
                              <span className="tf-mono" style={{ color: 'var(--nb-blue)', fontSize: '13px' }}>
                                {order.orderNumber}
                              </span>
                              <div style={{ fontSize: '11px', color: 'var(--nb-text-muted)' }}>
                                {order.createdAt}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="tf-avatar-badge">{initialLetter}</span>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '13px' }}>{order.customerName}</div>
                              <div className="tf-mono" style={{ fontSize: '11px', color: 'var(--nb-text-muted)' }}>
                                {order.customerEmail}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div style={{ maxWidth: '260px' }}>
                            {order.items.map((it, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  fontWeight: 600,
                                  fontSize: '12.5px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                <span
                                  className="tf-badge"
                                  style={{
                                    backgroundColor: 'var(--nb-paper)',
                                    fontSize: '9.5px',
                                    padding: '1px 4px',
                                  }}
                                >
                                  PDF
                                </span>
                                <span>{it.title}</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="tf-money">
                          <span style={{ fontSize: '13.5px' }}>{order.totalAmountFormatted}</span>
                        </td>

                        <td>
                          <div style={{ fontWeight: 600, fontSize: '13px' }}>{order.paymentMethod}</div>
                          {order.paymentGatewayRef && (
                            <div className="tf-mono" style={{ fontSize: '10.5px', color: 'var(--nb-text-muted)' }}>
                              Ref: {order.paymentGatewayRef}
                            </div>
                          )}
                        </td>

                        <td>{renderOrderStatusBadge(order.status)}</td>

                        <td>
                          {order.status === 'PAID' ? (
                            order.ebookAccessRevoked ? (
                              <span className="tf-access-pill is-revoked">
                                <span>Dicabut</span>
                              </span>
                            ) : (
                              <span className="tf-access-pill is-active">
                                <span>Aktif (Signed URL)</span>
                              </span>
                            )
                          ) : (
                            <span className="tf-access-pill is-locked">
                              <span>Terkunci</span>
                            </span>
                          )}
                        </td>

                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            className="tf-action-btn"
                            onClick={() => onSelectOrder(order)}
                            title="Buka Detail Pesanan, Hak Akses, & Webhook Timeline"
                          >
                            <span>Detail &amp; Akses</span>
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Quick Details Drawer */}
                      {isExpanded && (
                        <tr key={`${order.id}-details`} className="tf-row-details">
                          <td colSpan={9}>
                            <div className="tf-row-details-content">
                              <div>
                                <span className="tf-spec-label">Kontak Pelanggan:</span>
                                <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px' }}>
                                  {order.customerPhone || 'Tidak ada nomor telepon'}
                                </div>
                                <div className="tf-mono" style={{ fontSize: '11px', color: 'var(--nb-text-muted)' }}>
                                  ID Pelanggan: {order.customerEmail}
                                </div>
                              </div>

                              <div>
                                <span className="tf-spec-label">Rincian Buku ({order.items.length} Judul):</span>
                                <div style={{ fontSize: '12.5px', marginTop: '2px' }}>
                                  {order.items.map((i, iIdx) => (
                                    <div key={iIdx}>
                                      • <strong>{i.title}</strong>: {i.priceFormatted}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <span className="tf-spec-label">Siklus Transaksi:</span>
                                <div style={{ fontSize: '12px', marginTop: '2px' }}>
                                  Tahap Terakhir:{' '}
                                  <strong>{order.timeline[order.timeline.length - 1]?.stage || 'Dibuat'}</strong>
                                </div>
                                <div className="tf-mono" style={{ fontSize: '11px', color: 'var(--nb-text-muted)' }}>
                                  {order.paidAt ? `Lunas: ${order.paidAt}` : 'Belum Terbayar'}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {furtherFiltered.length > 0 && (
          <div style={{ padding: '12px 18px', borderTop: '2px solid var(--nb-black)', backgroundColor: 'var(--nb-white)' }}>
            <Pagination
              currentPage={orderPage}
              totalPages={Math.ceil(furtherFiltered.length / orderPageSize) || 1}
              totalItems={furtherFiltered.length}
              pageSize={orderPageSize}
              onPageChange={setOrderPage}
              labelItemName="pesanan"
            />
          </div>
        )}
      </div>

      {/* Floating Batch Action Bar */}
      <OrdersBatchActionBar
        selectedCount={selectedIds.length}
        onExportSelected={handleExportSelected}
        onClearSelection={() => setSelectedIds([])}
      />
    </div>
  )
}
