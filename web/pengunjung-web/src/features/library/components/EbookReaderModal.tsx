import type { PurchasedBookAccess } from '../../../types/order.types';
import { AccessStatusBadge, SimulationBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';

interface EbookReaderModalProps {
  item: PurchasedBookAccess | null;
  onClose: () => void;
}

export function EbookReaderModal({ item, onClose }: EbookReaderModalProps) {
  return (
    <Modal
      isOpen={item !== null}
      onClose={onClose}
      title={item ? `Pembaca E-Book: ${item.title}` : 'Pembaca E-Book'}
      footer={
        <Button variant="primary" onClick={onClose}>
          Tutup Pratinjau Baca
        </Button>
      }
    >
      {item && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <SimulationBadge />
            <AccessStatusBadge status={item.accessStatus} />
          </div>

          <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
            Pada implementasi produksi, komponen ini meminta signed URL
            berjangka waktu singkat dari endpoint backend setelah memvalidasi
            entitas EbookAccess milik pelanggan.
          </p>

          <div
            style={{
              backgroundColor: 'var(--nb-paper)',
              border: 'var(--nb-border)',
              padding: 'var(--nb-space-5)',
            }}
          >
            <p className="nb-mono" style={{ fontSize: '0.75rem', marginBottom: '8px' }}>
              CUPLIKAN ISI BUKU CONTOH ({item.orderNumber})
            </p>
            <p className="nb-body">{item.previewExcerpt}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}
