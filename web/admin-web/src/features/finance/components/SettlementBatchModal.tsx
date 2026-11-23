import type { SettlementRecord } from '../../transactions/types/transactionFinance'
import { StatusBadge } from '../../../shared/components/ui'

interface SettlementBatchModalProps {
  settlement: SettlementRecord
  onClose: () => void
  onDownloadProof: () => void
}

export function SettlementBatchModal({
  settlement,
  onClose,
  onDownloadProof,
}: SettlementBatchModalProps) {
  const renderSettlementStatusBadge = (status: SettlementRecord['status']) => {
    switch (status) {
      case 'SETTLED':
        return <StatusBadge status="DITRANSFER (CAIR)" fill="#00B894" icon="check_circle" textColor="#FFFFFF" />
      case 'PROCESSING':
        return <StatusBadge status="PROSES BATCH" fill="#FFD23F" icon="pending" textColor="#000000" />
      case 'SCHEDULED':
        return <StatusBadge status="TERJADWAL" fill="#74B9FF" icon="schedule" textColor="#000000" />
    }
  }

  return (
    <div className="tf-modal-overlay" onClick={onClose}>
      <div className="tf-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="tf-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 24 }}>account_balance</span>
            <span className="tf-modal-title">Rincian Settlement {settlement.batchReference}</span>
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
              paddingBottom: 12,
              borderBottom: '2px solid #000',
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--nb-text-muted)' }}>STATUS PENCAIRAN</div>
              <div style={{ marginTop: 4 }}>{renderSettlementStatusBadge(settlement.status)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--nb-text-muted)' }}>WAKTU DISBURSEMENT</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{settlement.date}</div>
            </div>
          </div>

          <div style={{ border: '2px solid #000', backgroundColor: '#F8F9FA', padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #DDD' }}>
              <span>Total Gross (GMV Batch):</span>
              <span className="tf-mono" style={{ fontWeight: 700 }}>{settlement.totalGrossFormatted}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #DDD', color: '#D63031' }}>
              <span>Beban Potongan MDR (Fee Gateway):</span>
              <span className="tf-mono" style={{ fontWeight: 700 }}>- {settlement.gatewayMdrFeeFormatted}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, fontSize: 16, fontWeight: 800 }}>
              <span>Net Payout ke Rekening Giro:</span>
              <span className="tf-mono" style={{ color: '#00B894' }}>{settlement.netPayoutFormatted}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--nb-text-muted)', marginBottom: 4 }}>
              REKENING TUJUAN TRANSFER
            </div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{settlement.destinationBank}</div>
            <div className="tf-mono" style={{ fontSize: 13, color: '#0984E3' }}>{settlement.bankAccountNumber}</div>
          </div>
        </div>

        <div className="tf-modal-footer">
          <button
            type="button"
            className="tf-action-btn"
            style={{ backgroundColor: 'var(--nb-yellow)' }}
            onClick={onDownloadProof}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>receipt</span>
            <span>Unduh Bukti Transfer</span>
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
