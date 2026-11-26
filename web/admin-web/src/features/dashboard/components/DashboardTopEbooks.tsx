import { QUICK_ACTIONS, TOP_BESTSELLING_EBOOKS } from '../data/dashboardData'

interface DashboardTopEbooksProps {
  onNavigate: (path: string) => void
}

export function DashboardTopEbooks({ onNavigate }: DashboardTopEbooksProps) {
  return (
    <>
      {/* Top Bestselling E-Book */}
      <div className="bestseller-card">
        <div className="widget-header">
          <div className="widget-title-row">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 20 }}
              aria-hidden="true"
            >
              trophy
            </span>
            <h2 className="widget-heading">Top Bestselling E-Book</h2>
          </div>
          <span className="widget-tag">MEI 2025</span>
        </div>

        <div className="bestseller-list">
          {TOP_BESTSELLING_EBOOKS.map((book) => (
            <div key={book.rank} className="bestseller-item">
              <div className="bestseller-top-row">
                <span
                  className="bestseller-rank"
                  style={{ backgroundColor: book.rankBg }}
                >
                  {book.rank}
                </span>
                <span className="bestseller-sold">{book.soldText}</span>
              </div>
              <h3 className="bestseller-title">{book.title}</h3>
              <div className="bestseller-bar-track">
                <div
                  className="bestseller-bar-fill"
                  style={{
                    width: `${book.progressPercent}%`,
                    backgroundColor: book.barBg,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pintasan Cepat (Aksi Admin) */}
      <div className="quick-actions-card">
        <div className="widget-header">
          <h2 className="widget-heading widget-title-row">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 18 }}
              aria-hidden="true"
            >
              bolt
            </span>
            <span>Pintasan Cepat</span>
          </h2>
          <span className="widget-tag">AKSI ADMIN</span>
        </div>

        <div className="quick-actions-grid">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              className="quick-action-btn nb-btn"
              style={{ backgroundColor: action.bgColor }}
              onClick={() => onNavigate(action.targetPath)}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 20 }}
                aria-hidden="true"
              >
                {action.icon}
              </span>
              <span className="quick-action-label">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
