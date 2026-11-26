interface SidebarFooterProps {
  displayName: string
  initials: string
  isSimulation: boolean
  onLogoutClick: () => void
}

export function SidebarFooter({
  displayName,
  initials,
  isSimulation,
  onLogoutClick,
}: SidebarFooterProps) {
  return (
    <div className="sidebar-footer">
      <div className="sidebar-user-card" title={displayName}>
        <div className="sidebar-user-left">
          <div className="sidebar-user-avatar" aria-hidden="true">
            {initials}
          </div>
          <div className="sidebar-label sidebar-user-meta">
            <span className="sidebar-user-name">{displayName}</span>
            <span className="sidebar-user-id">
              {isSimulation ? 'DATA SIMULASI' : 'Administrator'}
            </span>
          </div>
        </div>
        <span
          className="sidebar-label sidebar-user-status"
          aria-hidden="true"
        />
      </div>

      <button
        type="button"
        onClick={onLogoutClick}
        className="sidebar-logout-btn nb-btn nb-btn-logout"
        title="Keluar dari konsol admin"
      >
        <span
          className="material-symbols-outlined sidebar-logout-icon"
          aria-hidden="true"
        >
          logout
        </span>
        <span className="sidebar-label">Keluar</span>
      </button>
    </div>
  )
}
