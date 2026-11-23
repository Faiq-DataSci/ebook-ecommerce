import { useState } from 'react'
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
import './styles/tokens.css'
import './styles/admin-layout.css'
import './styles/admin-sidebar.css'
import './styles/dashboard.css'
import './styles/catalog.css'
import './styles/transaction-finance.css'
import './styles/analytics.css'

export function App() {
  const sidebar = useSidebar()
  const [customBreadcrumb, setCustomBreadcrumb] = useState<{
    path: string
    text: string
  } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [actionNotice, setActionNotice] = useState<string | null>(null)

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
          onBreadcrumbChange={(text) =>
            setCustomBreadcrumb({ path: sidebar.activePath, text })
          }
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
      onLogoutClick={() =>
        setActionNotice('Aksi Logout: Sesi pratinjau admin tetap aktif untuk pengujian UI.')
      }
    >
      {pageContent}
    </AdminLayout>
  )
}

export default App
