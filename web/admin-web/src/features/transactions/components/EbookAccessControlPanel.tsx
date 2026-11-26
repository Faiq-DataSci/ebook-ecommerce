import { StatusBadge } from '../../../shared/components/ui'
import type { OrderRecord } from '../types/transactionFinance'

interface EbookAccessControlPanelProps {
  order: OrderRecord
  onToggleAccess: (order: OrderRecord) => void
}

export function EbookAccessControlPanel({
  order,
  onToggleAccess,
}: EbookAccessControlPanelProps) {
  return (
    <div className="tf-access-panel">
      <div className="tf-access-header">
        <span className="tf-access-title">
          <span>Kontrol Hak Akses Digital Pelanggan (<code>EbookAccess</code>)</span>
        </span>
        {order.ebookAccessGranted ? (
          order.ebookAccessRevoked ? (
            <StatusBadge status="DICABUT" fill="var(--nb-pink)" textColor="var(--nb-white)" />
          ) : (
            <StatusBadge status="AKTIF" fill="var(--nb-green)" textColor="var(--nb-white)" />
          )
        ) : (
          <StatusBadge status="BELUM AKTIF" fill="var(--nb-muted)" textColor="var(--nb-black)" />
        )}
      </div>

      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>
        {order.ebookAccessGranted
          ? order.ebookAccessRevoked
            ? 'Hak akses membaca e-book sedang dicabut sementara oleh Admin. Pelanggan tidak dapat meminta Signed URL untuk membaca PDF.'
            : 'Pelanggan memiliki hak akses aktif membaca e-book ini di perpustakaan digital via in-app PDF reader menggunakan Signed URL privat.'
          : 'Hak akses membaca e-book belum diaktifkan karena status pembayaran pesanan belum lunas.'}
      </p>

      {order.ebookAccessGranted && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
          <button
            type="button"
            className="tf-action-btn"
            style={{
              backgroundColor: order.ebookAccessRevoked ? 'var(--nb-green)' : 'var(--nb-pink)',
              color: 'var(--nb-white)',
              minHeight: '36px',
              padding: '0 16px',
            }}
            onClick={() => onToggleAccess(order)}
          >
            <span>{order.ebookAccessRevoked ? 'Pulihkan Hak Akses' : 'Cabut Hak Akses'}</span>
          </button>
        </div>
      )}
    </div>
  )
}
