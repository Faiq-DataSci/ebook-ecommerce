import { useEffect, useState, type FormEvent } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  BookMarked,
  BookOpen,
  Compass,
  Home,
  Info,
  Lock,
  LogIn,
  LogOut,
  Menu,
  ReceiptText,
  Search,
  Sparkles,
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
  const { customer, isAuthenticated, logout, loginWithDemoAccount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [isDemoLoggingIn, setIsDemoLoggingIn] = useState(false);

  const isHomeActive = location.pathname === ROUTES.HOME;
  const isCatalogActive =
    location.pathname === ROUTES.CATALOG ||
    location.pathname.startsWith(`${ROUTES.CATALOG}/`);
  const isLibraryActive = location.pathname.startsWith(ROUTES.LIBRARY);
  const isAccountActive = location.pathname.startsWith(ROUTES.ACCOUNT);

  // Close flyout on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when flyout drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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

  const handleChipClick = (keyword: string) => {
    setMobileMenuOpen(false);
    navigate(`${ROUTES.CATALOG}?q=${encodeURIComponent(keyword)}`);
  };

  const handleDemoLogin = async () => {
    setIsDemoLoggingIn(true);
    try {
      await loginWithDemoAccount();
    } finally {
      setIsDemoLoggingIn(false);
    }
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate(ROUTES.HOME);
  };

  const handleOpenGuideModal = () => {
    setMobileMenuOpen(false);
    setGuideModalOpen(true);
  };

  const handleJumpToGuideSection = () => {
    setGuideModalOpen(false);
    setMobileMenuOpen(false);
    if (location.pathname !== ROUTES.HOME) {
      navigate(`${ROUTES.HOME}#tentang-toko`);
    }
    window.setTimeout(() => {
      const target = document.getElementById('tentang-toko');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
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
      {/* Top Running Status Marquee Strip */}
      <div
        className="nb-marquee-strip"
        role="region"
        aria-label="Informasi Status Toko Berjalan"
      >
        <div className="nb-marquee-track">
          {/* Iterasi 1 */}
          <div className="nb-marquee-group" aria-hidden="false">
            <div className="nb-marquee-item">
              <span className="nb-marquee-badge">
                <AlertTriangle size={12} strokeWidth={2.5} aria-hidden="true" />
                {APP_CONFIG.SIMULATION_LABEL}
              </span>
              <span>Etalase Toko Digital Pelanggan Web &amp; Transaksi B2C</span>
            </div>

            <span className="nb-marquee-star" aria-hidden="true">✦</span>

            <div className="nb-marquee-item">
              <span className="nb-marquee-tag">
                <BookOpen size={12} strokeWidth={2.5} aria-hidden="true" />
                Toko Tunggal B2C E-Book Digital
              </span>
              <span>Akses Berkas PDF Instan &amp; Hak Baca Digital Seumur Hidup</span>
            </div>

            <span className="nb-marquee-star" aria-hidden="true">✦</span>

            <div className="nb-marquee-item">
              <span className="nb-marquee-badge" style={{ backgroundColor: 'var(--nb-black)', color: 'var(--nb-green)' }}>
                <Sparkles size={12} strokeWidth={2.5} aria-hidden="true" />
                TERVERIFIKASI SISTEM
              </span>
              <span>Katalog Literatur Teknik &amp; Sistem Informasi Resmi</span>
            </div>

            <span className="nb-marquee-star" aria-hidden="true">✦</span>
          </div>

          {/* Iterasi 2 (Clone untuk Infinite Seamless Loop) */}
          <div className="nb-marquee-group" aria-hidden="true">
            <div className="nb-marquee-item">
              <span className="nb-marquee-badge">
                <AlertTriangle size={12} strokeWidth={2.5} aria-hidden="true" />
                {APP_CONFIG.SIMULATION_LABEL}
              </span>
              <span>Etalase Toko Digital Pelanggan Web &amp; Transaksi B2C</span>
            </div>

            <span className="nb-marquee-star" aria-hidden="true">✦</span>

            <div className="nb-marquee-item">
              <span className="nb-marquee-tag">
                <BookOpen size={12} strokeWidth={2.5} aria-hidden="true" />
                Toko Tunggal B2C E-Book Digital
              </span>
              <span>Akses Berkas PDF Instan &amp; Hak Baca Digital Seumur Hidup</span>
            </div>

            <span className="nb-marquee-star" aria-hidden="true">✦</span>

            <div className="nb-marquee-item">
              <span className="nb-marquee-badge" style={{ backgroundColor: 'var(--nb-black)', color: 'var(--nb-green)' }}>
                <Sparkles size={12} strokeWidth={2.5} aria-hidden="true" />
                TERVERIFIKASI SISTEM
              </span>
              <span>Katalog Literatur Teknik &amp; Sistem Informasi Resmi</span>
            </div>

            <span className="nb-marquee-star" aria-hidden="true">✦</span>
          </div>
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
              backgroundColor: 'var(--nb-yellow)',
              padding: '8px 16px',
              fontFamily: 'var(--nb-font-display)',
              fontWeight: 800,
              fontSize: '1.125rem',
              flexShrink: 0,
            }}
          >
            <span>{APP_CONFIG.BRAND_NAME}</span>
          </Link>

          {/* Desktop Center Navigation (Clean & Compact to Prevent Overflow) */}
          <nav aria-label="Navigasi utama toko" className="nb-nav-desktop">
            <NavLink
              to={ROUTES.HOME}
              end
              className={({ isActive }) =>
                `nb-nav-item nb-nav-item--home ${isActive ? 'nb-nav-item--home-active' : ''}`.trim()
              }
            >
              <Home size={16} strokeWidth={2.25} aria-hidden="true" />
              <span>Beranda</span>
            </NavLink>

            {/* Katalog E-Book (Selalu Tampil untuk Semua Pengunjung Termasuk Tanpa Akun) */}
            <NavLink
              to={ROUTES.CATALOG}
              className={({ isActive }) =>
                `nb-nav-item nb-nav-item--catalog ${isActive ? 'nb-nav-item--catalog-active' : ''}`.trim()
              }
            >
              <Compass size={16} strokeWidth={2.25} aria-hidden="true" />
              <span>Katalog E-Book</span>
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink
                  to={ROUTES.LIBRARY}
                  className={({ isActive }) =>
                    `nb-nav-item nb-nav-item--library ${isActive ? 'nb-nav-item--library-active' : ''}`.trim()
                  }
                >
                  <BookMarked size={16} strokeWidth={2.25} aria-hidden="true" />
                  <span>Pustaka</span>
                </NavLink>

                <NavLink
                  to={ROUTES.ACCOUNT}
                  className={({ isActive }) =>
                    `nb-nav-item nb-nav-item--account ${isActive ? 'nb-nav-item--account-active' : ''}`.trim()
                  }
                >
                  <UserCheck size={16} strokeWidth={2.25} aria-hidden="true" />
                  <span>Akun</span>
                </NavLink>
              </>
            ) : (
              <button
                type="button"
                onClick={handleOpenGuideModal}
                className="nb-nav-item nb-nav-item--app"
              >
                <Info size={16} strokeWidth={2.25} aria-hidden="true" />
                <span>Alur &amp; Panduan</span>
              </button>
            )}
          </nav>

          {/* Right Action Cluster: Search & Menu Button + Auth Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Dedicated "Cari & Menu" Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className={`nb-search-menu-btn ${mobileMenuOpen ? 'is-active' : ''}`}
              aria-expanded={mobileMenuOpen}
              aria-controls="nb-menu-flyout"
              aria-label="Buka pencarian dan menu navigasi"
            >
              {mobileMenuOpen ? (
                <>
                  <X size={16} strokeWidth={2.5} aria-hidden="true" />
                  <span className="nb-search-menu-btn-text">Tutup Menu</span>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Search size={15} strokeWidth={2.5} aria-hidden="true" />
                    <span style={{ opacity: 0.6 }}>|</span>
                    <Menu size={15} strokeWidth={2.5} aria-hidden="true" />
                  </div>
                  <span className="nb-search-menu-btn-text">Cari &amp; Menu</span>
                </>
              )}
            </button>

            {/* Auth Controls: Compact Icon Buttons when Logged In / Stylish Buttons for Tanpa Akun */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              {isAuthenticated && customer ? (
                <>
                  <Link
                    to={ROUTES.ACCOUNT}
                    className="nb-icon-btn nb-icon-btn--account"
                    title={`Akun Saya: ${customer.fullName} (${customer.email})`}
                    aria-label={`Akun Saya: ${customer.fullName}`}
                  >
                    <UserCheck size={18} strokeWidth={2.5} aria-hidden="true" />
                    <span className="nb-icon-dot-badge" aria-hidden="true" />
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="nb-icon-btn nb-icon-btn--logout"
                    title="Keluar Akun"
                    aria-label="Keluar Akun"
                  >
                    <LogOut size={17} strokeWidth={2.25} aria-hidden="true" />
                  </button>
                </>
              ) : (
                <div className="nb-guest-auth-group">
                  <Link
                    to={ROUTES.LOGIN}
                    className="nb-guest-nav-link"
                    title="Masuk ke Akun Pelanggan"
                    aria-label="Masuk ke Akun Pelanggan"
                  >
                    <LogIn size={15} strokeWidth={2.25} aria-hidden="true" />
                    <span className="nb-guest-nav-text">Masuk</span>
                  </Link>
                  <Link
                    to={ROUTES.REGISTER}
                    className="nb-guest-nav-link nb-guest-nav-link--register"
                    title="Daftar Pelanggan Baru"
                    aria-label="Daftar Pelanggan Baru"
                  >
                    <UserPlus size={15} strokeWidth={2.25} aria-hidden="true" />
                    <span className="nb-guest-nav-text">Daftar</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Flyout Search & Menu Drawer Overlay (Sleek, Responsive & Highly Attractive) */}
      {mobileMenuOpen && (
        <div
          className="nb-menu-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Panel Pencarian dan Menu Toko"
        >
          {/* Backdrop with Blur */}
          <div
            className="nb-menu-backdrop"
            onClick={() => setMobileMenuOpen(false)}
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
                onClick={() => setMobileMenuOpen(false)}
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
                onSubmit={handleQuickSearch}
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
                    onChange={(e) => setQuickSearch(e.target.value)}
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
                      onClick={() => setQuickSearch('')}
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
                      onClick={() => handleChipClick(keyword)}
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
                          setMobileMenuOpen(false);
                          navigate(ROUTES.ACCOUNT);
                        }}
                        leftIcon={<UserCheck size={16} />}
                      >
                        Buka Akun Saya
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleLogout}
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
                          setMobileMenuOpen(false);
                          navigate(ROUTES.LOGIN);
                        }}
                        leftIcon={<LogIn size={16} />}
                      >
                        Masuk Akun
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate(ROUTES.REGISTER);
                        }}
                        leftIcon={<UserPlus size={16} />}
                      >
                        Daftar Baru
                      </Button>
                      <Button
                        variant="blue"
                        isLoading={isDemoLoggingIn}
                        onClick={handleDemoLogin}
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
                    onClick={() => setMobileMenuOpen(false)}
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

                  {/* Katalog E-Book (Terbuka untuk Semua Pengunjung Termasuk Tanpa Akun) */}
                  <Link
                    to={ROUTES.CATALOG}
                    onClick={() => setMobileMenuOpen(false)}
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

                  {/* Pustaka Saya (Tepat di Sebelah Kanan Katalog E-Book) */}
                  {isAuthenticated ? (
                    <Link
                      to={ROUTES.LIBRARY}
                      onClick={() => setMobileMenuOpen(false)}
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
                      onClick={() => setMobileMenuOpen(false)}
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
                        setMobileMenuOpen(false);
                        navigate(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.ACCOUNT)}`);
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setMobileMenuOpen(false);
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
                      onClick={() => setMobileMenuOpen(false)}
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
                    onClick={handleOpenGuideModal}
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
                onClick={() => setMobileMenuOpen(false)}
              >
                Selesai / Tutup
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Alur & Panduan Pembelian E-Book Digital */}
      <Modal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
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
              onClick={handleJumpToGuideSection}
            >
              Lihat Seksi Panduan di Beranda
            </Button>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <Button
                variant="blue"
                onClick={() => {
                  setGuideModalOpen(false);
                  navigate(ROUTES.CATALOG);
                }}
              >
                Buka Katalog E-Book
              </Button>
              <Button
                variant="primary"
                onClick={() => setGuideModalOpen(false)}
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
    </header>
  );
}
