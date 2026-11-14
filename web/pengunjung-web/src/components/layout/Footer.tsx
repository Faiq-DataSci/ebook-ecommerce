import { useState } from 'react';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '../../constants/app.constants';
import { ROUTES } from '../../constants/routes';
import { SimulationBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

type PolicyModalType = 'privacy' | 'terms' | 'support' | null;

export function Footer() {
  const [activeModal, setActiveModal] = useState<PolicyModalType>(null);

  return (
    <footer
      style={{
        backgroundColor: 'var(--nb-white)',
        borderTop: 'var(--nb-border-thick)',
        marginTop: 'auto',
      }}
    >
      <div
        className="nb-container"
        style={{
          paddingBlock: 'var(--nb-space-12)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'var(--nb-space-8)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nb-space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span
              style={{
                backgroundColor: 'var(--nb-yellow)',
                border: 'var(--nb-border)',
                boxShadow: 'var(--nb-shadow-sm)',
                padding: '6px 14px',
                fontFamily: 'var(--nb-font-display)',
                fontWeight: 800,
                fontSize: '1.125rem',
              }}
            >
              {APP_CONFIG.BRAND_NAME}
            </span>
            <SimulationBadge />
          </div>
          <p className="nb-body-sm">
            Etalase web pelanggan untuk {APP_CONFIG.SYSTEM_NAME}. Dirancang sebagai toko
            buku digital tunggal (Single-Store B2C) dengan akses baca bersyarat setelah
            verifikasi pembayaran.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nb-space-3)' }}>
          <h2 className="nb-h3">Navigasi Pelanggan</h2>
          <ul
            style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <li>
              <Link
                to={ROUTES.HOME}
                className="nb-body-sm"
                style={{ textDecoration: 'underline', fontWeight: 600 }}
              >
                Beranda Toko
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.CATALOG}
                className="nb-body-sm"
                style={{ textDecoration: 'underline', fontWeight: 600 }}
              >
                Katalog E-Book Digital
              </Link>
            </li>
            <li>
              <Link
                to={`${ROUTES.HOME}#download-app`}
                className="nb-body-sm"
                style={{ textDecoration: 'underline', fontWeight: 600 }}
              >
                Download Apps E-Book Store (Android)
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.LIBRARY}
                className="nb-body-sm"
                style={{ textDecoration: 'underline', fontWeight: 600 }}
              >
                Pustaka Saya (Akses Buku Terbeli)
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.ACCOUNT}
                className="nb-body-sm"
                style={{ textDecoration: 'underline', fontWeight: 600 }}
              >
                Akun Pelanggan & Ringkasan Profil
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.ORDERS}
                className="nb-body-sm"
                style={{ textDecoration: 'underline', fontWeight: 600 }}
              >
                Riwayat Pembelian & Status Transaksi
              </Link>
            </li>
          </ul>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nb-space-3)' }}>
          <h2 className="nb-h3">Informasi & Kebijakan</h2>
          <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
            Rincian kontak resmi dan alamat perusahaan belum ditetapkan pada tahap ini
            (Placeholder Layanan Pelanggan).
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <Button
              variant="secondary"
              onClick={() => setActiveModal('support')}
            >
              Placeholder Dukungan Pelanggan
            </Button>
            <Button
              variant="secondary"
              onClick={() => SetActiveModalSafe(setActiveModal, 'privacy')}
            >
              Kebijakan Privasi
            </Button>
            <Button
              variant="secondary"
              onClick={() => SetActiveModalSafe(setActiveModal, 'terms')}
            >
              Syarat & Ketentuan
            </Button>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: 'var(--nb-paper)',
          borderTop: 'var(--nb-border-thin)',
          paddingBlock: 'var(--nb-space-4)',
        }}
      >
        <div
          className="nb-container"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <p className="nb-body-sm">
            Hak Cipta &copy; {new Date().getFullYear()} {APP_CONFIG.BRAND_NAME} ({APP_CONFIG.SYSTEM_NAME}).
          </p>
          <p className="nb-mono" style={{ fontSize: '0.75rem' }}>
            Seluruh Katalog & Transaksi Contoh Berstatus {APP_CONFIG.SIMULATION_LABEL}
          </p>
        </div>
      </div>

      <Modal
        isOpen={activeModal !== null}
        onClose={() => setActiveModal(null)}
        title={
          activeModal === 'privacy'
            ? 'Kebijakan Privasi (Rancangan Sistem)'
            : activeModal === 'terms'
              ? 'Syarat & Ketentuan Pembelian E-Book'
              : 'Placeholder Dukungan Pelanggan'
        }
        footer={
          <Button variant="primary" onClick={() => setActiveModal(null)}>
            Mengerti & Tutup
          </Button>
        }
      >
        {activeModal === 'privacy' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <SimulationBadge />
            <p className="nb-body">
              Sistem hanya menyimpan atribut pelanggan yang dibutuhkan untuk proses
              transaksi dan otorisasi akses e-book: nama lengkap, alamat email, dan
              catatan kepemilikan buku digital.
            </p>
            <p className="nb-body">
              Kredensial autentikasi tidak pernah ditampilkan di antarmuka publik, dan
              setiap permintaan akses file PDF wajib melewati verifikasi token di
              backend.
            </p>
          </div>
        )}
        {activeModal === 'terms' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <SimulationBadge />
            <p className="nb-body">
              1. Produk yang dijual adalah buku elektronik (e-book) pada toko tunggal
              resmi (Single-Store B2C).
            </p>
            <p className="nb-body">
              2. Hak akses baca di Pustaka Saya hanya diberikan setelah status
              pembayaran diverifikasi sebagai lunas oleh sistem.
            </p>
            <p className="nb-body">
              3. Pesanan berstatus menunggu pembayaran, gagal, atau kedaluwarsa tidak
              memberikan akses ke file e-book.
            </p>
          </div>
        )}
        {activeModal === 'support' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <SimulationBadge />
            <p className="nb-body">
              Ini adalah placeholder kanal dukungan pelanggan sesuai pedoman integritas
              data proyek (tidak mencantumkan nomor telepon atau alamat fisik palsu).
            </p>
            <p className="nb-body">
              Untuk memeriksa status pembayaran atau hak akses baca, silakan buka
              halaman Riwayat Pembelian dan Detail Transaksi pada akun pelanggan Anda.
            </p>
          </div>
        )}
      </Modal>
    </footer>
  );
}

function SetActiveModalSafe(
  setter: (value: PolicyModalType) => void,
  value: PolicyModalType,
) {
  setter(value);
}
