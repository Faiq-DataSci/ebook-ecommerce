import { useState } from 'react'
import {
  ConfirmDialog,
  Toast,
  type ToastMessage,
} from '../../../shared/components/ui'
import { OrderDetailModal } from '../components/OrderDetailModal'
import { OrdersTablePanel } from '../components/OrdersTablePanel'
import { PaymentsTablePanel } from '../components/PaymentsTablePanel'
import { RawWebhookModal } from '../components/RawWebhookModal'
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

interface TransactionFinancePageProps {
  currentPath?: string
  onNavigate?: (path: string) => void
}

export function TransactionFinancePage({
  currentPath = '/admin/transaksi/pesanan',
  onNavigate,
}: TransactionFinancePageProps) {
  // Derive active tab directly from route path
  const activeTab: TransactionTab = currentPath.includes('/verifikasi')
    ? 'verifikasi'
    : 'pesanan'

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

      {/* TAB 1: SEMUA PESANAN */}
      {activeTab === 'pesanan' && (
        <OrdersTablePanel
          orders={orders}
          filteredOrders={filteredOrders}
          paginatedOrders={paginatedOrders}
          orderSearch={orderSearch}
          orderStatusFilter={orderStatusFilter}
          orderPage={orderPage}
          totalOrderPages={totalOrderPages}
          orderPageSize={orderPageSize}
          setOrderSearch={setOrderSearch}
          setOrderStatusFilter={setOrderStatusFilter}
          setOrderPage={setOrderPage}
          onSelectOrder={setSelectedOrder}
        />
      )}

      {/* TAB 2: VERIFIKASI BAYAR */}
      {activeTab === 'verifikasi' && (
        <PaymentsTablePanel
          payments={payments}
          filteredPayments={filteredPayments}
          paymentSearch={paymentSearch}
          paymentStatusFilter={paymentStatusFilter}
          setPaymentSearch={setPaymentSearch}
          setPaymentStatusFilter={setPaymentStatusFilter}
          onSimulateWebhook={handleSimulateWebhook}
          onSelectPaymentPayload={setSelectedPaymentPayload}
        />
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
