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
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            lock_open
          </span>
          Kontrol Hak Akses Digital (`EbookAccess`)
        </span>
        {order.ebookAccessGranted ? (
          order.ebookAccessRevoked ? (
            <StatusBadge status="DICABUT" fill="#FF6B6B" icon="block" textColor="#FFFFFF" />
          ) : (
            <StatusBadge status="AKTIF" fill="#00B894" icon="verified_user" textColor="#FFFFFF" />
          )
        ) : (
          <StatusBadge status="BELUM AKTIF" fill="#DFE6E9" icon="lock" textColor="#000000" />
        )}
      </div>

      <p style={{ margin: 0, fontSize: 13 }}>
        {order.ebookAccessGranted
          ? order.ebookAccessRevoked
            ? 'Hak akses digital sedang dicabut sementara oleh Admin. Pelanggan tidak dapat meminta signed URL baca PDF.'
            : 'Pelanggan memiliki hak akses aktif membaca e-book ini via in-app PDF reader menggunakan Signed URL.'
          : 'Hak akses membaca e-book belum diaktifkan karena pesanan belum lunas.'}
      </p>

      {order.ebookAccessGranted && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
          <button
            type="button"
            className="tf-action-btn"
            style={{
              backgroundColor: order.ebookAccessRevoked ? '#00B894' : '#FF6B6B',
              color: '#FFFFFF',
            }}
            onClick={() => onToggleAccess(order)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              {order.ebookAccessRevoked ? 'lock_open' : 'block'}
            </span>
            <span>{order.ebookAccessRevoked ? 'Pulihkan Hak Akses' : 'Cabut Hak Akses'}</span>
          </button>
        </div>
      )}
    </div>
  )
}
