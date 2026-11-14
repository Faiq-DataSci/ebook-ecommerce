import type { ReactNode } from 'react'
import { AdminHeader } from '../components/admin/AdminHeader'
import { AdminSidebar } from '../components/admin/AdminSidebar'

interface AdminLayoutProps {
  isCollapsed: boolean
  isMobileOpen: boolean
  expandedDropdowns: Record<string, boolean>
  activePath: string
  breadcrumbText: string
  searchQuery: string
  onSearchChange: (value: string) => void
  onToggleCollapse: () => void
  onToggleMobileMenu: () => void
  onCloseMobileMenu: () => void
  onToggleDropdown: (dropdownId: string) => void
  onCloseDropdown: (dropdownId: string) => void
  onNavigate: (path: string) => void
  onLogoutClick: () => void
  children: ReactNode
}

export function AdminLayout({
  isCollapsed,
  isMobileOpen,
  expandedDropdowns,
  activePath,
  breadcrumbText,
  searchQuery,
  onSearchChange,
  onToggleCollapse,
  onToggleMobileMenu,
  onCloseMobileMenu,
  onToggleDropdown,
  onCloseDropdown,
  onNavigate,
  onLogoutClick,
  children,
}: AdminLayoutProps) {
  return (
    <div className="admin-shell">
      {isMobileOpen && (
        <div
          className="sidebar-backdrop"
          aria-hidden="true"
          onClick={onCloseMobileMenu}
        />
      )}

      <AdminSidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        expandedDropdowns={expandedDropdowns}
        activePath={activePath}
        onToggleCollapse={onToggleCollapse}
        onToggleDropdown={onToggleDropdown}
        onCloseDropdown={onCloseDropdown}
        onNavigate={onNavigate}
        onLogoutClick={onLogoutClick}
      />

      <div
        id="main-wrapper"
        className={`main-wrapper ${isCollapsed ? 'is-sidebar-collapsed' : ''}`}
      >
        <AdminHeader
          isSidebarCollapsed={isCollapsed}
          breadcrumbText={breadcrumbText}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onToggleMobileMenu={onToggleMobileMenu}
        />

        <main className="main-content">{children}</main>
      </div>
    </div>
  )
}
