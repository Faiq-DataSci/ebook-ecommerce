export type CatalogKpiTone =
  | 'yellow'
  | 'green'
  | 'muted'
  | 'blue'
  | 'orange'

export interface CatalogKpiItem {
  id: string
  label: string
  value: string | number
  unit?: string
  subtext: string
  icon?: string
  tone: CatalogKpiTone
  isSelected?: boolean
  onClick?: () => void
}

interface CatalogKpiGridProps {
  items: CatalogKpiItem[]
  ariaLabel: string
  isLoading?: boolean
}

export function CatalogKpiGrid({
  items,
  ariaLabel,
  isLoading = false,
}: CatalogKpiGridProps) {
  if (isLoading) {
    return (
      <section
        className="catalog-kpi-grid"
        aria-label={`Memuat ${ariaLabel.toLowerCase()}`}
        aria-busy="true"
      >
        {[0, 1, 2, 3].map((idx) => (
          <div key={idx} className="catalog-kpi-card catalog-kpi-skeleton">
            <div className="catalog-kpi-skeleton-line is-short" />
            <div className="catalog-kpi-skeleton-line is-tall" />
            <div className="catalog-kpi-skeleton-line" />
          </div>
        ))}
      </section>
    )
  }

  return (
    <section className="catalog-kpi-grid" aria-label={ariaLabel}>
      {items.map((item) => {
        const content = (
          <>
            <div className="catalog-kpi-top">
              <span className="catalog-kpi-label">{item.label}</span>
            </div>

            <div className="catalog-kpi-value-row">
              <span className="catalog-kpi-value font-mono-nb">
                {item.value}
              </span>
              {item.unit && (
                <span className="catalog-kpi-unit">{item.unit}</span>
              )}
            </div>

            <div className="catalog-kpi-footer">
              <span className="catalog-kpi-subtext">{item.subtext}</span>
              {item.isSelected && (
                <span className="catalog-kpi-active-tag">Terpilih</span>
              )}
            </div>
          </>
        )

        if (item.onClick) {
          return (
            <button
              key={item.id}
              type="button"
              className={`catalog-kpi-card is-interactive nb-btn ${
                item.isSelected ? 'is-selected' : ''
              }`}
              aria-pressed={Boolean(item.isSelected)}
              onClick={item.onClick}
            >
              {content}
            </button>
          )
        }

        return (
          <article
            key={item.id}
            className="catalog-kpi-card"
            aria-label={item.label}
          >
            {content}
          </article>
        )
      })}
    </section>
  )
}
