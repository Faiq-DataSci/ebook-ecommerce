import type { KpiStatItem } from '../types/dashboard'

interface DashboardKpiCardsProps {
  cards: KpiStatItem[]
}

export function DashboardKpiCards({ cards }: DashboardKpiCardsProps) {
  return (
    <section className="kpi-grid" aria-label="Ringkasan Statistik Utama">
      {cards.map((card) => (
        <div
          key={card.id}
          className="kpi-card nb-btn"
          role="region"
          aria-label={card.title}
        >
          <div
            className="kpi-card-header"
            style={{ backgroundColor: card.headerBg }}
          >
            <span className="kpi-card-title">{card.title}</span>
          </div>

          <div className="kpi-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span className="kpi-value">{card.value}</span>
              <div className="kpi-delta-row">
                <span
                  className="kpi-delta-badge"
                  style={{
                    backgroundColor: card.deltaBadgeBg,
                    color: card.deltaBadgeColor,
                  }}
                >
                  {card.deltaBadgeText}
                </span>
                <span className="kpi-delta-label">{card.deltaLabel}</span>
              </div>
            </div>

            <div className="kpi-progress-section">
              <div className="kpi-progress-labels">
                <span>{card.footerLeftText}</span>
                <span className="kpi-progress-strong">
                  {card.footerRightText}
                </span>
              </div>
              <div className="kpi-progress-track">
                {card.segments.map((seg, idx) => (
                  <div
                    key={idx}
                    className="kpi-progress-fill"
                    style={{
                      width: `${seg.widthPercent}%`,
                      backgroundColor: seg.bgColor,
                      borderRight:
                        idx === card.segments.length - 1 &&
                        seg.widthPercent === 100
                          ? 'none'
                          : '1px solid #000000',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
