import type {
  CustomerStatusFilter,
  CustomerSummaryMetrics,
} from '../types/customer.types'

interface CustomerSummaryCardsProps {
  summary: CustomerSummaryMetrics | null
  liveDashboardActiveCount: number | null
  activeStatus: CustomerStatusFilter
  isLoading: boolean
  isSimulation: boolean
  onSelectStatus: (status: CustomerStatusFilter) => void
}

export function CustomerSummaryCards({
  summary,
  liveDashboardActiveCount,
  activeStatus,
  isLoading,
  isSimulation,
  onSelectStatus,
}: CustomerSummaryCardsProps) {
  if (isLoading) {
    return (
      <section
        className="sys-kpi-grid"
        aria-label="Memuat ringkasan pelanggan"
        aria-busy="true"
      >
        {[0, 1, 2, 3].map((idx) => (
          <div key={idx} className="sys-kpi-card">
            <div className="nb-skeleton-block" style={{ height: 16, width: '55%' }} />
            <div className="nb-skeleton-block is-delay-1" style={{ height: 32, width: '40%' }} />
            <div className="nb-skeleton-block is-delay-2" style={{ height: 14, width: '80%' }} />
          </div>
        ))}
      </section>
    )
  }

  // Jika daftar pelanggan belum tersedia dari backend, hanya tampilkan metrik yang benar-benar tersedia
  if (!summary) {
    if (liveDashboardActiveCount === null) {
      return null
    }

    return (
      <section
        className="sys-kpi-grid"
        aria-label="Ringkasan pelanggan dari backend"
      >
        <article className="sys-kpi-card">
          <span className="sys-kpi-label">Pelanggan Aktif (Backend)</span>
          <span className="sys-kpi-value">{liveDashboardActiveCount}</span>
          <span className="sys-kpi-subtext">
            Sumber nyata: GET /api/v1/admin/dashboard
          </span>
        </article>
      </section>
    )
  }

  const cards: Array<{
    id: string
    label: string
    value: number
    subtext: string
    filterTarget?: CustomerStatusFilter
  }> = [
    {
      id: 'total',
      label: 'Total Pengguna',
      value: summary.totalCustomers,
      subtext: isSimulation
        ? 'DATA SIMULASI — seluruh akun terdaftar'
        : 'Seluruh akun terdaftar pada sistem',
      filterTarget: 'ALL',
    },
    {
      id: 'active',
      label: 'Akun Aktif',
      value: summary.activeCustomers,
      subtext: isSimulation
        ? 'DATA SIMULASI — dapat masuk & bertransaksi'
        : 'Akun dengan status aktif (isActive = true)',
      filterTarget: 'ACTIVE',
    },
    {
      id: 'inactive',
      label: 'Akun Nonaktif',
      value: summary.inactiveCustomers,
      subtext: isSimulation
        ? 'DATA SIMULASI — akses masuk ditangguhkan'
        : 'Akun dengan status nonaktif (isActive = false)',
      filterTarget: 'INACTIVE',
    },
    {
      id: 'new-30d',
      label: 'Bergabung 30 Hari Terakhir',
      value: summary.newCustomersLast30Days,
      subtext: isSimulation
        ? 'DATA SIMULASI — pendaftaran terbaru'
        : 'Pendaftaran akun dalam 30 hari terakhir',
    },
  ]

  return (
    <section className="sys-kpi-grid" aria-label="Ringkasan statistik pelanggan">
      {cards.map((card) => {
        const isSelected =
          card.filterTarget !== undefined && activeStatus === card.filterTarget

        if (card.filterTarget) {
          return (
            <button
              key={card.id}
              type="button"
              className={`sys-kpi-card is-interactive nb-btn ${
                isSelected ? 'is-selected' : ''
              }`}
              aria-pressed={isSelected}
              onClick={() => onSelectStatus(card.filterTarget!)}
            >
              <span className="sys-kpi-label">{card.label}</span>
              <span className="sys-kpi-value">{card.value}</span>
              <span className="sys-kpi-subtext">{card.subtext}</span>
            </button>
          )
        }

        return (
          <article key={card.id} className="sys-kpi-card">
            <span className="sys-kpi-label">{card.label}</span>
            <span className="sys-kpi-value">{card.value}</span>
            <span className="sys-kpi-subtext">{card.subtext}</span>
          </article>
        )
      })}
    </section>
  )
}
