import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookMarked,
  CheckCircle,
  Compass,
  Download,
  Home,
  Info,
  LogIn,
  LogOut,
  Smartphone,
  Sparkles,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { ROUTES } from '../../../constants/routes';
import { APP_CONFIG } from '../../../constants/app.constants';
import { useAuth } from '../../auth/hooks/useAuth';
import { Badge, SimulationBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';

export function HomeNavigation() {
  const { customer, isAuthenticated, logout, loginWithDemoAccount } = useAuth();
  const navigate = useNavigate();
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [apkDownloaded, setApkDownloaded] = useState(false);
  const [isDemoLoggingIn, setIsDemoLoggingIn] = useState(false);
  const reduceMotion = useReducedMotion();

  const handleDemoLogin = async () => {
    setIsDemoLoggingIn(true);
    try {
      await loginWithDemoAccount();
    } finally {
      setIsDemoLoggingIn(false);
    }
  };

  const handleDownloadApkManifest = () => {
    const manifestText = [
      '======================================================',
      'E-BOOK STORE MOBILE APP (ANDROID) - DATA SIMULASI',
      '======================================================',
      `Sistem        : ${APP_CONFIG.SYSTEM_NAME}`,
      'Nama Proyek   : ebook_store (Flutter + Dart + Riverpod + Dio)',
      'Platform      : Android (APK Distribusi Internal)',
      `Waktu Unduh   : ${new Date().toISOString()}`,
    ].join('\n');

    const blob = new Blob([manifestText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ebook_store-android-info-simulasi.txt';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);

    setApkDownloaded(true);
  };

  return (
    <section
      id="navigasi-beranda"
      className="nb-container"
      style={{ paddingBlock: 'clamp(2.5rem, 4.5vw, 4rem)' }}
    >
      <motion.div
        className="nb-home-nav-hub"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Header Bar: Sederhana & Bersih */}
        <div className="nb-home-nav-header">
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <SimulationBadge />
              <Badge tone="yellow">Navigasi Utama</Badge>
              {isAuthenticated ? (
                <Badge tone="green">Sesi Aktif</Badge>
              ) : (
                <Badge tone="blue">Mode Tamu</Badge>
              )}
            </div>

            <h2 className="nb-h2">
              {isAuthenticated
                ? `Halo, ${customer?.fullName ?? 'Pelanggan'}!`
                : 'Navigasi Etalase'}
            </h2>

            <p className="nb-body" style={{ color: 'var(--nb-text-muted)', marginTop: '2px' }}>
              {isAuthenticated
                ? 'Pilih menu untuk melihat katalog, pustaka buku, atau pengaturan akun.'
                : 'Pilih menu etalase untuk jelajahi katalog, aplikasi, atau panduan.'}
            </p>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                <Link to={ROUTES.ACCOUNT} className="nb-user-pill-desktop">
                  <span className="nb-user-avatar" aria-hidden="true">
                    {customer?.fullName?.charAt(0)?.toUpperCase() ?? 'U'}
                  </span>
                  <span>{customer?.fullName}</span>
                </Link>
                <Button
                  variant="destructive"
                  onClick={logout}
                  leftIcon={<LogOut size={15} strokeWidth={2.25} />}
                >
                  Keluar
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="primary"
                  onClick={() => navigate(ROUTES.LOGIN)}
                  leftIcon={<LogIn size={15} strokeWidth={2.25} />}
                >
                  Masuk Akun
                </Button>
                <Button
                  variant="blue"
                  isLoading={isDemoLoggingIn}
                  onClick={handleDemoLogin}
                  leftIcon={<Sparkles size={15} strokeWidth={2.25} />}
                >
                  Demo (1-Klik)
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="nb-home-nav-grid">
          {/* 1. Beranda */}
          <div
            className="nb-home-nav-card nb-home-nav-card--active"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="nb-nav-badge-pill">Sedang Aktif</span>
                <Home size={20} strokeWidth={2.5} aria-hidden="true" />
              </div>
              <h3 className="nb-h3" style={{ fontSize: '1rem', marginBottom: '4px' }}>
                Beranda
              </h3>
              <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
                Etalase utama dan kurasi e-book pilihan.
              </p>
            </div>
            <div style={{ marginTop: '10px', borderTop: 'var(--nb-border-thin)', paddingTop: '4px' }}>
              <span className="nb-label" style={{ fontSize: '0.8rem' }}>
                ● Halaman Saat Ini
              </span>
            </div>
          </div>

          {/* 2. Katalog E-Book (Selalu Terbuka) */}
          <Link
            to={ROUTES.CATALOG}
            className="nb-home-nav-card nb-home-nav-card--unlocked-catalog"
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="nb-nav-badge-pill nb-nav-badge-pill--blue">
                  Katalog
                </span>
                <Compass size={20} strokeWidth={2.5} aria-hidden="true" />
              </div>
              <h3 className="nb-h3" style={{ fontSize: '1rem', marginBottom: '4px' }}>
                Katalog E-Book
              </h3>
              <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
                Koleksi lengkap & rekomendasi SAW.
              </p>
            </div>
            <div style={{ marginTop: '10px', borderTop: 'var(--nb-border-thin)', paddingTop: '4px' }}>
              <span className="nb-label" style={{ color: 'var(--nb-black)' }}>
                Buka Katalog →
              </span>
            </div>
          </Link>

          {/* 3. Pustaka Saya (Saat Masuk Akun) */}
          {isAuthenticated ? (
            <Link
              to={ROUTES.LIBRARY}
              className="nb-home-nav-card"
              style={{ backgroundColor: '#E6F9EE' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="nb-nav-badge-pill nb-nav-badge-pill--green">
                    Pustaka
                  </span>
                  <BookMarked size={20} strokeWidth={2.5} aria-hidden="true" />
                </div>
                <h3 className="nb-h3" style={{ fontSize: '1rem', marginBottom: '4px' }}>
                  Pustaka Saya
                </h3>
                <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
                  Akses membaca buku PDF digital lunas.
                </p>
              </div>
              <div style={{ marginTop: '10px', borderTop: 'var(--nb-border-thin)', paddingTop: '4px' }}>
                <span className="nb-label" style={{ color: 'var(--nb-black)' }}>
                  Buka Pustaka →
                </span>
              </div>
            </Link>
          ) : null}

          {/* 4. Akun Pelanggan (Saat Masuk Akun) */}
          {isAuthenticated ? (
            <Link
              to={ROUTES.ACCOUNT}
              className="nb-home-nav-card nb-home-nav-card--unlocked-account"
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="nb-nav-badge-pill nb-nav-badge-pill--lavender">
                    Akun
                  </span>
                  <UserCheck size={20} strokeWidth={2.5} aria-hidden="true" />
                </div>
                <h3 className="nb-h3" style={{ fontSize: '1rem', marginBottom: '4px' }}>
                  Akun Pelanggan
                </h3>
                <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
                  Profil dan status kepemilikan buku.
                </p>
              </div>
              <div style={{ marginTop: '10px', borderTop: 'var(--nb-border-thin)', paddingTop: '4px' }}>
                <span className="nb-label" style={{ color: 'var(--nb-black)' }}>
                  Buka Akun →
                </span>
              </div>
            </Link>
          ) : null}

          {/* 5. Download Apps Android */}
          <button
            type="button"
            onClick={() => setDownloadModalOpen(true)}
            className="nb-home-nav-card"
            style={{ textAlign: 'left', backgroundColor: 'var(--nb-paper)' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="nb-nav-badge-pill nb-nav-badge-pill--blue">
                  Android
                </span>
                <Smartphone size={20} strokeWidth={2.5} aria-hidden="true" />
              </div>
              <h3 className="nb-h3" style={{ fontSize: '1rem', marginBottom: '4px' }}>
                Download Apps
              </h3>
              <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
                Manifes simulasi aplikasi mobile.
              </p>
            </div>
            <div style={{ marginTop: '10px', borderTop: 'var(--nb-border-thin)', paddingTop: '4px' }}>
              <span className="nb-label" style={{ color: 'var(--nb-black)' }}>
                Unduh Manifes →
              </span>
            </div>
          </button>

          {/* 6. Panduan Toko */}
          <a
            href="#tentang-toko"
            className="nb-home-nav-card"
            style={{ backgroundColor: 'var(--nb-paper)' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="nb-nav-badge-pill">B2C</span>
                <Info size={20} strokeWidth={2.5} aria-hidden="true" />
              </div>
              <h3 className="nb-h3" style={{ fontSize: '1rem', marginBottom: '4px' }}>
                Panduan Toko
              </h3>
              <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
                Alur belanja resmi dan hak akses PDF.
              </p>
            </div>
            <div style={{ marginTop: '10px', borderTop: 'var(--nb-border-thin)', paddingTop: '4px' }}>
              <span className="nb-label" style={{ color: 'var(--nb-black)' }}>
                Pelajari Alur →
              </span>
            </div>
          </a>
        </div>

        {/* Banner Sederhana untuk Pengunjung Tanpa Akun */}
        {!isAuthenticated && (
          <div className="nb-guest-perks-box">
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <h3 className="nb-h3" style={{ fontSize: '1.05rem', margin: 0 }}>
                  Akses Akun Pelanggan
                </h3>
                <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)', marginTop: '2px' }}>
                  Masuk akun untuk membaca berkas di <strong>Pustaka Saya</strong> dan memantau riwayat pesanan.
                </p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <Button
                  variant="primary"
                  onClick={() => navigate(ROUTES.LOGIN)}
                  leftIcon={<LogIn size={15} strokeWidth={2.25} />}
                >
                  Masuk Akun
                </Button>
                <Button
                  variant="blue"
                  isLoading={isDemoLoggingIn}
                  onClick={handleDemoLogin}
                  leftIcon={<Sparkles size={15} strokeWidth={2.25} />}
                >
                  Demo (1-Klik)
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate(ROUTES.REGISTER)}
                  leftIcon={<UserPlus size={15} strokeWidth={2.25} />}
                >
                  Daftar
                </Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>


      {/* Modal Unduh Aplikasi Android */}
      <Modal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        title="Download Apps (Android)"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', width: '100%' }}>
            <Button
              variant="blue"
              leftIcon={apkDownloaded ? <CheckCircle size={16} /> : <Download size={16} />}
              onClick={handleDownloadApkManifest}
            >
              {apkDownloaded ? 'Manifes Terunduh' : 'Unduh Manifes'}
            </Button>
            <Button variant="primary" onClick={() => setDownloadModalOpen(false)}>
              Tutup
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p className="nb-body">
            Aplikasi mobile <strong>ebook_store</strong> menyediakan akses membaca e-book di Android
            tersinkronisasi dengan akun web ini.
          </p>
          {apkDownloaded && (
            <div style={{ backgroundColor: 'var(--nb-green)', border: 'var(--nb-border-thin)', padding: '8px 12px' }}>
              <p className="nb-label">Berkas manifes simulasi berhasil diunduh.</p>
            </div>
          )}
        </div>
      </Modal>
    </section>
  );
}
