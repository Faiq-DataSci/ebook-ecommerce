import { Badge, SimulationBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface NavbarGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToGuideSection: () => void;
  onGoToCatalog: () => void;
}

export function NavbarGuideModal({
  isOpen,
  onClose,
  onJumpToGuideSection,
  onGoToCatalog,
}: NavbarGuideModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Alur & Panduan Pembelian E-Book Digital (B2C)"
      footer={
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
          }}
        >
          <Button
            variant="secondary"
            onClick={onJumpToGuideSection}
          >
            Lihat Seksi Panduan di Beranda
          </Button>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <Button
              variant="blue"
              onClick={onGoToCatalog}
            >
              Buka Katalog E-Book
            </Button>
            <Button
              variant="primary"
              onClick={onClose}
            >
              Mengerti / Tutup
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <SimulationBadge />
          <Badge tone="yellow">Model Bisnis: Single-Store B2C</Badge>
          <Badge tone="lavender">SPK: Metode SAW (Backend)</Badge>
        </div>

        <p className="nb-body">
          Panduan resmi alur penelusuran katalog, pemesanan e-book individual,
          verifikasi pembayaran, hingga aktivasi hak baca berkas PDF di{' '}
          <strong>Pustaka Saya</strong>.
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '12px',
              padding: '12px 14px',
              backgroundColor: 'var(--nb-paper)',
              border: 'var(--nb-border-thin)',
              boxShadow: 'var(--nb-shadow-sm)',
            }}
          >
            <span
              className="nb-mono"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                backgroundColor: 'var(--nb-yellow)',
                border: '2px solid var(--nb-black)',
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              1
            </span>
            <div>
              <p className="nb-label">1. Telusuri Katalog &amp; Rekomendasi SAW</p>
              <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
                Pengunjung dapat menjelajahi seluruh koleksi e-book secara bebas,
                menyaring menurut kategori literatur, dan melihat peringkat rekomendasi
                Metode Simple Additive Weighting (SAW).
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              padding: '12px 14px',
              backgroundColor: 'var(--nb-paper)',
              border: 'var(--nb-border-thin)',
              boxShadow: 'var(--nb-shadow-sm)',
            }}
          >
            <span
              className="nb-mono"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                backgroundColor: 'var(--nb-blue)',
                border: '2px solid var(--nb-black)',
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              2
            </span>
            <div>
              <p className="nb-label">2. Masuk Akun &amp; Pesan E-Book Individual</p>
              <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
                Masuk atau daftar akun pelanggan untuk membuat pesanan. Setiap transaksi
                dicatat beserta status pembayaran (Menunggu Pembayaran, Diproses, atau Lunas).
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              padding: '12px 14px',
              backgroundColor: 'var(--nb-paper)',
              border: 'var(--nb-border-thin)',
              boxShadow: 'var(--nb-shadow-sm)',
            }}
          >
            <span
              className="nb-mono"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                backgroundColor: 'var(--nb-green)',
                border: '2px solid var(--nb-black)',
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              3
            </span>
            <div>
              <p className="nb-label">3. Akses Baca PDF Seumur Hidup di Pustaka Saya</p>
              <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
                Setelah pembayaran terverifikasi lunas (<code>PAID</code>), hak baca digital
                aktif permanen di menu <strong>Pustaka Saya</strong> menggunakan akses terproteksi
                (Signed URL dari bucket privat).
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
