import { TOP_BESTSELLING_EBOOKS } from '../data/dashboardData'
import type { BestsellingBookItem } from '../types/dashboard'

interface DashboardTopEbooksProps {
  books?: BestsellingBookItem[]
  isLive?: boolean
  badgeLabel?: string
}

export function DashboardTopEbooks({
  books,
  isLive = false,
  badgeLabel = 'LIVE DB',
}: DashboardTopEbooksProps) {
  const displayBooks = isLive ? (books ?? []) : TOP_BESTSELLING_EBOOKS

  return (
    <div className="bestseller-card" role="region" aria-label="Top Bestselling E-Book">
      <div className="widget-header">
        <div className="widget-title-row">
          <h2 className="widget-heading">Top Bestselling E-Book</h2>
        </div>
        <span className="widget-tag">
          {isLive ? badgeLabel : 'DATA SIMULASI'}
        </span>
      </div>

      <div className="bestseller-list">
        {displayBooks.length === 0 ? (
          <div style={{ padding: '16px 8px', fontSize: 13, color: '#525252' }}>
            Belum ada penjualan e-book terverifikasi di database.
          </div>
        ) : (
          displayBooks.map((book) => (
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
          ))
        )}
      </div>
    </div>
  )
}
