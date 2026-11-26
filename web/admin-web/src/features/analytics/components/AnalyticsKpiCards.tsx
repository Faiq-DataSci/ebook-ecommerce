import type { AnalyticsKpi } from '../types/analytics'

interface AnalyticsKpiCardsProps {
  kpis: AnalyticsKpi[]
}

export function AnalyticsKpiCards({ kpis }: AnalyticsKpiCardsProps) {
  return (
    <div className="analytics-kpi-grid">
      {kpis.map((kpi) => (
        <div key={kpi.id} className="analytics-kpi-card" title={kpi.helpTooltip}>
          <div className="analytics-kpi-top">
            <span className="analytics-kpi-title">{kpi.title}</span>
          </div>

          <div className="analytics-kpi-val-row">
            <span className="analytics-kpi-value">{kpi.value}</span>
            {kpi.unit && <span className="analytics-kpi-unit">{kpi.unit}</span>}
          </div>

          <div className="analytics-kpi-footer">
            <span
              className={`analytics-kpi-pill ${
                kpi.id === 'kpi-saw-impact'
                  ? 'is-saw'
                  : kpi.isPositive
                    ? 'is-positive'
                    : 'is-negative'
              }`}
            >
              <span>+{kpi.growthPercentage}%</span>
            </span>
            <span style={{ color: 'var(--nb-text-muted)' }}>{kpi.comparisonText}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
