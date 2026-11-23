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
    <div className="tf-modal-overlay" onClick={onClose}>
      <div className="tf-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="tf-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 24 }}>code</span>
            <span className="tf-modal-title">Raw Callback JSON — {payment.paymentCode}</span>
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
          <div style={{ fontSize: 13 }}>
            Notifikasi callback resmi dari payment gateway <strong>{payment.provider}</strong> yang diterima dan divalidasi oleh backend:
          </div>

          <pre className="tf-json-box">
            {JSON.stringify(payment.rawWebhookPayload, null, 2)}
          </pre>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
            <span className="material-symbols-outlined" style={{ color: '#00B894', fontSize: 18 }}>verified</span>
            <span>Signature HMAC SHA512 cocok dengan `PAYMENT_GATEWAY_SERVER_KEY`</span>
          </div>
        </div>

        <div className="tf-modal-footer">
          <button
            type="button"
            className="tf-action-btn"
            style={{ backgroundColor: 'var(--nb-yellow)' }}
            onClick={onCopyJson}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>content_copy</span>
            <span>Salin JSON</span>
          </button>
          <button
            type="button"
            className="tf-action-btn"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
