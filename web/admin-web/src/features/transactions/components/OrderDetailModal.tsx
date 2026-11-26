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
        return <StatusBadge status="LUNAS" fill="var(--nb-green)" textColor="var(--nb-white)" />
      case 'PENDING':
        return <StatusBadge status="MENUNGGU" fill="var(--nb-yellow)" textColor="var(--nb-black)" />
      case 'EXPIRED':
        return <StatusBadge status="KEDALUWARSA" fill="var(--nb-muted)" textColor="var(--nb-black)" />
      case 'CANCELLED':
        return <StatusBadge status="DIBATALKAN" fill="var(--nb-pink)" textColor="var(--nb-white)" />
      case 'FAILED':
        return <StatusBadge status="GAGAL" fill="var(--nb-pink)" textColor="var(--nb-white)" />
    }
  }

  const initialLetter = order.customerName.charAt(0).toUpperCase() || 'P'

  return (
    <div className="tf-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="tf-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="tf-modal-header">
          <span className="tf-modal-title">Rincian Pesanan {order.orderNumber}</span>
          <button
            type="button"
            className="tf-action-btn"
            style={{ height: 34, padding: '0 12px', fontSize: 12 }}
            onClick={onClose}
            aria-label="Tutup Dialog"
          >
            Tutup
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
              gap: 14,
              paddingBottom: 14,
              borderBottom: '2px solid var(--nb-black)',
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--nb-text-muted)', textTransform: 'uppercase' }}>
                Status Pesanan:
              </div>
              <div style={{ marginTop: 4 }}>{renderOrderStatusBadge(order.status)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--nb-text-muted)', textTransform: 'uppercase' }}>
                Total Tagihan:
              </div>
              <div className="tf-mono" style={{ fontSize: 20, color: 'var(--nb-black)' }}>
                {order.totalAmountFormatted}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--nb-text-muted)', textTransform: 'uppercase' }}>
                Waktu Transaksi:
              </div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{order.createdAt}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--nb-text-muted)', textTransform: 'uppercase' }}>
                Metode Pembayaran:
              </div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{order.paymentMethod}</div>
            </div>
          </div>

          {/* Customer Info Card */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              backgroundColor: 'var(--nb-paper)',
              border: '2px solid var(--nb-black)',
              boxShadow: '2px 2px 0px var(--nb-black)',
            }}
          >
            <span
              className="tf-avatar-badge"
              style={{ width: 40, height: 40, fontSize: 16 }}
            >
              {initialLetter}
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flex: 1 }}>
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--nb-text-muted)', textTransform: 'uppercase' }}>
                  NAMA PELANGGAN
                </div>
                <div style={{ fontSize: 14, fontWeight: 800 }}>{order.customerName}</div>
              </div>
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--nb-text-muted)', textTransform: 'uppercase' }}>
                  EMAIL AKUN
                </div>
                <div className="tf-mono" style={{ fontSize: 13 }}>{order.customerEmail}</div>
              </div>
            </div>
          </div>

          {/* Items Purchased */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 8 }}>
              Daftar E-Book yang Dipesan ({order.items.length})
            </div>
            <div style={{ border: '2px solid var(--nb-black)', backgroundColor: 'var(--nb-white)', boxShadow: '2px 2px 0px var(--nb-black)' }}>
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    borderBottom: idx < order.items.length - 1 ? '1.5px solid var(--nb-black)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {item.coverUrl ? (
                      <img
                        src={item.coverUrl}
                        alt={item.title}
                        style={{ width: 36, height: 48, objectFit: 'cover', border: '1.5px solid var(--nb-black)' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 36,
                          height: 48,
                          backgroundColor: 'var(--nb-yellow)',
                          border: '1.5px solid var(--nb-black)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-mono)',
                          fontSize: 10,
                          fontWeight: 800,
                        }}
                      >
                        PDF
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 13.5 }}>{item.title}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--nb-text-muted)' }}>
                        Penulis: {item.author} • Format Digital PDF
                      </div>
                    </div>
                  </div>
                  <div className="tf-mono" style={{ fontSize: 14 }}>{item.priceFormatted}</div>
                </div>
              ))}
            </div>
          </div>

          {/* EbookAccess Control Panel */}
          <EbookAccessControlPanel order={order} onToggleAccess={onToggleAccess} />

          {/* Order Webhook Timeline */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>
              Garis Waktu Siklus Pesanan &amp; Webhook Gateway
            </div>
            <OrderWebhookTimeline timeline={order.timeline} />
          </div>
        </div>

        <div className="tf-modal-footer">
          <button
            type="button"
            className="tf-action-btn"
            style={{ backgroundColor: 'var(--nb-yellow)', minHeight: '38px', padding: '0 20px' }}
            onClick={onClose}
          >
            Tutup Dialog
          </button>
        </div>
      </div>
    </div>
  )
}
