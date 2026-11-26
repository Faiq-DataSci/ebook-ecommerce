import { useEffect, useState, type FormEvent } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  BookMarked,
  Compass,
  Home,
  Info,
  LogIn,
  LogOut,
  Menu,
  Search,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react';
import { APP_CONFIG } from '../../constants/app.constants';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { NavbarFlyoutDrawer } from './NavbarFlyoutDrawer';
import { NavbarGuideModal } from './NavbarGuideModal';
import { NavbarMarquee } from './NavbarMarquee';

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
      <NavbarMarquee />

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

          {/* Desktop Center Navigation */}
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

            {/* Katalog E-Book */}
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

            {/* Auth Controls */}
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

      {/* Flyout Search & Menu Drawer */}
      <NavbarFlyoutDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        quickSearch={quickSearch}
        onQuickSearchChange={setQuickSearch}
        onQuickSearchSubmit={handleQuickSearch}
        onChipClick={handleChipClick}
        isAuthenticated={isAuthenticated}
        customer={customer}
        isDemoLoggingIn={isDemoLoggingIn}
        onDemoLogin={handleDemoLogin}
        onLogout={handleLogout}
        onOpenGuideModal={handleOpenGuideModal}
        isHomeActive={isHomeActive}
        isCatalogActive={isCatalogActive}
        isLibraryActive={isLibraryActive}
        isAccountActive={isAccountActive}
      />

      {/* Modal Alur & Panduan Pembelian E-Book Digital */}
      <NavbarGuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
        onJumpToGuideSection={handleJumpToGuideSection}
        onGoToCatalog={() => {
          setGuideModalOpen(false);
          navigate(ROUTES.CATALOG);
        }}
      />
    </header>
  );
}
