import { Pagination, StatusBadge } from '../../../shared/components/ui'
import type { CategoryListItem } from '../../categories/types/category'
import type { EbookListItem, EbookTableFilters } from '../types/catalog'
import { getCategoryMeta } from '../utils/catalog.utils'

interface EbookCardGridProps {
  ebooks: EbookListItem[]
  categories: CategoryListItem[]
  filters: EbookTableFilters
  totalPages: number
  totalCount: number
  onEdit: (ebook: EbookListItem) => void
  onToggleStatus: (ebook: EbookListItem) => void
  onPageChange: (page: number) => void
}

export function EbookCardGrid({
  ebooks,
  categories,
  filters,
  totalPages,
  totalCount,
  onEdit,
  onToggleStatus,
  onPageChange,
}: EbookCardGridProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="catalog-cards-grid">
        {ebooks.map((book) => {
          const cat = categories.find((c) => c.id === book.categoryId)
          const meta = getCategoryMeta(cat?.slug)
          const ratingNum =
            book.ratingAvg !== 'Belum ada rating' ? parseFloat(book.ratingAvg) : 0
          const fullBoxes = Math.round(ratingNum)

          return (
            <div key={book.id} className="catalog-card-item">
              <div className="catalog-card-cover-box">
                <div className="catalog-card-cover-pattern" />
                <div className="catalog-card-cover-badge">
                  <StatusBadge
                    status={book.isActive ? 'Aktif' : 'Arsip'}
                    fill={book.isActive ? 'var(--nb-green)' : 'var(--nb-muted)'}
                    icon={book.isActive ? 'check_circle' : 'archive'}
                  />
                </div>
                {book.pageCount && (
                  <div className="catalog-card-pages-badge">
                    {book.pageCount} Hal
                  </div>
                )}
                <span
                  className="material-symbols-outlined catalog-card-icon-art"
                  aria-hidden="true"
                >
                  {meta.icon || 'menu_book'}
                </span>
              </div>

              <div className="catalog-card-body">
                <div className="catalog-card-category-row">
                  <span
                    className="catalog-card-category-chip"
                    style={{ backgroundColor: meta.activeBg }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 13 }}
                      aria-hidden="true"
                    >
                      {meta.icon}
                    </span>
                    <span>{book.categoryName}</span>
                  </span>
                  <span className="catalog-card-sales-chip">
                    {book.salesCount} terjual
                  </span>
                </div>

                <h2 className="catalog-card-title" title={book.title}>
                  {book.title}
                </h2>

                <p className="catalog-card-author">{book.author}</p>

                <div className="catalog-card-rating-row">
                  <div
                    className="rating-boxes-row"
                    aria-label={`Rating ${book.ratingAvg}`}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`rating-box-unit ${
                          star <= fullBoxes ? '' : 'is-empty'
                        }`}
                      />
                    ))}
                  </div>
                  <span>{book.ratingAvg}</span>
                </div>

                <div className="catalog-card-price-row">
                  <span className="catalog-card-price">{book.price}</span>
                  <div className="catalog-card-actions">
                    <button
                      type="button"
                      className="nb-btn nb-table-action-btn"
                      onClick={() => onEdit(book)}
                      aria-label={`Ubah e-book ${book.title}`}
                      title="Ubah data e-book"
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 18 }}
                        aria-hidden="true"
                      >
                        edit
                      </span>
                    </button>
                    <button
                      type="button"
                      className={`nb-btn nb-table-action-btn ${
                        book.isActive ? 'is-danger' : ''
                      }`}
                      onClick={() => onToggleStatus(book)}
                      aria-label={
                        book.isActive
                          ? `Arsipkan e-book ${book.title}`
                          : `Aktifkan e-book ${book.title}`
                      }
                      title={
                        book.isActive
                          ? 'Arsipkan e-book'
                          : 'Aktifkan kembali e-book'
                      }
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 18 }}
                        aria-hidden="true"
                      >
                        {book.isActive ? 'archive' : 'unarchive'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Pagination
        currentPage={filters.page}
        totalPages={totalPages}
        totalItems={totalCount}
        pageSize={filters.limit}
        onPageChange={onPageChange}
        labelItemName="e-book"
      />
    </div>
  )
}
