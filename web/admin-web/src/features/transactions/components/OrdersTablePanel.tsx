import type { CSSProperties } from 'react'
import {
  EmptyState,
  FilterSelect,
  Pagination,
  SearchInput,
  StatusBadge,
} from '../../../shared/components/ui'
import type { OrderRecord, OrderStatus } from '../types/transactionFinance'

interface OrdersTablePanelProps {
  orders: OrderRecord[]
  filteredOrders: OrderRecord[]
  paginatedOrders: OrderRecord[]
  orderSearch: string
  orderStatusFilter: OrderStatus
  orderPage: number
  totalOrderPages: number
  orderPageSize: number
  setOrderSearch: (val: string) => void
  setOrderStatusFilter: (val: OrderStatus) => void
  setOrderPage: (page: number) => void
  onSelectOrder: (order: OrderRecord) => void
}

function renderOrderStatusBadge(status: OrderRecord['status']) {
  switch (status) {
    case 'PAID':
      return <StatusBadge status="LUNAS" fill="#00B894" icon="check_circle" textColor="#FFFFFF" />
    case 'PENDING':
      return <StatusBadge status="MENUNGGU" fill="#FFD23F" icon="pending" textColor="#000000" />
    case 'EXPIRED':
      return <StatusBadge status="KEDALUWARSA" fill="#DFE6E9" icon="history_toggle_off" textColor="#000000" />
    case 'CANCELLED':
      return <StatusBadge status="DIBATALKAN" fill="#FF6B6B" icon="cancel" textColor="#FFFFFF" />
    default:
      return <StatusBadge status={status} fill="#DFE6E9" icon="help" />
  }
}

export function OrdersTablePanel({
  orders,
  filteredOrders,
  paginatedOrders,
  orderSearch,
  orderStatusFilter,
  orderPage,
  totalOrderPages,
  orderPageSize,
  setOrderSearch,
  setOrderStatusFilter,
  setOrderPage,
  onSelectOrder,
}: OrdersTablePanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Mini KPI Cards */}
      <div className="tf-kpi-grid">
        <div className="tf-kpi-card" style={{ '--card-accent': '#00B894' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Pesanan Lunas</span>
            <span className="material-symbols-outlined" style={{ color: '#00B894' }}>check_circle</span>
          </div>
          <div className="tf-kpi-value">
            {orders.filter((o) => o.status === 'PAID').length} Pesanan
          </div>
          <div className="tf-kpi-footer">
            <span>Akses PDF aktif di perpustakaan</span>
          </div>
        </div>

        <div className="tf-kpi-card" style={{ '--card-accent': '#FFD23F' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Menunggu Bayar</span>
            <span className="material-symbols-outlined" style={{ color: '#E17055' }}>hourglass_top</span>
          </div>
          <div className="tf-kpi-value">
            {orders.filter((o) => o.status === 'PENDING').length} Tagihan
          </div>
          <div className="tf-kpi-footer">
            <span>Batas waktu bayar 15-30 menit</span>
          </div>
        </div>

        <div className="tf-kpi-card" style={{ '--card-accent': '#74B9FF' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Total Omzet Pesanan</span>
            <span className="material-symbols-outlined" style={{ color: '#74B9FF' }}>payments</span>
          </div>
          <div className="tf-kpi-value">
            Rp {orders.filter((o) => o.status === 'PAID').reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString('id-ID')}
          </div>
          <div className="tf-kpi-footer">
            <span>Dari seluruh pesanan lunas</span>
          </div>
        </div>

        <div className="tf-kpi-card" style={{ '--card-accent': '#FF6B6B' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Batal / Kedaluwarsa</span>
            <span className="material-symbols-outlined" style={{ color: '#FF6B6B' }}>cancel</span>
          </div>
          <div className="tf-kpi-value">
            {orders.filter((o) => ['EXPIRED', 'CANCELLED', 'FAILED'].includes(o.status)).length} Pesanan
          </div>
          <div className="tf-kpi-footer">
            <span>Tidak ada hak akses diterbitkan</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="tf-filter-bar">
        <div className="tf-filter-left">
          <SearchInput
            value={orderSearch}
            onChange={(val) => {
              setOrderSearch(val)
              setOrderPage(1)
            }}
            placeholder="Cari no. order, pelanggan, atau judul e-book..."
          />
          <FilterSelect
            label="Status"
            value={orderStatusFilter}
            onChange={(val) => {
              setOrderStatusFilter(val as OrderStatus)
              setOrderPage(1)
            }}
            options={[
              { value: 'ALL', label: 'Semua Status' },
              { value: 'PAID', label: 'Lunas (PAID)' },
              { value: 'PENDING', label: 'Menunggu (PENDING)' },
              { value: 'EXPIRED', label: 'Kedaluwarsa (EXPIRED)' },
              { value: 'CANCELLED', label: 'Dibatalkan (CANCELLED)' },
            ]}
          />
        </div>
        <div className="tf-filter-right">
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--nb-text-muted)' }}>
            Ditemukan {filteredOrders.length} pesanan
          </span>
        </div>
      </div>

      {/* Table of Orders (Zona C Padat Data) */}
      <div className="tf-table-card">
        <div className="tf-table-responsive">
          <table className="tf-table">
            <thead>
              <tr>
                <th>No. Pesanan</th>
                <th>Pelanggan</th>
                <th>Item E-Book</th>
                <th style={{ textAlign: 'right' }}>Total Tagihan</th>
                <th>Metode Pembayaran</th>
                <th>Status Pesanan</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 0 }}>
                    <EmptyState
                      icon="receipt_long"
                      title="Tidak Ada Pesanan Ditemukan"
                      description="Coba ubah kata kunci pencarian atau reset filter status pesanan."
                    />
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="tf-mono" style={{ color: '#0984E3' }}>
                        {order.orderNumber}
                      </span>
                      <div style={{ fontSize: 11, color: 'var(--nb-text-muted)' }}>
                        {order.createdAt}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{order.customerName}</div>
                      <div style={{ fontSize: 12, color: 'var(--nb-text-muted)' }}>
                        {order.customerEmail}
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: 260 }}>
                        {order.items.map((it, idx) => (
                          <div
                            key={idx}
                            style={{
                              fontWeight: 600,
                              fontSize: 13,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            • {it.title}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="tf-money">{order.totalAmountFormatted}</td>
                    <td>
                      <span style={{ fontSize: 13 }}>{order.paymentMethod}</span>
                      {order.paymentGatewayRef && (
                        <div className="tf-mono" style={{ fontSize: 10, color: 'var(--nb-text-muted)' }}>
                          Ref: {order.paymentGatewayRef}
                        </div>
                      )}
                    </td>
                    <td>{renderOrderStatusBadge(order.status)}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className="tf-action-btn"
                        onClick={() => onSelectOrder(order)}
                        title="Buka Detail Pesanan & Webhook Timeline"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>visibility</span>
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div style={{ padding: '12px 16px', borderTop: '2px solid #000000' }}>
            <Pagination
              currentPage={orderPage}
              totalPages={totalOrderPages}
              totalItems={filteredOrders.length}
              pageSize={orderPageSize}
              onPageChange={setOrderPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}
