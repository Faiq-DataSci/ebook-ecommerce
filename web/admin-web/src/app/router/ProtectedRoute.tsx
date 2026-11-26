import { useEffect, useState, type FC, type ReactNode } from 'react'
import { useAuth } from '../../features/authentication/hooks/useAuth'
import { LoginPage } from '../../features/authentication/pages/LoginPage'
import { AdminShellSkeleton } from '../../shared/components/ui'

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
  const [isInitialHydrating, setIsInitialHydrating] = useState<boolean>(true)
  const [loadProgress, setLoadProgress] = useState<number>(35)

  // Wait for web fonts (Inter, Space Grotesk, Space Mono, Material Symbols) + smooth modern Neubrutalism loading
  useEffect(() => {
    let active = true

    const step1 = window.setTimeout(() => {
      if (active) setLoadProgress(68)
    }, 150)

    const step2 = window.setTimeout(() => {
      if (active) setLoadProgress(92)
    }, 340)

    const minSkeletonDelay = new Promise<void>((resolve) => {
      window.setTimeout(resolve, 480)
    })

    const fontsReadyWithTimeout = Promise.race<void>([
      'fonts' in document
        ? document.fonts.ready.then(() => undefined)
        : Promise.resolve(),
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, 900)
      }),
    ])

    Promise.all([minSkeletonDelay, fontsReadyWithTimeout]).then(() => {
      if (active) {
        setLoadProgress(100)
        setIsInitialHydrating(false)
      }
    })

    return () => {
      active = false
      window.clearTimeout(step1)
      window.clearTimeout(step2)
    }
  }, [])

  // 1. Initial Session Verification & Font Hydration Skeleton State
  if (isLoading || isInitialHydrating) {
    const statusText = isLoading
      ? 'Memverifikasi sesi administrator...'
      : loadProgress < 80
        ? 'Memuat tipografi & tata letak...'
        : 'Menyiapkan ruang kerja admin...'

    return (
      <AdminShellSkeleton
        statusText={statusText}
        progressPercent={isLoading ? 40 : loadProgress}
      />
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
