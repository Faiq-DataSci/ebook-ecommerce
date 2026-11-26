import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookMarked,
  Compass,
  Home,
  Info,
  Lock,
  LogIn,
  LogOut,
  ReceiptText,
  Search,
  Sparkles,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react';
import { APP_CONFIG } from '../../constants/app.constants';
import { ROUTES } from '../../constants/routes';
import type { CustomerProfile } from '../../types/user.types';
import { SimulationBadge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface NavbarFlyoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  quickSearch: string;
  onQuickSearchChange: (value: string) => void;
  onQuickSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChipClick: (keyword: string) => void;
  isAuthenticated: boolean;
  customer: CustomerProfile | null;
  isDemoLoggingIn: boolean;
  onDemoLogin: () => void;
  onLogout: () => void;
  onOpenGuideModal: () => void;
  isHomeActive: boolean;
  isCatalogActive: boolean;
  isLibraryActive: boolean;
  isAccountActive: boolean;
}

export function NavbarFlyoutDrawer({
  isOpen,
  onClose,
  quickSearch,
  onQuickSearchChange,
  onQuickSearchSubmit,
  onChipClick,
  isAuthenticated,
  customer,
  isDemoLoggingIn,
  onDemoLogin,
  onLogout,
  onOpenGuideModal,
  isHomeActive,
  isCatalogActive,
  isLibraryActive,
  isAccountActive,
}: NavbarFlyoutDrawerProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div
      className="nb-menu-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Panel Pencarian dan Menu Toko"
    >
      {/* Backdrop */}
      <div
        className="nb-menu-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Panel */}
      <div className="nb-menu-panel" id="nb-menu-flyout">
        {/* Panel Header */}
        <div className="nb-menu-panel-header">
          <div>
            <h3 className="nb-h3" style={{ fontSize: '1rem', lineHeight: 1.1 }}>
              {APP_CONFIG.BRAND_NAME}
            </h3>
            <p className="nb-mono" style={{ fontSize: '0.6875rem' }}>
              Pusat Pencarian & Navigasi Toko
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={onClose}
            leftIcon={<X size={16} strokeWidth={2.5} />}
          >
            Tutup
          </Button>
        </div>

        {/* Panel Body */}
        <div className="nb-menu-panel-body">
          {/* 1. Quick Search Box */}
          <form
            role="search"
            onSubmit={onQuickSearchSubmit}
            className="nb-menu-search-box"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="menu-search-input" className="nb-label">
                Cari Judul / Penulis E-Book
              </label>
              <span className="nb-mono" style={{ fontSize: '0.6875rem', color: 'var(--nb-text-muted)' }}>
                Katalog Digital B2C
              </span>
            </div>

            <div className="nb-search-input-group">
              <Search size={18} strokeWidth={2.5} aria-hidden="true" />
              <input
                id="menu-search-input"
                type="search"
                value={quickSearch}
                onChange={(e) => onQuickSearchChange(e.target.value)}
                placeholder="Ketik judul buku, nama penulis, atau topik..."
                autoFocus
                style={{
                  width: '100%',
                  minHeight: '44px',
                  paddingInline: '10px',
                  border: 'none',
                  background: 'transparent',
                  fontFamily: 'var(--nb-font-body)',
                  fontSize: '0.9375rem',
                  outline: 'none',
                }}
              />
              {quickSearch && (
                <button
                  type="button"
                  onClick={() => onQuickSearchChange('')}
                  aria-label="Bersihkan pencarian"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <Button type="submit" variant="primary">
              Cari di Katalog Sekarang
            </Button>

            {/* Popular Keywords / Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginTop: '4px' }}>
              <span className="nb-mono" style={{ fontSize: '0.75rem', color: 'var(--nb-text-muted)' }}>
                Pencarian Cepat:
              </span>
              {[
                'Algoritma SAW',
                'Pemrograman',
                'Sistem Informasi',
                'Basis Data',
                'Arsitektur',
              ].map((keyword) => (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => onChipClick(keyword)}
                  className="nb-search-chip"
                >
                  #{keyword}
                </button>
              ))}
            </div>
          </form>

          {/* 2. Dynamic Session & Authentication Card */}
          <div
            style={{
              backgroundColor: isAuthenticated ? 'var(--nb-paper)' : 'var(--nb-white)',
              border: 'var(--nb-border)',
              boxShadow: 'var(--nb-shadow-sm)',
              padding: 'var(--nb-space-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
              <SimulationBadge />
              {isAuthenticated ? (
                <span className="nb-nav-badge-pill nb-nav-badge-pill--green">
                  ✨ Sesi Akun Aktif (+Katalog & Akun)
                </span>
              ) : (
                <span className="nb-nav-badge-pill" style={{ backgroundColor: 'var(--nb-yellow)' }}>
                  Mode Pengunjung Tamu
                </span>
              )}
            </div>

            {isAuthenticated && customer ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="nb-user-avatar" style={{ width: '36px', height: '36px', fontSize: '1rem' }}>
                    {customer.fullName.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="nb-label" style={{ fontSize: '0.9375rem' }}>
                      {customer.fullName}
                    </p>
                    <p className="nb-mono" style={{ fontSize: '0.75rem', color: 'var(--nb-text-muted)' }}>
                      {customer.email} • Peran: {customer.role}
                    </p>
                  </div>
                </div>

                <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
                  Menu navigasi <strong>Katalog E-Book</strong> dan <strong>Akun Pelanggan</strong> telah ditambahkan dan aktif untuk akun Anda.
                </p>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      onClose();
                      navigate(ROUTES.ACCOUNT);
                    }}
                    leftIcon={<UserCheck size={16} />}
                  >
                    Buka Akun Saya
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={onLogout}
                    leftIcon={<LogOut size={16} />}
                  >
                    Keluar Akun
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h4 className="nb-h4" style={{ fontSize: '0.9375rem', marginBottom: '2px' }}>
                    Masuk Akun untuk Akses Pustaka Saya & Akun
                  </h4>
                  <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
                    Katalog terbuka bebas untuk seluruh pengunjung. Masuk akun untuk membaca e-book di{' '}
                    <strong>Pustaka Saya</strong> dan mengelola <strong>Akun Pelanggan</strong>.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Button
                    variant="primary"
                    onClick={() => {
                      onClose();
                      navigate(ROUTES.LOGIN);
                    }}
                    leftIcon={<LogIn size={16} />}
                  >
                    Masuk Akun
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      onClose();
                      navigate(ROUTES.REGISTER);
                    }}
                    leftIcon={<UserPlus size={16} />}
                  >
                    Daftar Baru
                  </Button>
                  <Button
                    variant="blue"
                    isLoading={isDemoLoggingIn}
                    onClick={onDemoLogin}
                    leftIcon={<Sparkles size={16} />}
                  >
                    Coba Demo Akun (1-Klik)
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* 3. Navigation Grid Tiles */}
          <div>
            <p
              className="nb-label"
              style={{
                marginBottom: 'var(--nb-space-3)',
                color: 'var(--nb-text-muted)',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
              }}
            >
              Pintas Navigasi Menu Toko
            </p>

            <div className="nb-menu-tile-grid">
              {/* Beranda */}
              <Link
                to={ROUTES.HOME}
                onClick={onClose}
                className={`nb-menu-tile ${isHomeActive ? 'nb-menu-tile--home-active' : ''}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Home size={18} strokeWidth={2.5} />
                  <span className="nb-nav-badge-pill" style={{ backgroundColor: 'var(--nb-yellow)' }}>
                    {isHomeActive ? 'Aktif' : 'Beranda'}
                  </span>
                </div>
                <div>
                  <h4 className="nb-h4" style={{ fontSize: '0.9375rem' }}>Beranda Storefront</h4>
                  <p className="nb-body-sm" style={{ fontSize: '0.75rem', color: 'var(--nb-text-muted)' }}>
                    Etalase utama dan buku unggulan
                  </p>
                </div>
              </Link>

              {/* Katalog E-Book */}
              <Link
                to={ROUTES.CATALOG}
                onClick={onClose}
                className={`nb-menu-tile ${isCatalogActive ? 'nb-menu-tile--catalog-active' : 'nb-menu-tile--unlocked-catalog'}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Compass size={18} strokeWidth={2.5} />
                  <span className="nb-nav-badge-pill nb-nav-badge-pill--blue">
                    {isCatalogActive ? 'Aktif' : 'Katalog'}
                  </span>
                </div>
                <div>
                  <h4 className="nb-h4" style={{ fontSize: '0.9375rem' }}>Katalog E-Book</h4>
                  <p className="nb-body-sm" style={{ fontSize: '0.75rem', color: 'var(--nb-text-muted)' }}>
                    Filter kategori & rekomendasi SAW
                  </p>
                </div>
              </Link>

              {/* Pustaka Saya */}
              {isAuthenticated ? (
                <Link
                  to={ROUTES.LIBRARY}
                  onClick={onClose}
                  className={`nb-menu-tile ${isLibraryActive ? 'nb-menu-tile--library-active' : ''}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <BookMarked size={18} strokeWidth={2.5} />
                    <span className="nb-nav-badge-pill nb-nav-badge-pill--green">
                      {isLibraryActive ? 'Aktif' : 'Pustaka'}
                    </span>
                  </div>
                  <div>
                    <h4 className="nb-h4" style={{ fontSize: '0.9375rem' }}>Pustaka Saya</h4>
                    <p className="nb-body-sm" style={{ fontSize: '0.75rem', color: 'var(--nb-text-muted)' }}>
                      Akses PDF buku yang telah dibeli
                    </p>
                  </div>
                </Link>
              ) : null}

              {/* Akun Pelanggan */}
              {isAuthenticated ? (
                <Link
                  to={ROUTES.ACCOUNT}
                  onClick={onClose}
                  className={`nb-menu-tile ${isAccountActive ? 'nb-menu-tile--account-active' : 'nb-menu-tile--unlocked-account'}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <UserCheck size={18} strokeWidth={2.5} />
                    <span className="nb-nav-badge-pill nb-nav-badge-pill--lavender">
                      {isAccountActive ? 'Aktif' : 'Profil'}
                    </span>
                  </div>
                  <div>
                    <h4 className="nb-h4" style={{ fontSize: '0.9375rem' }}>Akun Pelanggan</h4>
                    <p className="nb-body-sm" style={{ fontSize: '0.75rem', color: 'var(--nb-text-muted)' }}>
                      Profil, keamanan & data akun
                    </p>
                  </div>
                </Link>
              ) : (
                <div
                  className="nb-menu-tile nb-menu-tile--locked"
                  onClick={() => {
                    onClose();
                    navigate(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.ACCOUNT)}`);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onClose();
                      navigate(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.ACCOUNT)}`);
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Lock size={18} strokeWidth={2.25} />
                    <span className="nb-nav-badge-pill" style={{ backgroundColor: 'var(--nb-muted)' }}>
                      Perlu Masuk
                    </span>
                  </div>
                  <div>
                    <h4 className="nb-h4" style={{ fontSize: '0.9375rem', color: 'var(--nb-disabled-text)' }}>
                      Akun Pelanggan
                    </h4>
                    <p className="nb-body-sm" style={{ fontSize: '0.75rem', color: 'var(--nb-text-muted)' }}>
                      Masuk akun untuk membuka profil & riwayat
                    </p>
                  </div>
                </div>
              )}

              {/* Riwayat Pembelian */}
              {isAuthenticated ? (
                <Link
                  to={ROUTES.ORDERS}
                  onClick={onClose}
                  className="nb-menu-tile"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ReceiptText size={18} strokeWidth={2.5} />
                    <span className="nb-nav-badge-pill">Faktur</span>
                  </div>
                  <div>
                    <h4 className="nb-h4" style={{ fontSize: '0.9375rem' }}>Riwayat Pesanan</h4>
                    <p className="nb-body-sm" style={{ fontSize: '0.75rem', color: 'var(--nb-text-muted)' }}>
                      Status pembayaran & riwayat transaksi
                    </p>
                  </div>
                </Link>
              ) : null}

              {/* Alur Pembelian & Hak Akses */}
              <button
                type="button"
                onClick={onOpenGuideModal}
                className="nb-menu-tile"
                style={{ textAlign: 'left', background: 'var(--nb-white)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Info size={18} strokeWidth={2.5} />
                  <span className="nb-nav-badge-pill">Panduan</span>
                </div>
                <div>
                  <h4 className="nb-h4" style={{ fontSize: '0.9375rem' }}>Alur &amp; Panduan</h4>
                  <p className="nb-body-sm" style={{ fontSize: '0.75rem', color: 'var(--nb-text-muted)' }}>
                    Mekanisme B2C dan lisensi PDF
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Panel Footer */}
        <div
          style={{
            padding: 'var(--nb-space-4) var(--nb-space-5)',
            borderTop: 'var(--nb-border-thin)',
            backgroundColor: 'var(--nb-paper)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span className="nb-mono" style={{ fontSize: '0.75rem', color: 'var(--nb-text-muted)' }}>
            {APP_CONFIG.SYSTEM_NAME}
          </span>

          <Button
            variant="secondary"
            onClick={onClose}
          >
            Selesai / Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
