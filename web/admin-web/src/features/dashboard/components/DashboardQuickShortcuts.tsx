import { QUICK_ACTIONS } from '../data/dashboardData'

interface DashboardQuickShortcutsProps {
  onNavigate: (path: string) => void
}

export function DashboardQuickShortcuts({ onNavigate }: DashboardQuickShortcutsProps) {
  return (
    <div className="quick-actions-card" role="region" aria-label="Pintasan Cepat Admin">
      <div className="widget-header">
        <div className="widget-title-row">
          <h2 className="widget-heading">Pintasan Cepat Admin</h2>
        </div>
        <span
          className="widget-tag"
          style={{ backgroundColor: 'var(--nb-yellow)', color: 'var(--nb-black)' }}
        >
          6 MODUL OPERASIONAL
        </span>
      </div>

      <p className="quick-actions-desc">
        Akses cepat modul inventaris buku, audit verifikasi webhook payment, laporan omzet kas, dan evaluasi rekomendasi SPK.
      </p>

      <div className="quick-shortcuts-grid">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            className="quick-shortcut-card nb-btn"
            onClick={() => onNavigate(action.targetPath)}
            title={`Buka modul ${action.label}`}
          >
            <div className="quick-shortcut-top">
              <span
                className="quick-shortcut-icon-box"
                style={{ backgroundColor: action.bgColor }}
                aria-hidden="true"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  {action.icon}
                </span>
              </span>
              {action.badgeText && (
                <span className="quick-shortcut-badge">
                  {action.badgeText}
                </span>
              )}
            </div>

            <div className="quick-shortcut-body">
              <span className="quick-shortcut-title">{action.label}</span>
              {action.description && (
                <span className="quick-shortcut-text">{action.description}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
