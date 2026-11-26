import { ADMIN_NAVIGATION_GROUPS } from '../../navigation/adminNavigation'
import { useAuth } from '../../../features/authentication/hooks/useAuth'
import { SidebarBrandHeader } from './SidebarBrandHeader'
import { SidebarDropdown } from './SidebarDropdown'
import { SidebarFooter } from './SidebarFooter'
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

function getInitials(fullName?: string): string {
  if (!fullName) return 'AD'
  return fullName
    .replace('DATA SIMULASI - ', '')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
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
  const { user } = useAuth()
  const displayName = user?.fullName || 'Administrator Toko'
  const initials = getInitials(user?.fullName)

  return (
    <aside
      id="main-sidebar"
      aria-label="Navigasi Utama Admin"
      className={`admin-sidebar ${isCollapsed ? 'is-collapsed' : ''} ${
        isMobileOpen ? 'is-mobile-open' : ''
      }`}
    >
      <div className="sidebar-scroll-area">
        <SidebarBrandHeader
          isCollapsed={isCollapsed}
          onNavigateDashboard={() => onNavigate('/admin/dashboard')}
          onToggleCollapse={onToggleCollapse}
        />

        <div className="sidebar-nav-wrapper">
          <nav className="sidebar-nav" aria-label="Menu Konsol Admin">
            {ADMIN_NAVIGATION_GROUPS.map((group, groupIndex) => {
              const headingId = `sidebar-group-heading-${group.id}`
              return (
                <div
                  key={group.id}
                  role="group"
                  aria-labelledby={headingId}
                  className="sidebar-nav-group"
                >
                  <p
                    id={headingId}
                    className={`sidebar-label sidebar-group-heading ${
                      groupIndex > 0 ? 'mt-group' : ''
                    }`}
                  >
                    {group.heading}
                  </p>

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
              )
            })}
          </nav>
        </div>
      </div>

      <SidebarFooter
        displayName={displayName}
        initials={initials}
        isSimulation={Boolean(user?.isSimulation)}
        onLogoutClick={onLogoutClick}
      />
    </aside>
  )
}
