import { Link, Outlet } from 'react-router-dom';
import { APP_CONFIG } from '../../constants/app.constants';
import { ROUTES } from '../../constants/routes';
import { SimulationBadge } from '../ui/Badge';
import { Footer } from './Footer';

export function AuthLayout() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--nb-paper)',
      }}
    >
      <a href="#auth-main-content" className="nb-skip-link">
        Lewati ke formulir autentikasi
      </a>

      <header
        style={{
          backgroundColor: 'var(--nb-white)',
          borderBottom: 'var(--nb-border-thick)',
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
            gap: 'var(--nb-space-3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
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
              }}
            >
              {APP_CONFIG.BRAND_NAME}
            </Link>
            <SimulationBadge />
          </div>

          <Link
            to={ROUTES.CATALOG}
            className="nb-pressable"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '44px',
              paddingInline: '16px',
              backgroundColor: 'var(--nb-white)',
              fontFamily: 'var(--nb-font-heading)',
              fontWeight: 700,
            }}
          >
            <span>Kembali ke Katalog</span>
          </Link>
        </div>
      </header>

      <main
        id="auth-main-content"
        className="nb-container"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBlock: 'var(--nb-space-12)',
        }}
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
