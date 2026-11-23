import type { OrderRecord } from '../types/transactionFinance'
import { StatusBadge } from '../../../shared/components/ui'
import { EbookAccessControlPanel } from './EbookAccessControlPanel'
import { OrderWebhookTimeline } from './OrderWebhookTimeline'

interface OrderDetailModalProps {
  order: OrderRecord
  onClose: () => void
  onToggleAccess: (order: OrderRecord) => void
}

export function OrderDetailModal({
  order,
  onClose,
  onToggleAccess,
}: OrderDetailModalProps) {
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
      case 'FAILED':
        return <StatusBadge status="GAGAL" fill="#FF6B6B" icon="error" textColor="#FFFFFF" />
    }
  }

  return (
    <div className="tf-modal-overlay" onClick={onClose}>
      <div className="tf-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="tf-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 24 }}>receipt_long</span>
            <span className="tf-modal-title">Rincian Pesanan {order.orderNumber}</span>
          </div>
          <button
            type="button"
            className="tf-action-btn"
            style={{ width: 32, height: 32, padding: 0, justifyContent: 'center' }}
            onClick={onClose}
            aria-label="Tutup Dialog"
          >
            ✕
          </button>
        </div>

        <div className="tf-modal-body">
          {/* Order Quick Summary */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
              paddingBottom: 12,
              borderBottom: '2px solid #000000',
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: 'var(--nb-text-muted)' }}>Status Pesanan:</div>
              <div style={{ marginTop: 4 }}>{renderOrderStatusBadge(order.status)}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--nb-text-muted)' }}>Total Pembayaran:</div>
              <div className="tf-mono" style={{ fontSize: 18, color: '#00B894' }}>
                {order.totalAmountFormatted}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--nb-text-muted)' }}>Waktu Transaksi:</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{order.createdAt}</div>
            </div>
          </div>

          {/* Customer Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--nb-text-muted)' }}>NAMA PEMBELI</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{order.customerName}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--nb-text-muted)' }}>EMAIL AKUN</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{order.customerEmail}</div>
            </div>
          </div>

          {/* Items Purchased */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 8 }}>
              Daftar E-Book yang Dipesan ({order.items.length})
            </div>
            <div style={{ border: '2px solid #000000', backgroundColor: '#F8F9FA' }}>
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: idx < order.items.length - 1 ? '1px solid #000000' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {item.coverUrl ? (
                      <img
                        src={item.coverUrl}
                        alt={item.title}
                        style={{ width: 36, height: 48, objectFit: 'cover', border: '1.5px solid #000000' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 36,
                          height: 48,
                          backgroundColor: 'var(--nb-yellow)',
                          border: '1.5px solid #000000',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        📖
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--nb-text-muted)' }}>Penulis: {item.author}</div>
                    </div>
                  </div>
                  <div className="tf-mono">{item.priceFormatted}</div>
                </div>
              ))}
            </div>
          </div>

          {/* EbookAccess Control Panel */}
          <EbookAccessControlPanel order={order} onToggleAccess={onToggleAccess} />

          {/* Order Webhook Timeline */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>
              Garis Waktu Notifikasi &amp; Siklus Pesanan (`OrderWebhookTimeline`)
            </div>
            <OrderWebhookTimeline timeline={order.timeline} />
          </div>
        </div>

        <div className="tf-modal-footer">
          <button
            type="button"
            className="tf-action-btn"
            style={{ backgroundColor: 'var(--nb-yellow)' }}
            onClick={onClose}
          >
            Tutup Dialog
          </button>
        </div>
      </div>
    </div>
  )
}
