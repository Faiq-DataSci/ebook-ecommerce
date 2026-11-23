import type { MouseEvent } from 'react'
import { ADMIN_NAVIGATION_GROUPS } from '../../navigation/adminNavigation'
import { SidebarDropdown } from './SidebarDropdown'
import { SidebarMenuItem } from './SidebarMenuItem'

interface AdminSidebarProps {
  isCollapsed: boolean
  isMobileOpen: boolean
  expandedDropdowns: Record<string, boolean>
  activePath: string
  onToggleCollapse: () => void
  onToggleDropdown: (dropdownId: string) => void
  onCloseDropdown: (dropdownId: string) => void
  onNavigate: (path: string) => void
  onLogoutClick: () => void
}

export function AdminSidebar({
  isCollapsed,
  isMobileOpen,
  expandedDropdowns,
  activePath,
  onToggleCollapse,
  onToggleDropdown,
  onCloseDropdown,
  onNavigate,
  onLogoutClick,
}: AdminSidebarProps) {
  const handleLogout = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    onLogoutClick()
  }

  return (
    <aside
      id="main-sidebar"
      aria-label="Navigasi Utama Admin"
      className={`admin-sidebar ${isCollapsed ? 'is-collapsed' : ''} ${
        isMobileOpen ? 'is-mobile-open' : ''
      }`}
    >
      <div className="sidebar-scroll-area">
        {/* Branding Header */}
        <div className="sidebar-brand-header">
          <div className="sidebar-brand-top">
            <div
              className="sidebar-brand-identity"
              style={{ cursor: 'pointer' }}
              onClick={() => onNavigate('/admin/dashboard')}
              title="Kembali ke Dashboard Utama"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onNavigate('/admin/dashboard')
                }
              }}
            >
              <div className="sidebar-logo-box" aria-hidden="true">
                <img
                  src="/logo.png"
                  alt="BukuKita Logo"
                  className="sidebar-logo-img"
                />
              </div>
              <div className="sidebar-brand-text sidebar-label">
                <span className="sidebar-brand-title">BUKU KITA</span>
                <span className="sidebar-brand-subtitle">ADMIN CONSOLE</span>
              </div>
            </div>

            <button
              id="sidebar-toggle-btn"
              type="button"
              className="sidebar-toggle-btn nb-btn"
              title="Perkecil / Perluas Menu"
              aria-label={
                isCollapsed ? 'Perluas sidebar' : 'Perkecil sidebar'
              }
              onClick={onToggleCollapse}
            >
              <span
                id="sidebar-toggle-icon"
                className="material-symbols-outlined sidebar-toggle-icon"
              >
                {isCollapsed
                  ? 'keyboard_double_arrow_right'
                  : 'keyboard_double_arrow_left'}
              </span>
            </button>
          </div>

        </div>

        {/* Navigation Groups */}
        <div className="sidebar-nav-wrapper">
          <nav className="sidebar-nav" aria-label="Menu Konsol Admin">
            {ADMIN_NAVIGATION_GROUPS.map((group, groupIndex) => (
              <div
                key={group.id}
                style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
              >
                <div
                  className={`sidebar-label sidebar-group-heading ${
                    groupIndex > 0 ? 'mt-group' : ''
                  }`}
                >
                  {group.heading}
                </div>

                {group.entries.map((entry) => {
                  if (entry.type === 'single') {
                    return (
                      <SidebarMenuItem
                        key={entry.id}
                        item={entry}
                        isActive={activePath === entry.path}
                        onNavigate={onNavigate}
                      />
                    )
                  }

                  return (
                    <SidebarDropdown
                      key={entry.id}
                      dropdown={entry}
                      isOpen={Boolean(expandedDropdowns[entry.id])}
                      isSidebarCollapsed={isCollapsed}
                      activePath={activePath}
                      onToggle={onToggleDropdown}
                      onClose={onCloseDropdown}
                      onNavigate={onNavigate}
                    />
                  )
                })}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user-card" title="Budi Santoso">
          <div className="sidebar-user-left">
            <div className="sidebar-user-avatar">BS</div>
            <div className="sidebar-label sidebar-user-meta">
              <span className="sidebar-user-name">Budi Santoso</span>
              <span className="sidebar-user-id">ID-JKT-01 • ONLINE</span>
            </div>
          </div>
          <span
            className="sidebar-label sidebar-user-status"
            aria-hidden="true"
          />
        </div>

        <a
          href="#logout"
          onClick={handleLogout}
          className="sidebar-logout-btn nb-btn nb-btn-logout"
          title="Keluar / Log Out"
        >
          <span className="material-symbols-outlined sidebar-logout-icon">
            logout
          </span>
          <span className="sidebar-label">Keluar</span>
        </a>
      </div>
    </aside>
  )
}
