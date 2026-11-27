import type { PageSkeletonVariant } from './skeletonVariant'

interface PageContentSkeletonProps {
  variant?: PageSkeletonVariant
  /** Set true when rendered inside an existing page header/tabs container */
  embedded?: boolean
  /** Show top progress strip (default true when not embedded) */
  showTopBar?: boolean
}

export function PageContentSkeleton({
  variant = 'table',
  embedded = false,
  showTopBar,
}: PageContentSkeletonProps) {
  const shouldShowTopBar = showTopBar ?? !embedded
  const hasTabs =
    !embedded &&
    (variant === 'tabs-table' || variant === 'spk' || variant === 'settings')

  return (
    <div
      className={`nb-page-skeleton ${embedded ? 'is-embedded' : ''}`}
      role="status"
      aria-busy="true"
      aria-label="Memuat konten halaman admin"
    >
      {shouldShowTopBar && (
        <div className="nb-top-loading-bar" aria-hidden="true">
          <div className="nb-top-loading-bar-fill" />
        </div>
      )}

      {/* Page Header Banner */}
      {!embedded && (
        <div className="nb-shell-skeleton-banner" aria-hidden="true">
          <div className="nb-shell-skeleton-banner-left">
            <div className="nb-page-skeleton-badges">
              <div className="nb-skeleton-block" style={{ width: 128, height: 22 }} />
              <div className="nb-skeleton-block is-delay-1" style={{ width: 144, height: 22 }} />
            </div>
            <div className="nb-skeleton-block" style={{ width: 290, maxWidth: '80%', height: 30 }} />
            <div className="nb-skeleton-block is-delay-1" style={{ width: 440, maxWidth: '95%', height: 16 }} />
          </div>
          <div className="nb-shell-skeleton-banner-actions">
            <div className="nb-skeleton-block" style={{ width: 136, height: 42 }} />
            {variant !== 'settings' && (
              <div className="nb-skeleton-block is-delay-1" style={{ width: 112, height: 42 }} />
            )}
          </div>
        </div>
      )}

      {/* Sub-Navigation Tabs Strip */}
      {hasTabs && (
        <div className="nb-page-skeleton-tabs" aria-hidden="true">
          <div className="nb-page-skeleton-tab is-active nb-skeleton-block" />
          <div className="nb-page-skeleton-tab nb-skeleton-block is-delay-1" />
          {variant === 'settings' && (
            <>
              <div className="nb-page-skeleton-tab nb-skeleton-block is-delay-2" />
              <div className="nb-page-skeleton-tab nb-skeleton-block is-delay-3" />
            </>
          )}
        </div>
      )}

      {/* Variant: Dashboard */}
      {variant === 'dashboard' && (
        <>
          <div className="nb-shell-skeleton-kpi-grid" aria-hidden="true">
            {[0, 1, 2, 3].map((idx) => (
              <div key={idx} className="nb-shell-skeleton-kpi-card">
                <div className={`nb-skeleton-block is-delay-${idx % 3}`} style={{ width: '58%', height: 14 }} />
                <div className={`nb-skeleton-block is-delay-${(idx + 1) % 3}`} style={{ width: '74%', height: 30 }} />
                <div className={`nb-skeleton-block is-delay-${(idx + 2) % 3}`} style={{ width: '86%', height: 14 }} />
              </div>
            ))}
          </div>

          <div className="nb-shell-skeleton-panels" aria-hidden="true">
            <div className="nb-shell-skeleton-card">
              <div className="nb-skeleton-block" style={{ width: 220, height: 20 }} />
              <div className="nb-skeleton-block is-delay-1" style={{ width: '100%', height: 190 }} />
            </div>
            <div className="nb-shell-skeleton-card">
              <div className="nb-skeleton-block" style={{ width: 170, height: 20 }} />
              <div className="nb-skeleton-block is-delay-1" style={{ width: '100%', height: 48 }} />
              <div className="nb-skeleton-block is-delay-2" style={{ width: '100%', height: 48 }} />
              <div className="nb-skeleton-block is-delay-3" style={{ width: '100%', height: 48 }} />
            </div>
          </div>

          <div className="nb-shell-skeleton-table" aria-hidden="true">
            <div className="nb-shell-skeleton-table-head" />
            {[0, 1, 2, 3].map((rowIdx) => (
              <div key={rowIdx} className="nb-shell-skeleton-table-row">
                <div className="nb-skeleton-block" style={{ height: 18 }} />
                <div className="nb-skeleton-block is-delay-1" style={{ height: 18 }} />
                <div className="nb-skeleton-block is-delay-2" style={{ height: 18 }} />
                <div className="nb-skeleton-block is-delay-1" style={{ height: 18 }} />
                <div className="nb-skeleton-block is-delay-2" style={{ height: 18 }} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Variant: Table / Tabs-Table */}
      {(variant === 'table' || variant === 'tabs-table') && (
        <>
          <div className="nb-shell-skeleton-kpi-grid" aria-hidden="true">
            {[0, 1, 2, 3].map((idx) => (
              <div key={idx} className="nb-shell-skeleton-kpi-card">
                <div className={`nb-skeleton-block is-delay-${idx % 3}`} style={{ width: '52%', height: 14 }} />
                <div className={`nb-skeleton-block is-delay-${(idx + 1) % 3}`} style={{ width: '68%', height: 28 }} />
                <div className={`nb-skeleton-block is-delay-${(idx + 2) % 3}`} style={{ width: '80%', height: 12 }} />
              </div>
            ))}
          </div>

          <div className="nb-page-skeleton-toolbar" aria-hidden="true">
            <div className="nb-skeleton-block" style={{ flex: '1 1 260px', height: 40 }} />
            <div className="nb-skeleton-block is-delay-1" style={{ width: 150, height: 40 }} />
            <div className="nb-skeleton-block is-delay-2" style={{ width: 130, height: 40 }} />
          </div>

          <div className="nb-shell-skeleton-table" aria-hidden="true">
            <div className="nb-shell-skeleton-table-head" />
            {[0, 1, 2, 3, 4].map((rowIdx) => (
              <div key={rowIdx} className="nb-shell-skeleton-table-row">
                <div className="nb-skeleton-block" style={{ height: 18 }} />
                <div className="nb-skeleton-block is-delay-1" style={{ height: 18 }} />
                <div className="nb-skeleton-block is-delay-2" style={{ height: 18 }} />
                <div className="nb-skeleton-block is-delay-1" style={{ height: 18 }} />
                <div className="nb-skeleton-block is-delay-2" style={{ height: 18 }} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Variant: Analytics */}
      {variant === 'analytics' && (
        <>
          <div className="nb-shell-skeleton-kpi-grid" aria-hidden="true">
            {[0, 1, 2, 3].map((idx) => (
              <div key={idx} className="nb-shell-skeleton-kpi-card">
                <div className={`nb-skeleton-block is-delay-${idx % 3}`} style={{ width: '60%', height: 14 }} />
                <div className={`nb-skeleton-block is-delay-${(idx + 1) % 3}`} style={{ width: '72%', height: 30 }} />
                <div className={`nb-skeleton-block is-delay-${(idx + 2) % 3}`} style={{ width: '84%', height: 12 }} />
              </div>
            ))}
          </div>

          <div className="nb-page-skeleton-two-col" aria-hidden="true">
            <div className="nb-shell-skeleton-card">
              <div className="nb-skeleton-block" style={{ width: 210, height: 20 }} />
              <div className="nb-skeleton-block is-delay-1" style={{ width: '100%', height: 220 }} />
            </div>
            <div className="nb-shell-skeleton-card">
              <div className="nb-skeleton-block" style={{ width: 190, height: 20 }} />
              <div className="nb-skeleton-block is-delay-2" style={{ width: '100%', height: 220 }} />
            </div>
          </div>

          <div className="nb-shell-skeleton-card" aria-hidden="true">
            <div className="nb-skeleton-block" style={{ width: 240, height: 20 }} />
            <div className="nb-skeleton-block is-delay-1" style={{ width: '100%', height: 140 }} />
          </div>
        </>
      )}

      {/* Variant: SPK & Matrix SAW */}
      {variant === 'spk' && (
        <>
          <div className="nb-shell-skeleton-card" aria-hidden="true">
            <div className="nb-page-skeleton-toolbar" style={{ padding: 0, border: 'none', boxShadow: 'none', background: 'transparent' }}>
              <div className="nb-skeleton-block" style={{ width: 240, height: 22 }} />
              <div className="nb-skeleton-block is-delay-1" style={{ width: 140, height: 34 }} />
            </div>
            <div className="nb-skeleton-block is-delay-1" style={{ width: '100%', height: 26 }} />
          </div>

          <div className="nb-shell-skeleton-table" aria-hidden="true">
            <div className="nb-shell-skeleton-table-head" />
            {[0, 1, 2, 3, 4].map((rowIdx) => (
              <div key={rowIdx} className="nb-shell-skeleton-table-row">
                <div className="nb-skeleton-block" style={{ height: 18 }} />
                <div className="nb-skeleton-block is-delay-1" style={{ height: 18 }} />
                <div className="nb-skeleton-block is-delay-2" style={{ height: 18 }} />
                <div className="nb-skeleton-block is-delay-1" style={{ height: 18 }} />
                <div className="nb-skeleton-block is-delay-2" style={{ height: 18 }} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Variant: Settings */}
      {variant === 'settings' && (
        <div className="nb-page-skeleton-two-col" aria-hidden="true">
          <div className="nb-shell-skeleton-card">
            <div className="nb-skeleton-block" style={{ width: 200, height: 22 }} />
            <div className="nb-skeleton-block is-delay-1" style={{ width: '100%', height: 42 }} />
            <div className="nb-skeleton-block is-delay-2" style={{ width: '100%', height: 42 }} />
            <div className="nb-skeleton-block is-delay-3" style={{ width: '100%', height: 42 }} />
            <div className="nb-skeleton-block" style={{ width: 150, height: 40 }} />
          </div>
          <div className="nb-shell-skeleton-card">
            <div className="nb-skeleton-block" style={{ width: 180, height: 22 }} />
            <div className="nb-skeleton-block is-delay-1" style={{ width: '100%', height: 56 }} />
            <div className="nb-skeleton-block is-delay-2" style={{ width: '100%', height: 56 }} />
            <div className="nb-skeleton-block is-delay-3" style={{ width: '100%', height: 56 }} />
          </div>
        </div>
      )}

      {/* Variant: Form */}
      {variant === 'form' && (
        <div className="nb-shell-skeleton-panels" aria-hidden="true">
          <div className="nb-shell-skeleton-card">
            <div className="nb-skeleton-block" style={{ width: 220, height: 22 }} />
            <div className="nb-skeleton-block is-delay-1" style={{ width: '100%', height: 44 }} />
            <div className="nb-skeleton-block is-delay-2" style={{ width: '100%', height: 44 }} />
            <div className="nb-skeleton-block is-delay-3" style={{ width: '100%', height: 110 }} />
            <div className="nb-skeleton-block" style={{ width: 160, height: 44 }} />
          </div>
          <div className="nb-shell-skeleton-card">
            <div className="nb-skeleton-block" style={{ width: 160, height: 22 }} />
            <div className="nb-skeleton-block is-delay-1" style={{ width: '100%', height: 200 }} />
            <div className="nb-skeleton-block is-delay-2" style={{ width: '100%', height: 44 }} />
          </div>
        </div>
      )}
    </div>
  )
}
