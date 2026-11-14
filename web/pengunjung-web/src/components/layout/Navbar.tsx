import { useState, type FormEvent } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  BookMarked,
  BookOpen,
  Check,
  Compass,
  Download,
  Home,
  Info,
  LogIn,
  LogOut,
  Menu,
  ReceiptText,
  Search,
  Smartphone,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react';
import { APP_CONFIG } from '../../constants/app.constants';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { Badge, SimulationBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export function Navbar() {
  const { customer, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [apkSimulated, setApkSimulated] = useState(false);

  const handleQuickSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = quickSearch.trim();
    setMobileMenuOpen(false);
    if (trimmed) {
      navigate(`${ROUTES.CATALOG}?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate(ROUTES.CATALOG);
    }
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate(ROUTES.HOME);
  };

  const handleOpenDownloadModal = () => {
    setMobileMenuOpen(false);
    setApkSimulated(false);
    setDownloadModalOpen(true);
  };

  const handleTriggerSimulatedApkDownload = () => {
    const releaseManifest = [
      '======================================================',
      'E-BOOK STORE MOBILE APP (ANDROID) - DATA SIMULASI',
      '======================================================',
      `Sistem        : ${APP_CONFIG.SYSTEM_NAME}`,
      'Nama Proyek   : ebook_store (Flutter + Dart + Riverpod + Dio)',
      'Platform      : Android (APK Distribusi Internal)',
      'Status Modul  : [RENCANA] / Paket Simulasi Antarmuka Web',
      `Waktu Unduh   : ${new Date().toISOString()}`,
      '',
      'Catatan Arsitektur:',
      '- Sinkronisasi akun pelanggan, katalog e-book, dan Pustaka Saya.',
      '- Akses baca file PDF menggunakan Signed URL dari bucket privat.',
      '- Berkas ini adalah manifes simulasi unduhan aplikasi dari etalase web.',
    ].join('\n');

    const blob = new Blob([releaseManifest], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ebook_store-android-info-simulasi.txt';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);

    setApkSimulated(true);
  };

  return (
    <header
      style={{
        backgroundColor: 'var(--nb-paper)',
        borderBottom: 'var(--nb-border-thick)',
        position: 'sticky',
        top: 0,
        zIndex: 500,
      }}
    >
      {/* Top Status Strip */}
      <div
        style={{
          backgroundColor: 'var(--nb-orange)',
          borderBottom: 'var(--nb-border-thin)',
          paddingBlock: '6px',
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
          <span className="nb-label" style={{ fontSize: '0.8125rem' }}>
            {APP_CONFIG.SIMULATION_LABEL}: Etalase Pelanggan Web (Tanpa Modul
            Admin & Tanpa Perhitungan SAW)
          </span>
          <span className="nb-mono" style={{ fontSize: '0.75rem' }}>
            Toko Tunggal B2C E-Book Digital
          </span>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="nb-container">
        <div className="nb-navbar-row">
          {/* Brand Logo */}
          <Link
            to={ROUTES.HOME}
            className="nb-pressable"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'var(--nb-yellow)',
              padding: '8px 16px',
              fontFamily: 'var(--nb-font-display)',
              fontWeight: 800,
              fontSize: '1.125rem',
              flexShrink: 0,
            }}
          >
            <BookOpen size={20} strokeWidth={2.5} aria-hidden="true" />
            <span>{APP_CONFIG.BRAND_NAME}</span>
          </Link>

          {/* Desktop Center Navigation */}
          <nav aria-label="Navigasi utama toko" className="nb-nav-desktop">
            <NavLink
              to={ROUTES.HOME}
              end
              className={({ isActive }) =>
                `nb-nav-item ${isActive ? 'nb-nav-item--active' : ''}`.trim()
              }
            >
              <Home size={16} strokeWidth={2.25} aria-hidden="true" />
              <span>Beranda</span>
            </NavLink>

            <NavLink
              to={ROUTES.CATALOG}
              className={({ isActive }) =>
                `nb-nav-item ${isActive ? 'nb-nav-item--active' : ''}`.trim()
              }
            >
              <Compass size={16} strokeWidth={2.25} aria-hidden="true" />
              <span>Katalog E-Book</span>
            </NavLink>

            <button
              type="button"
              onClick={handleOpenDownloadModal}
              className="nb-nav-item nb-nav-item--app"
            >
              <Smartphone size={16} strokeWidth={2.25} aria-hidden="true" />
              <span>Download Apps E-Book Store</span>
            </button>

            {isAuthenticated && (
              <>
                <NavLink
                  to={ROUTES.LIBRARY}
                  className={({ isActive }) =>
                    `nb-nav-item ${isActive ? 'nb-nav-item--library-active' : ''}`.trim()
                  }
                >
                  <BookMarked size={16} strokeWidth={2.25} aria-hidden="true" />
                  <span>Pustaka Saya</span>
                </NavLink>

                <NavLink
                  to={ROUTES.ACCOUNT}
                  className={({ isActive }) =>
                    `nb-nav-item ${isActive ? 'nb-nav-item--orders-active' : ''}`.trim()
                  }
                >
                  <UserCheck size={16} strokeWidth={2.25} aria-hidden="true" />
                  <span>Akun</span>
                </NavLink>
              </>
            )}
          </nav>

          {/* Right Action Cluster */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button
              variant="secondary"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="nb-header-drawer"
              leftIcon={
                mobileMenuOpen ? (
                  <X size={18} strokeWidth={2.5} aria-hidden="true" />
                ) : (
                  <Menu size={18} strokeWidth={2.5} aria-hidden="true" />
                )
              }
            >
              {mobileMenuOpen ? 'Tutup Panel' : 'Cari & Menu'}
            </Button>

            <div className="nb-nav-auth-desktop">
              {isAuthenticated && customer ? (
                <>
                  <NavLink
                    to={ROUTES.ORDERS}
                    className={({ isActive }) =>
                      `nb-nav-item ${isActive ? 'nb-nav-item--active' : ''}`.trim()
                    }
                  >
                    <ReceiptText
                      size={16}
                      strokeWidth={2.25}
                      aria-hidden="true"
                    />
                    <span>Riwayat Pembelian</span>
                  </NavLink>
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    leftIcon={
                      <LogOut size={16} strokeWidth={2.25} aria-hidden="true" />
                    }
                  >
                    Keluar
                  </Button>
                </>
              ) : (
                <>
                  <Link to={ROUTES.LOGIN} className="nb-nav-item">
                    <LogIn size={16} strokeWidth={2.25} aria-hidden="true" />
                    <span>Masuk</span>
                  </Link>
                  <Link
                    to={ROUTES.REGISTER}
                    className="nb-nav-item nb-nav-item--active"
                  >
                    <UserPlus size={16} strokeWidth={2.25} aria-hidden="true" />
                    <span>Daftar</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Search & Responsive Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="nb-header-drawer"
          style={{
            backgroundColor: 'var(--nb-white)',
            borderTop: 'var(--nb-border)',
            paddingBlock: 'var(--nb-space-5)',
          }}
        >
          <div className="nb-container nb-stack-4">
            {/* Quick Search Bar */}
            <form
              role="search"
              onSubmit={handleQuickSearch}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--nb-space-2)',
              }}
            >
              <label
                htmlFor="nb-quick-search-input"
                className="nb-label"
                style={{ width: '100%' }}
              >
                Cari Cepat Judul atau Penulis E-Book
              </label>
              <div
                style={{
                  flex: '1 1 240px',
                  display: 'flex',
                  alignItems: 'center',
                  border: 'var(--nb-border)',
                  backgroundColor: 'var(--nb-paper)',
                  paddingLeft: '12px',
                }}
              >
                <Search size={18} strokeWidth={2.5} aria-hidden="true" />
                <input
                  id="nb-quick-search-input"
                  type="search"
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  placeholder="Ketik judul e-book lalu tekan Cari..."
                  style={{
                    width: '100%',
                    minHeight: '44px',
                    paddingInline: '10px',
                    border: 'none',
                    background: 'transparent',
                  }}
                />
              </div>
              <Button type="submit" variant="primary">
                Cari di Katalog
              </Button>
            </form>

            {/* Structured Navigation Grid inside Drawer */}
            <div
              style={{
                paddingTop: 'var(--nb-space-3)',
                borderTop: 'var(--nb-border-thin)',
              }}
            >
              <p
                className="nb-label"
                style={{
                  marginBottom: 'var(--nb-space-2)',
                  color: 'var(--nb-text-muted)',
                }}
              >
                Pintas Navigasi Etalase & Aplikasi
              </p>
              <div className="nb-nav-drawer-grid">
                <NavLink
                  to={ROUTES.HOME}
                  end
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `nb-nav-item ${isActive ? 'nb-nav-item--active' : ''}`.trim()
                  }
                  style={{ justifyContent: 'flex-start' }}
                >
                  <Home size={16} strokeWidth={2.25} aria-hidden="true" />
                  <span>Beranda Storefront</span>
                </NavLink>

                <NavLink
                  to={ROUTES.CATALOG}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `nb-nav-item ${isActive ? 'nb-nav-item--active' : ''}`.trim()
                  }
                  style={{ justifyContent: 'flex-start' }}
                >
                  <Compass size={16} strokeWidth={2.25} aria-hidden="true" />
                  <span>Jelajahi Katalog E-Book</span>
                </NavLink>

                <button
                  type="button"
                  onClick={handleOpenDownloadModal}
                  className="nb-nav-item nb-nav-item--app"
                  style={{ justifyContent: 'flex-start' }}
                >
                  <Smartphone size={16} strokeWidth={2.25} aria-hidden="true" />
                  <span>Download Apps E-Book Store</span>
                </button>

                <Link
                  to={`${ROUTES.HOME}#tentang-toko`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="nb-nav-item"
                  style={{ justifyContent: 'flex-start' }}
                >
                  <Info size={16} strokeWidth={2.25} aria-hidden="true" />
                  <span>Alur Pembelian & Hak Akses</span>
                </Link>

                {isAuthenticated && (
                  <>
                    <NavLink
                      to={ROUTES.LIBRARY}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `nb-nav-item ${isActive ? 'nb-nav-item--library-active' : ''}`.trim()
                      }
                      style={{ justifyContent: 'flex-start' }}
                    >
                      <BookMarked
                        size={16}
                        strokeWidth={2.25}
                        aria-hidden="true"
                      />
                      <span>Pustaka Saya</span>
                    </NavLink>

                    <NavLink
                      to={ROUTES.ACCOUNT}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `nb-nav-item ${isActive ? 'nb-nav-item--orders-active' : ''}`.trim()
                      }
                      style={{ justifyContent: 'flex-start' }}
                    >
                      <UserCheck
                        size={16}
                        strokeWidth={2.25}
                        aria-hidden="true"
                      />
                      <span>Akun ({customer?.fullName ?? 'Pelanggan'})</span>
                    </NavLink>

                    <NavLink
                      to={ROUTES.ORDERS}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `nb-nav-item ${isActive ? 'nb-nav-item--active' : ''}`.trim()
                      }
                      style={{ justifyContent: 'flex-start' }}
                    >
                      <ReceiptText
                        size={16}
                        strokeWidth={2.25}
                        aria-hidden="true"
                      />
                      <span>Riwayat Pembelian</span>
                    </NavLink>
                  </>
                )}
              </div>
            </div>

            {/* Footer Row of Drawer: Simulation Status & Mobile Auth Controls */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--nb-space-3)',
                paddingTop: 'var(--nb-space-3)',
                borderTop: 'var(--nb-border-thin)',
              }}
            >
              <SimulationBadge />

              <div className="nb-cluster">
                {isAuthenticated && customer ? (
                  <>
                    <Link
                      to={ROUTES.ACCOUNT}
                      onClick={() => setMobileMenuOpen(false)}
                      className="nb-nav-item"
                    >
                      <UserCheck
                        size={16}
                        strokeWidth={2.25}
                        aria-hidden="true"
                      />
                      <span>Akun: {customer.fullName}</span>
                    </Link>
                    <Button
                      variant="destructive"
                      onClick={handleLogout}
                      leftIcon={
                        <LogOut
                          size={16}
                          strokeWidth={2.25}
                          aria-hidden="true"
                        />
                      }
                    >
                      Keluar Akun
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      to={ROUTES.LOGIN}
                      onClick={() => setMobileMenuOpen(false)}
                      className="nb-nav-item"
                    >
                      <LogIn size={16} strokeWidth={2.25} aria-hidden="true" />
                      <span>Masuk Akun</span>
                    </Link>
                    <Link
                      to={ROUTES.REGISTER}
                      onClick={() => setMobileMenuOpen(false)}
                      className="nb-nav-item nb-nav-item--active"
                    >
                      <UserPlus
                        size={16}
                        strokeWidth={2.25}
                        aria-hidden="true"
                      />
                      <span>Daftar Pelanggan</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Download Apps E-Book Store */}
      <Modal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        title="Download Apps E-Book Store (Android)"
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
              onClick={() => {
                setDownloadModalOpen(false);
                navigate(`${ROUTES.HOME}#download-app`);
              }}
            >
              Lihat Seksi Aplikasi di Beranda
            </Button>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <Button
                variant="blue"
                leftIcon={
                  apkSimulated ? (
                    <Check size={18} strokeWidth={2.5} aria-hidden="true" />
                  ) : (
                    <Download size={18} strokeWidth={2.25} aria-hidden="true" />
                  )
                }
                onClick={handleTriggerSimulatedApkDownload}
              >
                {apkSimulated
                  ? 'Manifes APK Terunduh (Simulasi)'
                  : 'Unduh Paket APK Android (Simulasi)'}
              </Button>
              <Button
                variant="primary"
                onClick={() => setDownloadModalOpen(false)}
              >
                Selesai
              </Button>
            </div>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <SimulationBadge />
            <Badge tone="blue">Platform Android (Flutter)</Badge>
            <Badge tone="yellow">Proyek: ebook_store [RENCANA]</Badge>
          </div>

          <p className="nb-body">
            Nikmati pengalaman menjelajahi katalog, memesan buku digital, dan
            membaca koleksi e-book Anda langsung melalui aplikasi mobile resmi{' '}
            <strong>E-Book Store (`ebook_store`)</strong> untuk perangkat
            Android.
          </p>

          <div
            style={{
              backgroundColor: 'var(--nb-paper)',
              border: 'var(--nb-border-thin)',
              padding: 'var(--nb-space-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <p className="nb-label">Spesifikasi Aplikasi Mobile Pelanggan:</p>
            <p className="nb-body-sm">
              1. <strong>Sinkronisasi Akun & Pustaka:</strong> Satu akun
              pelanggan terhubung dengan Pustaka Saya dan Riwayat Pembelian di
              web maupun mobile.
            </p>
            <p className="nb-body-sm">
              2. <strong>Pembaca PDF Terproteksi:</strong> Membuka e-book yang
              telah lunas (`paid`) melalui tautan sementara (*Signed URL*) dari
              penyimpanan privat.
            </p>
            <p className="nb-body-sm">
              3. <strong>Stack Teknologi Terkunci:</strong> Dibangun menggunakan
              Flutter, Dart, Riverpod, dan Dio untuk perangkat Android.
            </p>
          </div>

          {apkSimulated && (
            <div
              role="status"
              style={{
                backgroundColor: 'var(--nb-green)',
                border: 'var(--nb-border-thin)',
                boxShadow: 'var(--nb-shadow-sm)',
                padding: '12px',
              }}
            >
              <p className="nb-label">
                Simulasi Unduhan Berhasil: Berkas informasi rilis{' '}
                <code>ebook_store-android-info-simulasi.txt</code> telah diunduh
                ke perangkat Anda.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </header>
  );
}
