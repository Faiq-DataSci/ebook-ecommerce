import { TOP_BESTSELLING_EBOOKS } from '../data/dashboardData'

export function DashboardTopEbooks() {
  return (
    <div className="bestseller-card" role="region" aria-label="Top Bestselling E-Book">
      <div className="widget-header">
        <div className="widget-title-row">
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
  )
}
