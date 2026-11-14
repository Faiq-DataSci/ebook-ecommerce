import type { MouseEvent } from 'react'
import { ADMIN_NAVIGATION_GROUPS } from '../../data/adminNavigation'
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
            <div className="sidebar-brand-identity">
              <div className="sidebar-logo-box" aria-hidden="true">
                <svg
                  className="sidebar-logo-svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 5.5C3 4.67 3.67 4 4.5 4H10.5C11.33 4 12 4.67 12 5.5V18.5C12 19.33 11.33 20 10.5 20H4.5C3.67 20 3 19.33 3 18.5V5.5Z"
                    fill="#FFD23F"
                    stroke="#000000"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 5.5C12 4.67 12.67 4 13.5 4H19.5C20.33 4 21 4.67 21 5.5V18.5C21 19.33 20.33 20 19.5 20H13.5C12.67 20 12 19.33 12 18.5V5.5Z"
                    fill="#FFD23F"
                    stroke="#000000"
                    strokeWidth="1.5"
                  />
                  <line
                    stroke="#000000"
                    strokeWidth="1.5"
                    x1="5"
                    x2="10"
                    y1="8"
                    y2="8"
                  />
                  <line
                    stroke="#000000"
                    strokeWidth="1.5"
                    x1="5"
                    x2="10"
                    y1="12"
                    y2="12"
                  />
                  <line
                    stroke="#000000"
                    strokeWidth="1.5"
                    x1="14"
                    x2="19"
                    y1="8"
                    y2="8"
                  />
                  <line
                    stroke="#000000"
                    strokeWidth="1.5"
                    x1="14"
                    x2="19"
                    y1="12"
                    y2="12"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    fill="#FFFFFF"
                    r="2"
                    stroke="#000000"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <div className="sidebar-brand-text sidebar-label">
                <span className="sidebar-brand-title">BACA BUKU</span>
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

          <div className="sidebar-label sidebar-version-strip">
            <div className="sidebar-version-left">
              <span className="sidebar-version-dot" aria-hidden="true" />
              <span className="sidebar-version-text">PROD v2.4</span>
            </div>
            <span className="sidebar-version-online">ONLINE</span>
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
