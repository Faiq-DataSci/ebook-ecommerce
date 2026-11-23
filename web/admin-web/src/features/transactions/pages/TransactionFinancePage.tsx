import { useState, type CSSProperties } from 'react'
import {
  ConfirmDialog,
  EmptyState,
  FilterSelect,
  Pagination,
  SearchInput,
  StatusBadge,
  Toast,
  type ToastMessage,
} from '../../../shared/components/ui'
import {
  INITIAL_ORDERS_DATA,
  INITIAL_PAYMENTS_DATA,
} from '../data/transactionFinanceData'
import type {
  OrderRecord,
  OrderStatus,
  PaymentAuditRecord,
  PaymentStatus,
  TransactionTab,
} from '../types/transactionFinance'
import { OrderDetailModal } from '../components/OrderDetailModal'
import { RawWebhookModal } from '../components/RawWebhookModal'

interface TransactionFinancePageProps {
  currentPath?: string
  onNavigate?: (path: string) => void
}

export function TransactionFinancePage({
  currentPath = '/admin/transaksi/pesanan',
  onNavigate,
}: TransactionFinancePageProps) {
  // Derive active tab directly from route path (single source of truth)
  const activeTab: TransactionTab = currentPath.includes('/verifikasi')
    ? 'verifikasi'
    : 'pesanan'

  // Sync tab with route if user clicks internal tab buttons
  const handleTabChange = (tab: TransactionTab) => {
    if (onNavigate) {
      if (tab === 'pesanan') onNavigate('/admin/transaksi/pesanan')
      else if (tab === 'verifikasi') onNavigate('/admin/transaksi/verifikasi')
    }
  }

  // State: Orders Tab
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS_DATA)
  const [orderSearch, setOrderSearch] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus>('ALL')
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null)
  const [orderPage, setOrderPage] = useState(1)
  const orderPageSize = 5

  // State: Payments Tab
  const [payments, setPayments] = useState<PaymentAuditRecord[]>(INITIAL_PAYMENTS_DATA)
  const [paymentSearch, setPaymentSearch] = useState('')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatus>('ALL')
  const [selectedPaymentPayload, setSelectedPaymentPayload] = useState<PaymentAuditRecord | null>(null)

  // State: Feedback & Dialogs
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

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    description: string
    confirmLabel: string
    confirmVariant: 'danger' | 'primary'
    onConfirm: () => void
  }>({
    open: false,
    title: '',
    description: '',
    confirmLabel: '',
    confirmVariant: 'danger',
    onConfirm: () => {},
  })

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.items.some((i) => i.title.toLowerCase().includes(orderSearch.toLowerCase()))
    const matchesStatus =
      orderStatusFilter === 'ALL' || order.status === orderStatusFilter
    return matchesSearch && matchesStatus
  })

  const totalOrderPages = Math.ceil(filteredOrders.length / orderPageSize) || 1
  const paginatedOrders = filteredOrders.slice(
    (orderPage - 1) * orderPageSize,
    orderPage * orderPageSize,
  )

  // Filtered Payments
  const filteredPayments = payments.filter((pay) => {
    const matchesSearch =
      pay.paymentCode.toLowerCase().includes(paymentSearch.toLowerCase()) ||
      pay.orderNumber.toLowerCase().includes(paymentSearch.toLowerCase()) ||
      pay.customerName.toLowerCase().includes(paymentSearch.toLowerCase()) ||
      pay.externalRef.toLowerCase().includes(paymentSearch.toLowerCase())
    const matchesStatus =
      paymentStatusFilter === 'ALL' || pay.status === paymentStatusFilter
    return matchesSearch && matchesStatus
  })

  // Action: Toggle Ebook Access (Revoke / Restore)
  const handleToggleAccess = (order: OrderRecord) => {
    const isRevoked = order.ebookAccessRevoked
    setConfirmDialog({
      open: true,
      title: isRevoked ? `Pulihkan Hak Akses #${order.orderNumber}?` : `Cabut Hak Akses #${order.orderNumber}?`,
      description: isRevoked
        ? `Akses membaca PDF akan diaktifkan kembali untuk pelanggan ${order.customerName}. Pelanggan dapat membuka e-book di perpustakaan digital.`
        : `Mencabut akses akan menonaktifkan izin unduh/baca PDF pelanggan ${order.customerName} pada buku ini. Tindakan ini dicatat pada audit log.`,
      confirmLabel: isRevoked ? 'Pulihkan Akses' : 'Cabut Akses',
      confirmVariant: isRevoked ? 'primary' : 'danger',
      onConfirm: () => {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === order.id
              ? {
                  ...o,
                  ebookAccessRevoked: !isRevoked,
                  timeline: [
                    ...o.timeline,
                    {
                      stage: isRevoked ? 'Hak Akses Dipulihkan' : 'Hak Akses Dicabut Admin',
                      timestamp: 'Baru saja',
                      description: isRevoked
                        ? 'Admin memulihkan kembali hak akses membaca PDF.'
                        : 'Admin mencabut hak akses EbookAccess (penanganan sengketa).',
                      status: isRevoked ? 'completed' : 'failed',
                    },
                  ],
                }
              : o,
          ),
        )
        if (selectedOrder && selectedOrder.id === order.id) {
          setSelectedOrder((prev) =>
            prev
              ? {
                  ...prev,
                  ebookAccessRevoked: !isRevoked,
                }
              : null,
          )
        }
        showToast(
          isRevoked ? 'success' : 'info',
          `Status hak akses digital pesanan ${order.orderNumber} telah diperbarui.`,
        )
        setConfirmDialog((prev) => ({ ...prev, open: false }))
      },
    })
  }

  // Action: Simulate Webhook Payment
  const handleSimulateWebhook = () => {
    const pendingOrder = orders.find((o) => o.status === 'PENDING')
    if (!pendingOrder) {
      showToast(
        'info',
        'Seluruh pesanan simulasi saat ini telah lunas atau selesai diproses.',
      )
      return
    }

    const nowFormatted = '23 Nov 2026, ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
    
    // Update order
    setOrders((prev) =>
      prev.map((o) =>
        o.id === pendingOrder.id
          ? {
              ...o,
              status: 'PAID',
              paidAt: nowFormatted,
              ebookAccessGranted: true,
              ebookAccessRevoked: false,
              timeline: [
                ...o.timeline,
                {
                  stage: 'Webhook Settlement Diterima',
                  timestamp: nowFormatted,
                  description: 'Notifikasi pembayaran lunas (settlement) terverifikasi dengan signature HMAC SHA512.',
                  status: 'completed',
                  meta: 'Simulator Gateway: HTTP 200 OK',
                },
                {
                  stage: 'Hak Akses E-Book Diaktifkan',
                  timestamp: nowFormatted,
                  description: 'EbookAccess aktif di database. Signed URL baca PDF tersedia.',
                  status: 'completed',
                },
              ],
            }
          : o,
      ),
    )

    // Update payment audit
    setPayments((prev) =>
      prev.map((p) =>
        p.orderNumber === pendingOrder.orderNumber
          ? {
              ...p,
              status: 'VERIFIED',
              receivedAt: nowFormatted,
              rawWebhookPayload: {
                ...p.rawWebhookPayload,
                transaction_status: 'settlement',
                status_code: '200',
              },
            }
          : p,
      ),
    )

    showToast(
      'success',
      `Pesanan ${pendingOrder.orderNumber} berhasil dilunasi & EbookAccess diaktifkan.`,
    )
  }

  // Action: Export CSV
  const handleExportCSV = () => {
    const headers = ['Nomor Pesanan', 'Pelanggan', 'Email', 'Item Buku', 'Total (Rp)', 'Metode Bayar', 'Status']
    const rows = orders.map((o) => [
      o.orderNumber,
      `"${o.customerName}"`,
      o.customerEmail,
      `"${o.items.map((i) => i.title).join('; ')}"`,
      o.totalAmount,
      `"${o.paymentMethod}"`,
      o.status,
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `rekap-transaksi-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showToast(
      'success',
      'Berkas rekap transaksi CSV berhasil diunduh ke komputer Anda.',
    )
  }

  // Helpers for StatusBadges
  const renderOrderStatusBadge = (status: OrderRecord['status']) => {
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

  const renderPaymentStatusBadge = (status: PaymentAuditRecord['status']) => {
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

  return (
    <div className="tf-page-container">
      {/* Page Header */}
      <div className="tf-page-header">
        <div className="tf-title-group">
          <div className="tf-header-title-row">
            <span
              className="tf-badge"
              style={{ backgroundColor: '#74B9FF', color: '#000000' }}
            >
              OPERASIONAL TRANSAKSI
            </span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--nb-text-muted)' }}>
              DATA SIMULASI
            </span>
          </div>
          <h1 className="tf-page-title">Transaksi &amp; Pemenuhan Pesanan</h1>
          <p className="tf-page-subtitle">
            Pelacakan Pesanan Pelanggan, Hak Akses E-Book Digital (EbookAccess), &amp; Audit Webhook Gateway
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="tf-action-btn"
            style={{ height: '40px', padding: '0 16px', backgroundColor: 'var(--nb-white)' }}
            onClick={() => onNavigate?.('/admin/keuangan/laporan')}
            title="Buka Modul Keuangan & Pembukuan Kas"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#00B894' }}>payments</span>
            <span>Buka Keuangan &amp; Kas</span>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
          </button>

          <button
            type="button"
            className="tf-action-btn"
            style={{ height: '40px', padding: '0 16px', backgroundColor: 'var(--nb-yellow)' }}
            onClick={handleExportCSV}
            title="Ekspor CSV Pesanan"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>file_download</span>
            <span>Unduh Rekap CSV</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation Strip */}
      <div className="tf-nav-tabs" role="tablist" aria-label="Navigasi Submenu Transaksi">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'pesanan'}
          className={`tf-tab-btn ${activeTab === 'pesanan' ? 'is-active' : ''}`}
          onClick={() => handleTabChange('pesanan')}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>shopping_bag</span>
          <span>Semua Pesanan</span>
          <span className="tf-tab-badge">{orders.length}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'verifikasi'}
          className={`tf-tab-btn ${activeTab === 'verifikasi' ? 'is-active' : ''}`}
          onClick={() => handleTabChange('verifikasi')}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>fact_check</span>
          <span>Verifikasi Bayar &amp; Webhook</span>
          <span
            className="tf-tab-badge"
            style={{ backgroundColor: payments.some((p) => p.status === 'PENDING') ? '#FF6B6B' : '#000000' }}
          >
            {payments.filter((p) => p.status === 'PENDING').length} Pending
          </span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: SEMUA PESANAN
          ========================================================================= */}
      {activeTab === 'pesanan' && (
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
                              <div key={idx} style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                            onClick={() => setSelectedOrder(order)}
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
      )}

      {/* =========================================================================
          TAB 2: VERIFIKASI BAYAR (PAYMENT GATEWAY AUDIT)
          ========================================================================= */}
      {activeTab === 'verifikasi' && (
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
              onClick={handleSimulateWebhook}
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
                            onClick={() => setSelectedPaymentPayload(pay)}
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
      )}

      {/* ORDER DETAIL MODAL */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onToggleAccess={handleToggleAccess}
        />
      )}

      {/* RAW WEBHOOK JSON PAYLOAD MODAL */}
      {selectedPaymentPayload && (
        <RawWebhookModal
          payment={selectedPaymentPayload}
          onClose={() => setSelectedPaymentPayload(null)}
          onCopyJson={() => {
            navigator.clipboard.writeText(
              JSON.stringify(selectedPaymentPayload.rawWebhookPayload, null, 2),
            )
            showToast('success', 'Payload webhook berhasil disalin ke clipboard.')
          }}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        confirmLabel={confirmDialog.confirmLabel}
        confirmVariant={confirmDialog.confirmVariant}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
      >
        <p style={{ margin: 0 }}>{confirmDialog.description}</p>
      </ConfirmDialog>

      {/* Toast Notification */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
