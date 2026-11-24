import type { FC, ReactNode } from 'react'
import { useAuth } from '../../features/authentication/hooks/useAuth'
import { LoginPage } from '../../features/authentication/pages/LoginPage'

interface ProtectedRouteProps {
  children: ReactNode
  onNavigateToLogin?: () => void
  onNavigateToDashboard?: () => void
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  onNavigateToLogin,
  onNavigateToDashboard,
}) => {
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  // 1. Initial Session Verification State
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--nb-paper)',
          backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          padding: 24,
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--nb-white)',
            border: '3px solid #000000',
            boxShadow: '6px 6px 0 0 #000000',
            padding: '32px 40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              border: '3px solid #000000',
              borderTopColor: 'transparent',
              animation: 'spin 0.6s linear infinite',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: 15,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Memeriksa Sesi Administrator...
          </span>
        </div>
      </div>
    )
  }

  // 2. Unauthenticated State: Show Login Page
  if (!isAuthenticated || !user) {
    return (
      <LoginPage
        onLoginSuccess={() => {
          if (onNavigateToDashboard) {
            onNavigateToDashboard()
          }
        }}
      />
    )
  }

  // 3. Authenticated but non-ADMIN State (403 Forbidden)
  if (user.role !== 'ADMIN') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--nb-paper)',
          padding: 24,
        }}
      >
        <div
          style={{
            maxWidth: 480,
            width: '100%',
            backgroundColor: 'var(--nb-white)',
            border: '3px solid #000000',
            boxShadow: '8px 8px 0 0 #000000',
            padding: 36,
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--nb-pink)',
              border: '2px solid #000000',
              padding: '8px 12px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: 12,
              marginBottom: 16,
              display: 'inline-block',
            }}
          >
            HTTP 403 — FORBIDDEN
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 24,
              fontWeight: 700,
              margin: '0 0 12px 0',
            }}
          >
            Akses Ditolak
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              color: 'var(--nb-text-muted)',
              marginBottom: 24,
              lineHeight: 1.5,
            }}
          >
            Akun Anda terautentikasi namun tidak memiliki hak akses administrator untuk membuka konsol ini.
          </p>
          <button
            type="button"
            onClick={async () => {
              await logout()
              if (onNavigateToLogin) {
                onNavigateToLogin()
              }
            }}
            className="nb-btn"
            style={{
              width: '100%',
              height: 44,
              backgroundColor: 'var(--nb-yellow)',
              border: '2.5px solid #000000',
              boxShadow: '4px 4px 0 0 #000000',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Keluar dan Kembali ke Login
          </button>
        </div>
      </div>
    )
  }

  // 4. Authorized ADMIN Access
  return <>{children}</>
}
