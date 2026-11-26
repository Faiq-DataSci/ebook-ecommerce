interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  labelItemName?: string
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  labelItemName = 'data',
}: PaginationProps) {
  if (totalItems === 0) return null

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  const pages: number[] = []
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i)
  }

  return (
    <div className="nb-pagination-bar" aria-label="Navigasi Paginasi Halaman">
      <div className="nb-pagination-info">
        Menampilkan <strong>{startItem}–{endItem}</strong> dari{' '}
        <strong>{totalItems}</strong> {labelItemName}
      </div>

      <nav className="nb-pagination-controls" aria-label="Pilihan Halaman">
        <button
          type="button"
          className="nb-btn nb-page-btn"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Halaman sebelumnya"
        >
          Sebelumnya
        </button>

        {pages.map((p) => {
          const isActive = p === currentPage
          return (
            <button
              key={p}
              type="button"
              className={`nb-btn nb-page-btn ${isActive ? 'is-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        })}

        <button
          type="button"
          className="nb-btn nb-page-btn"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Halaman berikutnya"
        >
          Berikutnya
        </button>
      </nav>
    </div>
  )
}
