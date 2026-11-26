import type { DashboardPeriod } from '../types/dashboard'

interface DashboardWelcomeBannerProps {
  selectedPeriod: DashboardPeriod
  periodOptions: DashboardPeriod[]
  onSelectPeriod: (period: DashboardPeriod) => void
  onAddEbook: () => void
  onDownloadCsv: () => void
}

export function DashboardWelcomeBanner({
  selectedPeriod,
  periodOptions,
  onSelectPeriod,
  onAddEbook,
  onDownloadCsv,
}: DashboardWelcomeBannerProps) {
  return (
    <section className="welcome-banner" aria-label="Ikhtisar Utama Dashboard">
      <div className="welcome-top-stripe" aria-hidden="true">
        <div style={{ backgroundColor: '#FFD23F' }} />
        <div style={{ backgroundColor: '#74B9FF' }} />
        <div style={{ backgroundColor: '#88D498' }} />
      </div>

      <div className="welcome-left">
        <div>
          <h1 className="welcome-title">Selamat datang kembali, Faiq!</h1>
          <p className="welcome-subtitle">
            Pantau performa penjualan katalog e-book, kelola verifikasi
            transaksi otomatis, dan pantau proteksi DRM terkini.
          </p>
        </div>
      </div>

      <div className="welcome-right">
        <div
          className="period-switcher"
          role="group"
          aria-label="Filter Periode"
        >
          {periodOptions.map((period) => {
            const active = selectedPeriod === period
            return (
              <button
                key={period}
                type="button"
                className={`period-btn ${active ? 'is-active' : ''}`}
                aria-pressed={active}
                onClick={() => onSelectPeriod(period)}
              >
                {period}
              </button>
            )
          })}
        </div>

        <div className="welcome-actions">
          <button
            type="button"
            className="btn-primary-add nb-btn"
            onClick={onAddEbook}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 18, fontWeight: 700 }}
              aria-hidden="true"
            >
              add_circle
            </span>
            <span>+ Tambah E-Book</span>
          </button>
          <button
            type="button"
            className="btn-secondary-csv nb-btn"
            onClick={onDownloadCsv}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 18 }}
              aria-hidden="true"
            >
              download
            </span>
            <span>Unduh CSV</span>
          </button>
        </div>
      </div>
    </section>
  )
}
