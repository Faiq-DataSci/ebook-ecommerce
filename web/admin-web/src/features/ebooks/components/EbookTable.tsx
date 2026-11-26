import { Pagination, StatusBadge } from '../../../shared/components/ui'
import type { CategoryListItem } from '../../categories/types/category'
import type { EbookListItem, EbookTableFilters } from '../types/catalog'
import { getCategoryMeta } from '../utils/catalog.utils'

interface EbookTableProps {
  ebooks: EbookListItem[]
  categories: CategoryListItem[]
  filters: EbookTableFilters
  totalPages: number
  totalCount: number
  onSort: (column: 'title' | 'price' | 'salesCount' | 'createdAt') => void
  onEdit: (ebook: EbookListItem) => void
  onToggleStatus: (ebook: EbookListItem) => void
  onPageChange: (page: number) => void
}

export function EbookTable({
  ebooks,
  categories,
  filters,
  totalPages,
  totalCount,
  onSort,
  onEdit,
  onToggleStatus,
  onPageChange,
}: EbookTableProps) {
  return (
    <div className="nb-table-container">
      <table className="nb-table">
        <caption className="visually-hidden">Daftar Koleksi E-Book Toko</caption>
        <thead>
          <tr>
            <th scope="col" style={{ width: 60, textAlign: 'center' }}>
              Sampul
            </th>
            <th
              scope="col"
              className="is-sortable"
              onClick={() => onSort('title')}
              aria-sort={
                filters.sortBy === 'title'
                  ? filters.sortOrder === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none'
              }
            >
              <div className="nb-th-inner">
                <span>Judul & Penulis</span>
              </div>
            </th>
            <th scope="col">Kategori</th>
            <th
              scope="col"
              className="is-sortable"
              style={{ textAlign: 'right' }}
              onClick={() => onSort('price')}
              aria-sort={
                filters.sortBy === 'price'
                  ? filters.sortOrder === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none'
              }
            >
              <div className="nb-th-inner" style={{ justifyContent: 'flex-end' }}>
                <span>Harga</span>
              </div>
            </th>
            <th scope="col" style={{ width: 110, textAlign: 'center' }}>
              Rating
            </th>
            <th
              scope="col"
              className="is-sortable"
              style={{ textAlign: 'right', width: 100 }}
              onClick={() => onSort('salesCount')}
              aria-sort={
                filters.sortBy === 'salesCount'
                  ? filters.sortOrder === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none'
              }
            >
              <div className="nb-th-inner" style={{ justifyContent: 'flex-end' }}>
                <span>Terjual</span>
              </div>
            </th>
            <th scope="col" style={{ width: 110 }}>
              Status
            </th>
            <th scope="col" style={{ width: 90 }}>
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {ebooks.map((book) => {
            const initials = book.title
              .replace('DATA SIMULASI — ', '')
              .slice(0, 2)
              .toUpperCase()

            return (
              <tr key={book.id}>
                <td data-label="Sampul" className="nb-td-cover">
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt={`Sampul ${book.title}`}
                      className="nb-cover-thumb"
                    />
                  ) : (
                    <div
                      className="nb-cover-placeholder"
                      title="Sampul belum diunggah"
                    >
                      {initials}
                    </div>
                  )}
                </td>
                <td data-label="Judul & Penulis" className="nb-td-title">
                  <div className="nb-ebook-title-text">{book.title}</div>
                  <div
                    style={{
                      fontSize: 13,
                      color: 'var(--nb-text-muted)',
                      marginTop: 2,
                    }}
                  >
                    {book.author}
                  </div>
                </td>
                <td data-label="Kategori">
                  {(() => {
                    const cat = categories.find((c) => c.id === book.categoryId)
                    const meta = getCategoryMeta(cat?.slug)
                    return (
                      <span
                        className="nb-category-chip"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          backgroundColor: meta.activeBg,
                        }}
                      >
                        <span>{book.categoryName}</span>
                      </span>
                    )
                  })()}
                </td>
                <td
                  data-label="Harga"
                  className="nb-td-mono nb-td-right"
                  style={{ fontWeight: 700 }}
                >
                  {book.price}
                </td>
                <td
                  data-label="Rating"
                  style={{ textAlign: 'center' }}
                  className="nb-td-mono"
                >
                  {book.ratingAvg === 'Belum ada rating' ? (
                    <span className="nb-td-muted-italic">Belum ada rating</span>
                  ) : (
                    <span style={{ fontWeight: 700 }}>{book.ratingAvg}</span>
                  )}
                </td>
                <td
                  data-label="Terjual"
                  className="nb-td-mono nb-td-right"
                  style={{ fontWeight: 700 }}
                >
                  {book.salesCount}
                </td>
                <td data-label="Status">
                  {book.isActive ? (
                    <StatusBadge status="Aktif" fill="var(--nb-green)" />
                  ) : (
                    <StatusBadge status="Arsip" fill="var(--nb-muted)" />
                  )}
                </td>
                <td data-label="Aksi">
                  <div className="nb-action-btn-group">
                    <button
                      type="button"
                      className="nb-btn nb-table-action-btn"
                      onClick={() => onEdit(book)}
                      aria-label={`Edit e-book ${book.title}`}
                      title="Edit data e-book"
                    >
                      Edit
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
                      {book.isActive ? 'Arsipkan' : 'Aktifkan'}
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

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
