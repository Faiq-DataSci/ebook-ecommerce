import { useCallback, useEffect, useState } from 'react'
import {
  ConfirmDialog,
  TableSkeleton,
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
import {
  fetchAdminTransactionsData,
  toggleAdminOrderAccess,
} from '../services/transactionAdmin.service'
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

  // State: Data Source & Loading
  const [dataSource, setDataSource] = useState<'LIVE' | 'SIMULATION' | 'UNAVAILABLE'>('LIVE')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // State: Orders Tab
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [orderSearch, setOrderSearch] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus>('ALL')
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null)
  const [orderPage, setOrderPage] = useState(1)
  const orderPageSize = 5

  // State: Payments Tab
  const [payments, setPayments] = useState<PaymentAuditRecord[]>([])
  const [paymentSearch, setPaymentSearch] = useState('')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatus>('ALL')
  const [selectedPaymentPayload, setSelectedPaymentPayload] = useState<PaymentAuditRecord | null>(null)

  // State: Feedback & Dialogs
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const showToast = useCallback((type: ToastMessage['type'], text: string) => {
    setToasts((prev) => [
      ...prev,
      { id: 'toast-' + Date.now() + Math.random(), type, text },
    ])
  }, [])
  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const loadTransactions = useCallback(
    async (showFeedback = false) => {
      setIsLoading(true)
      setErrorMessage(null)
      try {
        const res = await fetchAdminTransactionsData()
        setOrders(res.orders)
        setPayments(res.payments)
        setDataSource('LIVE')
        if (showFeedback) {
          showToast('info', 'Data transaksi dan audit pembayaran berhasil disinkronkan dari server.')
        }
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Gagal memuat data transaksi dari server backend.'
        setErrorMessage(msg)
        setDataSource('UNAVAILABLE')
        setOrders([])
        setPayments([])
        if (showFeedback) {
          showToast('error', msg)
        }
      } finally {
        setIsLoading(false)
      }
    },
    [showToast],
  )

  useEffect(() => {
    let mounted = true
    fetchAdminTransactionsData()
      .then((res) => {
        if (!mounted) return
        setOrders(res.orders)
        setPayments(res.payments)
        setDataSource('LIVE')
        setErrorMessage(null)
      })
      .catch((err: unknown) => {
        if (!mounted) return
        const msg =
          err instanceof Error
            ? err.message
            : 'Gagal memuat data transaksi dari server backend.'
        setErrorMessage(msg)
        setDataSource('UNAVAILABLE')
        setOrders([])
        setPayments([])
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  const handleEnableSimulation = () => {
    setOrders(INITIAL_ORDERS_DATA)
    setPayments(INITIAL_PAYMENTS_DATA)
    setDataSource('SIMULATION')
    setErrorMessage(null)
    showToast('info', 'Menampilkan pratinjau DATA SIMULASI lokal.')
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
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, open: false }))
        const nextRevoked = !isRevoked

        if (dataSource === 'LIVE') {
          try {
            const res = await toggleAdminOrderAccess(order.id, nextRevoked)
            setOrders((prev) =>
              prev.map((o) => (o.id === order.id ? res.order : o)),
            )
            if (selectedOrder && selectedOrder.id === order.id) {
              setSelectedOrder(res.order)
            }
            showToast(nextRevoked ? 'info' : 'success', res.message)
          } catch (err: unknown) {
            const msg =
              err instanceof Error
                ? err.message
                : 'Gagal memperbarui hak akses digital pada server.'
            showToast('error', msg)
          }
          return
        }

        setOrders((prev) =>
          prev.map((o) =>
            o.id === order.id
              ? {
                  ...o,
                  ebookAccessRevoked: nextRevoked,
                  timeline: [
                    ...o.timeline,
                    {
                      stage: isRevoked ? 'Hak Akses Dipulihkan' : 'Hak Akses Dicabut Admin',
                      timestamp: 'Baru saja',
                      description: isRevoked
                        ? 'Admin memulihkan kembali hak akses membaca PDF (DATA SIMULASI).'
                        : 'Admin mencabut hak akses EbookAccess (DATA SIMULASI).',
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
                  ebookAccessRevoked: nextRevoked,
                }
              : null,
          )
        }
        showToast(
          isRevoked ? 'success' : 'info',
          `Status hak akses digital pesanan ${order.orderNumber} diperbarui (DATA SIMULASI).`,
        )
      },
    })
  }

  // Action: Simulate Webhook Payment
  const handleSimulateWebhook = (
    targetOrderNumber?: string,
    eventType: 'settlement' | 'expire' | 'cancel' = 'settlement',
  ) => {
    const targetOrder = targetOrderNumber
      ? orders.find((o) => o.orderNumber === targetOrderNumber)
      : orders.find((o) => o.status === 'PENDING')

    if (!targetOrder) {
      showToast(
        'info',
        'Pesanan yang dipilih tidak ditemukan.',
      )
      return
    }

    const nowFormatted = '23 Nov 2026, ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
    
    // Update order
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== targetOrder.id) return o

        if (eventType === 'settlement') {
          return {
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
        } else if (eventType === 'expire') {
          return {
            ...o,
            status: 'EXPIRED',
            ebookAccessGranted: false,
            timeline: [
              ...o.timeline,
              {
                stage: 'Webhook Expire Diterima',
                timestamp: nowFormatted,
                description: 'Batas waktu pembayaran habis. Tagihan dibatalkan oleh gateway.',
                status: 'failed',
                meta: 'Simulator Gateway: HTTP 200 OK',
              },
            ],
          }
        } else {
          return {
            ...o,
            status: 'CANCELLED',
            ebookAccessGranted: false,
            ebookAccessRevoked: true,
            timeline: [
              ...o.timeline,
              {
                stage: 'Webhook Cancel Diterima',
                timestamp: nowFormatted,
                description: 'Pesanan dibatalkan/void oleh payment gateway.',
                status: 'failed',
                meta: 'Simulator Gateway: HTTP 200 OK',
              },
            ],
          }
        }
      }),
    )

    // Update payment audit
    setPayments((prev) =>
      prev.map((p) => {
        if (p.orderNumber !== targetOrder.orderNumber) return p
        return {
          ...p,
          status: eventType === 'settlement' ? 'VERIFIED' : eventType === 'expire' ? 'EXPIRED' : 'FAILED',
          receivedAt: nowFormatted,
          rawWebhookPayload: {
            ...p.rawWebhookPayload,
            transaction_status: eventType,
            status_code: eventType === 'settlement' ? '200' : '407',
          },
        }
      }),
    )

    showToast(
      'success',
      `Webhook callback (${eventType.toUpperCase()}) untuk pesanan ${targetOrder.orderNumber} berhasil diproses.`,
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

  const pendingPaymentsCount = payments.filter((p) => p.status === 'PENDING').length
  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING').length

  return (
    <div className="tf-page-container">
      {/* Page Header (Neubrutalism Zona C) */}
      <div className="tf-page-header">
        <div className="tf-title-group">
          <div className="tf-header-title-row">
            <span
              className="tf-badge"
              style={{ backgroundColor: 'var(--nb-blue)', color: 'var(--nb-white)' }}
            >
              OPERASIONAL TRANSAKSI
            </span>
            <span className="tf-badge-zone">ZONA C: PADAT DATA</span>
            {dataSource === 'SIMULATION' && (
              <span className="tf-badge-simulation">DATA SIMULASI</span>
            )}
          </div>
          <h1 className="tf-page-title">Transaksi &amp; Pemenuhan Pesanan</h1>
          <p className="tf-page-subtitle">
            Pelacakan Pesanan B2C, Hak Akses E-Book Digital (<code>EbookAccess</code>), &amp; Audit Webhook Payment Gateway
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="tf-action-btn"
            style={{ minHeight: '40px', padding: '0 16px', backgroundColor: 'var(--nb-white)' }}
            onClick={() => void loadTransactions(true)}
            disabled={isLoading}
            title="Segarkan Data Transaksi dari Backend"
          >
            <span>{isLoading ? 'Memuat...' : 'Segarkan'}</span>
          </button>

          <button
            type="button"
            className="tf-action-btn"
            style={{ minHeight: '40px', padding: '0 16px', backgroundColor: 'var(--nb-white)' }}
            onClick={() => onNavigate?.('/admin/keuangan/laporan')}
            title="Buka Modul Keuangan & Pembukuan Kas"
          >
            <span>Buka Keuangan &amp; Kas</span>
          </button>

          <button
            type="button"
            className="tf-action-btn"
            style={{ minHeight: '40px', padding: '0 16px', backgroundColor: 'var(--nb-yellow)' }}
            onClick={handleExportCSV}
            disabled={orders.length === 0}
            title="Ekspor CSV Pesanan"
          >
            <span>Unduh Rekap CSV</span>
          </button>
        </div>
      </div>

      {errorMessage && dataSource === 'UNAVAILABLE' && (
        <section className="sys-banner is-error" role="alert">
          <div className="sys-banner-body">
            <h2 className="sys-banner-title">
              Gagal memuat data transaksi dari backend
            </h2>
            <p className="sys-banner-text">{errorMessage}</p>
          </div>
          <div className="sys-banner-actions">
            <button
              type="button"
              className="sys-btn sys-btn-primary nb-btn"
              onClick={() => void loadTransactions(true)}
            >
              Coba Lagi
            </button>
            <button
              type="button"
              className="sys-btn nb-btn"
              onClick={handleEnableSimulation}
            >
              Lihat DATA SIMULASI
            </button>
          </div>
        </section>
      )}

      {/* Sub-Navigation Tabs Strip */}
      <div className="tf-nav-tabs" role="tablist" aria-label="Navigasi Submenu Transaksi">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'pesanan'}
          className={`tf-tab-btn ${activeTab === 'pesanan' ? 'is-active' : ''}`}
          onClick={() => handleTabChange('pesanan')}
        >
          <span>Semua Pesanan</span>
          <span className="tf-tab-badge">{orders.length} Pesanan</span>
          {pendingOrdersCount > 0 && (
            <span className="tf-tab-badge tf-tab-badge-pending">
              {pendingOrdersCount} Menunggu
            </span>
          )}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'verifikasi'}
          className={`tf-tab-btn ${activeTab === 'verifikasi' ? 'is-active' : ''}`}
          onClick={() => handleTabChange('verifikasi')}
        >
          <span>Verifikasi &amp; Webhook</span>
          <span className="tf-tab-badge">{payments.length} Callback</span>
          {pendingPaymentsCount > 0 ? (
            <span className="tf-tab-badge tf-tab-badge-pending">
              {pendingPaymentsCount} Pending
            </span>
          ) : (
            <span
              className="tf-tab-badge"
              style={{ backgroundColor: 'var(--nb-green)', color: 'var(--nb-white)' }}
            >
              100% Valid
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: SEMUA PESANAN */}
      {activeTab === 'pesanan' &&
        (isLoading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : (
          <OrdersTablePanel
            orders={orders}
            filteredOrders={filteredOrders}
            orderSearch={orderSearch}
            orderStatusFilter={orderStatusFilter}
            orderPage={orderPage}
            orderPageSize={orderPageSize}
            setOrderSearch={setOrderSearch}
            setOrderStatusFilter={setOrderStatusFilter}
            setOrderPage={setOrderPage}
            onSelectOrder={setSelectedOrder}
          />
        ))}

      {/* TAB 2: VERIFIKASI BAYAR & WEBHOOK */}
      {activeTab === 'verifikasi' &&
        (isLoading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : (
          <PaymentsTablePanel
            orders={orders}
            payments={payments}
            filteredPayments={filteredPayments}
            paymentSearch={paymentSearch}
            paymentStatusFilter={paymentStatusFilter}
            setPaymentSearch={setPaymentSearch}
            setPaymentStatusFilter={setPaymentStatusFilter}
            onSimulateWebhook={handleSimulateWebhook}
            onSelectPaymentPayload={setSelectedPaymentPayload}
          />
        ))}

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
        <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.5 }}>
          {confirmDialog.description}
        </p>
      </ConfirmDialog>

      {/* Toasts */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
