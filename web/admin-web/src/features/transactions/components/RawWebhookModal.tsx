import type { PaymentAuditRecord } from '../types/transactionFinance'

interface RawWebhookModalProps {
  payment: PaymentAuditRecord
  onClose: () => void
  onCopyJson: () => void
}

export function RawWebhookModal({
  payment,
  onClose,
  onCopyJson,
}: RawWebhookModalProps) {
  return (
    <div className="tf-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="tf-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="tf-modal-header">
          <span className="tf-modal-title">Raw Callback JSON: {payment.paymentCode}</span>
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
          <div style={{ fontSize: 13, lineHeight: 1.5 }}>
            Notifikasi payload callback resmi dari payment gateway <strong>{payment.provider}</strong> yang diterima dan divalidasi oleh backend Express:
          </div>

          <pre className="tf-json-box">
            {JSON.stringify(payment.rawWebhookPayload, null, 2)}
          </pre>

          <div
            style={{
              fontSize: 12.5,
              padding: '10px 14px',
              backgroundColor: 'var(--nb-paper)',
              border: '1.5px solid var(--nb-black)',
            }}
          >
            <span>
              Token <strong>x-callback-token</strong> cocok dengan <code>PAYMENT_GATEWAY_WEBHOOK_SECRET</code> backend (Xendit). Payload terotentikasi dan anti-tampering.
            </span>
          </div>
        </div>

        <div className="tf-modal-footer">
          <button
            type="button"
            className="tf-action-btn"
            style={{ backgroundColor: 'var(--nb-yellow)', minHeight: '38px', padding: '0 18px' }}
            onClick={onCopyJson}
          >
            <span>Salin JSON Payload</span>
          </button>
          <button
            type="button"
            className="tf-action-btn"
            style={{ minHeight: '38px', padding: '0 18px' }}
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
