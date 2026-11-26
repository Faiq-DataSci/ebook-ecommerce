interface SidebarBrandHeaderProps {
  isCollapsed: boolean
  onNavigateDashboard: () => void
  onToggleCollapse: () => void
}

export function SidebarBrandHeader({
  isCollapsed,
  onNavigateDashboard,
  onToggleCollapse,
}: SidebarBrandHeaderProps) {
  return (
    <div className="sidebar-brand-header">
      <div className="sidebar-brand-top">
        <button
          type="button"
          className="sidebar-brand-identity"
          onClick={onNavigateDashboard}
          title="Kembali ke Dashboard Utama"
          aria-label="Buku Kita Admin Console — Kembali ke Dashboard"
        >
          <span className="sidebar-logo-box" aria-hidden="true">
            <img
              src="/logo.png"
              alt=""
              className="sidebar-logo-img"
            />
          </span>
          <span className="sidebar-brand-text sidebar-label">
            <span className="sidebar-brand-title">Buku Kita</span>
            <span className="sidebar-brand-subtitle">Admin Console</span>
          </span>
        </button>

        <button
          id="sidebar-toggle-btn"
          type="button"
          className="sidebar-toggle-btn nb-btn"
          title={isCollapsed ? 'Perluas sidebar' : 'Perkecil sidebar'}
          aria-label={isCollapsed ? 'Perluas sidebar' : 'Perkecil sidebar'}
          aria-expanded={!isCollapsed}
          onClick={onToggleCollapse}
        >
          <span
            id="sidebar-toggle-icon"
            className="material-symbols-outlined sidebar-toggle-icon"
            aria-hidden="true"
          >
            {isCollapsed
              ? 'keyboard_double_arrow_right'
              : 'keyboard_double_arrow_left'}
          </span>
        </button>
      </div>
    </div>
  )
}
