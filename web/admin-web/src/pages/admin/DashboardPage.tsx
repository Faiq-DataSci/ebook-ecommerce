import { useState } from 'react'
import { DashboardContent } from '../../components/admin/DashboardContent'
import { resolveRouteMeta } from '../../data/adminNavigation'
import { useSidebar } from '../../hooks/useSidebar'
import { AdminLayout } from '../../layouts/AdminLayout'

export function DashboardPage() {
  const {
    isCollapsed,
    isMobileOpen,
    expandedDropdowns,
    activePath,
    toggleSidebarCollapse,
    toggleMobileSidebar,
    closeMobileSidebar,
    toggleDropdown,
    closeDropdown,
    navigateTo,
  } = useSidebar()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [actionNotice, setActionNotice] = useState<string | null>(null)

  const routeMeta = resolveRouteMeta(activePath)

  const handleLogoutClick = () => {
    setActionNotice(
      'Konfirmasi: Tombol Keluar ditekan. Sesi admin tetap aktif pada mode pratinjau konsol.',
    )
  }

  return (
    <AdminLayout
      isCollapsed={isCollapsed}
      isMobileOpen={isMobileOpen}
      expandedDropdowns={expandedDropdowns}
      activePath={activePath}
      breadcrumbText={routeMeta.breadcrumb}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onToggleCollapse={toggleSidebarCollapse}
      onToggleMobileMenu={toggleMobileSidebar}
      onCloseMobileMenu={closeMobileSidebar}
      onToggleDropdown={toggleDropdown}
      onCloseDropdown={closeDropdown}
      onNavigate={(path) => {
        setActionNotice(null)
        navigateTo(path)
      }}
      onLogoutClick={handleLogoutClick}
    >
      {actionNotice && (
        <div className="route-section-banner" role="status">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 20 }}
              aria-hidden="true"
            >
              info
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {actionNotice}
            </span>
          </div>
          <button
            type="button"
            className="page-btn nb-btn"
            onClick={() => setActionNotice(null)}
          >
            Tutup
          </button>
        </div>
      )}

      {!routeMeta.implemented && (
        <div
          className="route-section-banner"
          role="region"
          aria-label="Status Rute Submenu"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                className="badge-ikhtisar"
                style={{ backgroundColor: '#B8A9FA' }}
              >
                {routeMeta.parentLabel
                  ? `${routeMeta.parentLabel} / ${routeMeta.label}`
                  : routeMeta.label}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                Rute: {routeMeta.path} [RENCANA]
              </span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 500, color: '#404040' }}>
              Navigasi submenu aktif telah tersinkronisasi. Modul halaman tujuan
              ini berstatus [RENCANA] pada roadmap proyek; menampilkan ringkasan
              Dashboard Utama di bawah.
            </span>
          </div>
          <button
            type="button"
            className="page-btn nb-btn is-active"
            onClick={() => navigateTo('/admin/dashboard')}
          >
            Kembali ke Dashboard
          </button>
        </div>
      )}

      <DashboardContent
        searchQuery={searchQuery}
        onNavigate={navigateTo}
        onActionNotice={setActionNotice}
      />
    </AdminLayout>
  )
}
