import { useEffect, useState, type ReactNode } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { Lock, LogIn, Sparkles } from 'lucide-react';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../features/auth/hooks/useAuth';
import { MainLayout } from '../components/layout/MainLayout';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Badge, SimulationBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/shared/EmptyState';
import { HomePage } from '../features/home/pages/HomePage';
import { CatalogPage } from '../features/catalog/pages/CatalogPage';
import { BookDetailPage } from '../features/book-detail/pages/BookDetailPage';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { AccountPage } from '../features/auth/pages/AccountPage';
import { LibraryPage } from '../features/library/pages/LibraryPage';
import { PurchaseHistoryPage } from '../features/orders/pages/PurchaseHistoryPage';
import { TransactionDetailPage } from '../features/orders/pages/TransactionDetailPage';

function ScrollRestorationHandler() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
}

interface ProtectedCustomerRouteProps {
  children: ReactNode;
  areaTitle: string;
}

function ProtectedCustomerRoute({
  children,
  areaTitle,
}: ProtectedCustomerRouteProps) {
  const { isAuthenticated, customer, loginWithDemoAccount } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingInDemo, setIsLoggingInDemo] = useState(false);

  if (isAuthenticated && customer?.role === 'CUSTOMER') {
    return <>{children}</>;
  }

  const redirectTarget = `${location.pathname}${location.search}`;

  const handleDemoAccess = async () => {
    setIsLoggingInDemo(true);
    try {
      await loginWithDemoAccount();
    } finally {
      setIsLoggingInDemo(false);
    }
  };

  return (
    <div className="nb-container nb-section">
      <Card
        zone="A"
        tone="white"
        padding="lg"
        style={{
          maxWidth: '680px',
          margin: '0 auto',
        }}
      >
        <div className="nb-stack-4">
          <div className="nb-cluster">
            <Badge tone="yellow">Area Khusus Pelanggan</Badge>
            <SimulationBadge />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--nb-space-3)',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--nb-yellow)',
                border: 'var(--nb-border)',
                boxShadow: 'var(--nb-shadow-sm)',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <Lock size={22} />
            </div>
            <div>
              <h1 className="nb-h2">Masuk untuk Membuka {areaTitle}</h1>
              <p
                className="nb-body-sm"
                style={{
                  color: 'var(--nb-text-muted)',
                  marginTop: '4px',
                }}
              >
                Halaman ini memerlukan sesi pelanggan terdaftar dengan peran{' '}
                <code>CUSTOMER</code>.
              </p>
            </div>
          </div>

          <p
            className="nb-body"
            style={{
              color: 'var(--nb-text-muted)',
            }}
          >
            Dalam arsitektur Sistem Informasi E-Commerce E-Book, proteksi rute
            di antarmuka web ini bersifat kenyamanan navigasi. Otorisasi akses
            data transaksi dan pembuatan signed URL PDF tetap diverifikasi penuh
            di sisi server melalui token JWT dan pemeriksaan kepemilikan
            pesanan.
          </p>

          <div
            className="nb-cluster"
            style={{ paddingTop: 'var(--nb-space-2)' }}
          >
            <Button
              type="button"
              variant="primary"
              leftIcon={<LogIn size={18} />}
              onClick={() =>
                navigate(
                  `${ROUTES.LOGIN}?redirect=${encodeURIComponent(redirectTarget)}`
                )
              }
            >
              Masuk ke Akun Pelanggan
            </Button>
            <Button
              type="button"
              variant="blue"
              isLoading={isLoggingInDemo}
              leftIcon={<Sparkles size={18} />}
              onClick={handleDemoAccess}
            >
              Gunakan Akun Demo Pelanggan
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(ROUTES.CATALOG)}
            >
              Jelajahi Katalog Publik
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="nb-container nb-section">
      <EmptyState
        title="404 - Halaman yang Anda Cari Tidak Tersedia"
        description="Periksa kembali alamat URL yang Anda masukkan atau kembali ke katalog utama untuk mencari buku digital."
        customAction={
          <div className="nb-cluster">
            <Button variant="primary" onClick={() => navigate(ROUTES.HOME)}>
              Kembali ke Beranda Storefront
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(ROUTES.CATALOG)}
            >
              Buka Katalog E-Book
            </Button>
          </div>
        }
      />
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollRestorationHandler />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.CATALOG} element={<CatalogPage />} />
          <Route path={ROUTES.BOOK_DETAIL()} element={<BookDetailPage />} />

          <Route
            path={ROUTES.LIBRARY}
            element={
              <ProtectedCustomerRoute areaTitle="Pustaka Digital Saya">
                <LibraryPage />
              </ProtectedCustomerRoute>
            }
          />
          <Route
            path={ROUTES.ACCOUNT}
            element={
              <ProtectedCustomerRoute areaTitle="Akun Pelanggan">
                <AccountPage />
              </ProtectedCustomerRoute>
            }
          />
          <Route
            path={ROUTES.ORDERS}
            element={
              <ProtectedCustomerRoute areaTitle="Riwayat Pembelian">
                <PurchaseHistoryPage />
              </ProtectedCustomerRoute>
            }
          />
          <Route
            path={ROUTES.ORDER_DETAIL()}
            element={
              <ProtectedCustomerRoute areaTitle="Detail Transaksi">
                <TransactionDetailPage />
              </ProtectedCustomerRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
