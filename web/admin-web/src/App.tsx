import { useEffect, useState } from 'react'
import { AdminLayout } from './app/layouts/AdminLayout'
import { resolveRouteMeta } from './app/navigation/adminNavigation'
import { useSidebar } from './app/hooks/useSidebar'
import { DashboardPage } from './features/dashboard/pages/DashboardPage'
import { EbookCatalogPage } from './features/ebooks/pages/EbookCatalogPage'
import { CategoryCatalogPage } from './features/categories/pages/CategoryCatalogPage'
import { AuthorPublisherPage } from './features/authors-publishers/pages/AuthorPublisherPage'
import { TransactionFinancePage } from './features/transactions/pages/TransactionFinancePage'
import { FinancePage } from './features/finance/pages/FinancePage'
import { AnalyticsPage } from './features/analytics/pages/AnalyticsPage'
import { SpkRecommendationPage } from './features/spk-recommendations/pages/SpkRecommendationPage'
import { LoginPage } from './features/authentication/pages/LoginPage'
import { AuthProvider } from './app/providers/AuthProvider'
import { ProtectedRoute } from './app/router/ProtectedRoute'
import { useAuth } from './features/authentication/hooks/useAuth'
import { ConfirmDialog } from './shared/components/ui/ConfirmDialog'
import './styles/tokens.css'
import './styles/admin-layout.css'
import './styles/admin-sidebar.css'
import './styles/dashboard.css'
import './styles/catalog.css'
import './styles/transaction-finance.css'
import './styles/analytics.css'

function AdminAppContent() {
  const sidebar = useSidebar()
  const { user, isAuthenticated, logout } = useAuth()
  const [customBreadcrumb, setCustomBreadcrumb] = useState<{
    path: string
    text: string
  } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [actionNotice, setActionNotice] = useState<string | null>(null)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

  // Auto-redirect from /login to /admin/dashboard if already authenticated as ADMIN
  useEffect(() => {
    if (sidebar.activePath === '/login' && isAuthenticated && user?.role === 'ADMIN') {
      sidebar.navigateTo('/admin/dashboard')
    }
  }, [sidebar.activePath, isAuthenticated, user?.role, sidebar])

  // Explicit /login route view
  if (sidebar.activePath === '/login') {
    if (isAuthenticated && user?.role === 'ADMIN') {
      // Admin is already logged in, redirect handled in effect
    } else {
      return (
        <LoginPage
          onLoginSuccess={() => sidebar.navigateTo('/admin/dashboard')}
        />
      )
    }
  }

  const routeMeta = resolveRouteMeta(sidebar.activePath)
  const breadcrumbText =
    customBreadcrumb && customBreadcrumb.path === sidebar.activePath
      ? customBreadcrumb.text
      : routeMeta.breadcrumb

  let pageContent: React.ReactNode

  switch (sidebar.activePath) {
    case '/admin/katalog/ebook':
      pageContent = (
        <EbookCatalogPage
          initialView="LIST"
          currentPath={sidebar.activePath}
          onBreadcrumbChange={(text) =>
            setCustomBreadcrumb({ path: sidebar.activePath, text })
          }
          onNavigate={sidebar.navigateTo}
        />
      )
      break
    case '/admin/katalog/tambah':
      pageContent = (
        <EbookCatalogPage
          initialView="FORM"
          currentPath={sidebar.activePath}
          onBreadcrumbChange={(text) =>
            setCustomBreadcrumb({ path: sidebar.activePath, text })
          }
          onNavigate={sidebar.navigateTo}
        />
      )
      break
    case '/admin/katalog/kategori':
      pageContent = <CategoryCatalogPage />
      break
    case '/admin/katalog/penulis':
      pageContent = <AuthorPublisherPage />
      break
    case '/admin/transaksi/pesanan':
    case '/admin/transaksi/verifikasi':
      pageContent = (
        <TransactionFinancePage
          currentPath={sidebar.activePath}
          onNavigate={sidebar.navigateTo}
        />
      )
      break
    case '/admin/keuangan/laporan':
    case '/admin/keuangan/settlement':
    case '/admin/transaksi/laporan':
      pageContent = (
        <FinancePage
          currentPath={sidebar.activePath}
          onNavigate={sidebar.navigateTo}
        />
      )
      break
    case '/admin/analitik':
      pageContent = <AnalyticsPage onNavigate={sidebar.navigateTo} />
      break
    case '/admin/spk/kriteria':
    case '/admin/spk/matriks':
      pageContent = (
        <SpkRecommendationPage
          currentPath={sidebar.activePath}
          onNavigate={sidebar.navigateTo}
        />
      )
      break
    default:
      pageContent = (
        <DashboardPage
          searchQuery={searchQuery}
          onNavigate={sidebar.navigateTo}
          actionNotice={actionNotice}
          onClearActionNotice={() => setActionNotice(null)}
          activePath={sidebar.activePath}
        />
      )
      break
  }

  return (
    <ProtectedRoute
      onNavigateToLogin={() => sidebar.navigateTo('/login')}
      onNavigateToDashboard={() => sidebar.navigateTo('/admin/dashboard')}
    >
      <AdminLayout
        isCollapsed={sidebar.isCollapsed}
        isMobileOpen={sidebar.isMobileOpen}
        expandedDropdowns={sidebar.expandedDropdowns}
        activePath={sidebar.activePath}
        breadcrumbText={breadcrumbText}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleCollapse={sidebar.toggleSidebarCollapse}
        onToggleMobileMenu={sidebar.toggleMobileSidebar}
        onCloseMobileMenu={sidebar.closeMobileSidebar}
        onToggleDropdown={sidebar.toggleDropdown}
        onCloseDropdown={sidebar.closeDropdown}
        onNavigate={sidebar.navigateTo}
        onLogoutClick={() => setIsLogoutDialogOpen(true)}
      >
        {pageContent}
      </AdminLayout>

      <ConfirmDialog
        open={isLogoutDialogOpen}
        title="Konfirmasi Keluar Sesi"
        confirmLabel="Ya, Keluar"
        cancelLabel="Batal"
        confirmVariant="danger"
        onConfirm={async () => {
          setIsLogoutDialogOpen(false)
          await logout()
          sidebar.navigateTo('/login')
        }}
        onCancel={() => setIsLogoutDialogOpen(false)}
      >
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
          Apakah Anda yakin ingin mengakhiri sesi administrator ini? Anda harus masuk kembali dengan akun <strong>ADMIN</strong> untuk mengakses konsol manajemen.
        </p>
      </ConfirmDialog>
    </ProtectedRoute>
  )
}

export function App() {
  return (
    <AuthProvider>
      <AdminAppContent />
    </AuthProvider>
  )
}

export default App
