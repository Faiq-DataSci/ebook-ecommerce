export interface NeubrutalismLoaderCardProps {
  title?: string
  statusText?: string
  progressPercent?: number
  showBackdrop?: boolean
  showTopBar?: boolean
}

export function NeubrutalismLoaderCard({
  title = 'Memuat Konsol Admin',
  statusText = 'Menyiapkan konsol administrator...',
  progressPercent = 72,
  showBackdrop = false,
  showTopBar = false,
}: NeubrutalismLoaderCardProps) {
  return (
    <>
      {showTopBar && (
        <div className="nb-top-loading-bar" aria-hidden="true">
          <div className="nb-top-loading-bar-fill" />
        </div>
      )}

      <div
        className={`nb-loader-floating-wrap ${showBackdrop ? 'has-scrim' : ''}`}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="nb-loader-card">
          <div className="nb-loader-card-top">
            <span className="nb-loader-brand">BUKU KITA · ADMIN</span>
            <span className="nb-loader-percent">{progressPercent}%</span>
          </div>

          <div className="nb-loader-card-body">
            <div className="nb-loader-squares" aria-hidden="true">
              <span className="nb-loader-sq is-1" />
              <span className="nb-loader-sq is-2" />
              <span className="nb-loader-sq is-3" />
              <span className="nb-loader-sq is-4" />
            </div>

            <div className="nb-loader-copy">
              <div className="nb-loader-title">{title}</div>
              <div className="nb-loader-subtitle">{statusText}</div>
            </div>
          </div>

          <div
            className="nb-loader-progress-track"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="nb-loader-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

interface AdminShellSkeletonProps {
  title?: string
  statusText?: string
  progressPercent?: number
}

export function AdminShellSkeleton({
  title = 'Memuat Konsol Admin',
  statusText = 'Menyiapkan konsol administrator...',
  progressPercent = 72,
}: AdminShellSkeletonProps) {
  return (
    <div
      className="nb-shell-skeleton"
      role="status"
      aria-busy="true"
      aria-label="Memuat halaman konsol administrator"
    >
      {/* Top Neubrutalism Progress Strip (design.md §5.8) */}
      <div className="nb-top-loading-bar" aria-hidden="true">
        <div className="nb-top-loading-bar-fill" />
      </div>

      {/* Sidebar Skeleton */}
      <aside className="nb-shell-skeleton-sidebar" aria-hidden="true">
        <div className="nb-shell-skeleton-sidebar-top">
          <div className="nb-shell-skeleton-brand nb-skeleton-block" />

          <div className="nb-shell-skeleton-nav-group">
            <div className="nb-shell-skeleton-nav-item is-active nb-skeleton-block" />
            <div className="nb-shell-skeleton-nav-item nb-skeleton-block is-delay-1" />
            <div className="nb-shell-skeleton-nav-item nb-skeleton-block is-delay-2" />
            <div className="nb-shell-skeleton-nav-item nb-skeleton-block is-delay-1" />
            <div className="nb-shell-skeleton-nav-item nb-skeleton-block is-delay-2" />
            <div className="nb-shell-skeleton-nav-item nb-skeleton-block is-delay-3" />
          </div>
        </div>

        <div className="nb-shell-skeleton-footer nb-skeleton-block" />
      </aside>

      {/* Main Column Skeleton */}
      <div className="nb-shell-skeleton-main">
        {/* Top Header Skeleton */}
        <header className="nb-shell-skeleton-header" aria-hidden="true">
          <div className="nb-skeleton-block" style={{ width: 180, height: 22 }} />
          <div
            className="nb-skeleton-block"
            style={{ width: 320, maxWidth: '40%', height: 34 }}
          />
          <div className="nb-skeleton-block" style={{ width: 112, height: 34 }} />
        </header>

        {/* Page Content Skeleton */}
        <main className="nb-shell-skeleton-body" aria-hidden="true">
          {/* Page Header / Welcome Banner */}
          <div className="nb-shell-skeleton-banner">
            <div className="nb-shell-skeleton-banner-left">
              <div className="nb-skeleton-block" style={{ width: 260, maxWidth: '75%', height: 28 }} />
              <div className="nb-skeleton-block is-delay-1" style={{ width: 420, maxWidth: '95%', height: 16 }} />
            </div>
            <div className="nb-shell-skeleton-banner-actions">
              <div className="nb-skeleton-block" style={{ width: 132, height: 42 }} />
              <div className="nb-skeleton-block is-delay-1" style={{ width: 110, height: 42 }} />
            </div>
          </div>

          {/* 4 KPI Cards */}
          <div className="nb-shell-skeleton-kpi-grid">
            {[0, 1, 2, 3].map((idx) => (
              <div key={idx} className="nb-shell-skeleton-kpi-card">
                <div
                  className={`nb-skeleton-block is-delay-${idx % 3}`}
                  style={{ width: '58%', height: 14 }}
                />
                <div
                  className={`nb-skeleton-block is-delay-${(idx + 1) % 3}`}
                  style={{ width: '72%', height: 30 }}
                />
                <div
                  className={`nb-skeleton-block is-delay-${(idx + 2) % 3}`}
                  style={{ width: '88%', height: 14 }}
                />
              </div>
            ))}
          </div>

          {/* Chart & Summary Panels */}
          <div className="nb-shell-skeleton-panels">
            <div className="nb-shell-skeleton-card">
              <div className="nb-skeleton-block" style={{ width: 220, height: 20 }} />
              <div className="nb-skeleton-block is-delay-1" style={{ width: '100%', height: 180 }} />
            </div>
            <div className="nb-shell-skeleton-card">
              <div className="nb-skeleton-block" style={{ width: 160, height: 20 }} />
              <div className="nb-skeleton-block is-delay-1" style={{ width: '100%', height: 46 }} />
              <div className="nb-skeleton-block is-delay-2" style={{ width: '100%', height: 46 }} />
              <div className="nb-skeleton-block is-delay-3" style={{ width: '100%', height: 46 }} />
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="nb-shell-skeleton-table">
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
        </main>
      </div>

      {/* Modern Neubrutalism Floating Status Loader (design.md §5.8 & §8.1) */}
      <NeubrutalismLoaderCard
        title={title}
        statusText={statusText}
        progressPercent={progressPercent}
      />
    </div>
  )
}
