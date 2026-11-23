import { DashboardContent } from '../components/DashboardContent'
import { resolveRouteMeta } from '../../../app/navigation/adminNavigation'

interface DashboardPageProps {
  searchQuery?: string
  onNavigate: (path: string) => void
  actionNotice?: string | null
  onClearActionNotice?: () => void
  activePath?: string
}

export function DashboardPage({
  searchQuery = '',
  onNavigate,
  actionNotice,
  onClearActionNotice,
  activePath,
}: DashboardPageProps) {
  const currentPath = activePath || window.location.pathname
  const routeMeta = resolveRouteMeta(currentPath)

  return (
    <>
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
          {onClearActionNotice && (
            <button
              type="button"
              className="page-btn nb-btn"
              onClick={onClearActionNotice}
            >
              Tutup
            </button>
          )}
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
            onClick={() => onNavigate('/admin/dashboard')}
          >
            Kembali ke Dashboard
          </button>
        </div>
      )}

      <DashboardContent
        searchQuery={searchQuery}
        onNavigate={onNavigate}
        onActionNotice={() => {}}
      />
    </>
  )
}
