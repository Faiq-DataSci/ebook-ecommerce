import { useState } from 'react'
import type { OrderRecord } from '../types/transactionFinance'

interface WebhookSimulatorCardProps {
  orders: OrderRecord[]
  onFireWebhook: (orderNumber: string, eventType: 'settlement' | 'expire' | 'cancel') => void
}

export function WebhookSimulatorCard({
  orders,
  onFireWebhook,
}: WebhookSimulatorCardProps) {
  const pendingOrders = orders.filter((o) => o.status === 'PENDING')
  const availableOrders = pendingOrders.length > 0 ? pendingOrders : orders

  const [selectedOrderNo, setSelectedOrderNo] = useState<string>(
    availableOrders[0]?.orderNumber ?? '',
  )
  const [eventType, setEventType] = useState<'settlement' | 'expire' | 'cancel'>('settlement')
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString('id-ID')}] Simulator Gateway Siap. Menunggu pemicu callback webhook.`,
  ])

  const targetOrder = orders.find((o) => o.orderNumber === selectedOrderNo) || availableOrders[0]

  const handleTrigger = () => {
    if (!targetOrder) return

    const timeStr = new Date().toLocaleTimeString('id-ID')
    const grossAmount = targetOrder.totalAmount.toFixed(2)

    const logEntry1 = `[${timeStr}] [REQ] POST /api/webhooks/midtrans HTTP/1.1 | Event: ${eventType.toUpperCase()} | Order: ${targetOrder.orderNumber}`
    const logEntry2 = `[${timeStr}] [SIG] Validating HMAC SHA512 Signature: 9e8a7c... [OK]`
    const logEntry3 = eventType === 'settlement'
      ? `[${timeStr}] [PAID] Order ${targetOrder.orderNumber} PAID (Rp ${grossAmount}). EbookAccess AKTIF & Signed URL tersedia.`
      : `[${timeStr}] [STATUS] Order ${targetOrder.orderNumber} diubah ke ${eventType.toUpperCase()}. Akses e-book dinonaktifkan.`
    const logEntry4 = `[${timeStr}] [HTTP] Response: 200 OK (Execution: 14ms)`

    setLogs((prev) => [logEntry4, logEntry3, logEntry2, logEntry1, ...prev].slice(0, 10))

    onFireWebhook(targetOrder.orderNumber, eventType)
  }

  return (
    <div className="tf-simulator-card">
      <div className="tf-simulator-top">
        <div className="tf-simulator-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              className="tf-badge"
              style={{ backgroundColor: 'var(--nb-yellow)', color: 'var(--nb-black)' }}
            >
              SANDBOX GATEWAY CONTROLLER
            </span>
            <span className="tf-badge-zone">AUDIT WEBHOOK</span>
          </div>
          <div className="tf-simulator-title">
            <span>Simulator Interaktif Webhook Payment Gateway (Midtrans HMAC SHA512)</span>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--nb-text-muted)', lineHeight: 1.4 }}>
            Pilih transaksi sasaran dan tipe event callback untuk menguji otomatisasi siklus pesanan, validasi anti-spoofing signature, dan aktivasi hak baca <code>EbookAccess</code>.
          </p>
        </div>
      </div>

      {/* Interactive Controls & Dispatcher */}
      <div className="tf-sim-controls">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label htmlFor="sim-order-select" className="tf-spec-label">
            Pilih Pesanan Sasaran:
          </label>
          <select
            id="sim-order-select"
            value={selectedOrderNo}
            onChange={(e) => setSelectedOrderNo(e.target.value)}
            style={{
              height: '40px',
              paddingInline: '10px',
              backgroundColor: 'var(--nb-white)',
              border: '2px solid var(--nb-black)',
              fontFamily: 'var(--font-heading)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {orders.map((o) => (
              <option key={o.id} value={o.orderNumber}>
                {o.orderNumber}: {o.customerName} ({o.status} • {o.totalAmountFormatted})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label htmlFor="sim-event-select" className="tf-spec-label">
            Tipe Callback Event Webhook:
          </label>
          <select
            id="sim-event-select"
            value={eventType}
            onChange={(e) => setEventType(e.target.value as 'settlement' | 'expire' | 'cancel')}
            style={{
              height: '40px',
              paddingInline: '10px',
              backgroundColor: 'var(--nb-white)',
              border: '2px solid var(--nb-black)',
              fontFamily: 'var(--font-heading)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <option value="settlement">settlement (Pembayaran Lunas & Hak Baca Aktif)</option>
            <option value="expire">expire (Batas Waktu Bayar Habis)</option>
            <option value="cancel">cancel (Pembatalan Pesanan / Void)</option>
          </select>
        </div>

        <button
          type="button"
          className="tf-action-btn"
          style={{
            backgroundColor: eventType === 'settlement' ? 'var(--nb-green)' : eventType === 'expire' ? 'var(--nb-yellow)' : 'var(--nb-pink)',
            color: eventType === 'settlement' || eventType === 'cancel' ? 'var(--nb-white)' : 'var(--nb-black)',
            minHeight: '40px',
            padding: '0 20px',
            fontSize: '13px',
          }}
          onClick={handleTrigger}
        >
          <span>Kirim Callback Webhook</span>
        </button>
      </div>

      {/* Terminal Live Simulation Log */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span className="tf-spec-label">Live Gateway Console Output:</span>
          <span className="tf-mono" style={{ fontSize: '10.5px', color: 'var(--nb-text-muted)' }}>
            Real-time Terminal (HMAC SHA512)
          </span>
        </div>
        <div className="tf-sim-log-terminal">
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
