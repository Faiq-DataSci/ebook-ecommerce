interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 9,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Navigasi Halaman Katalog"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--nb-space-4)',
        padding: 'var(--nb-space-4)',
        backgroundColor: 'var(--nb-paper)',
        border: 'var(--nb-border)',
        boxShadow: 'var(--nb-shadow)',
        marginTop: 'var(--nb-space-6)',
      }}
      className="md:flex-row"
    >
      <div
        className="nb-mono"
        style={{
          fontSize: '0.8125rem',
          color: 'var(--nb-text-muted)',
          textAlign: 'center',
        }}
      >
        Menampilkan{' '}
        <strong style={{ color: 'var(--nb-black)' }}>
          {startItem} - {endItem}
        </strong>{' '}
        dari{' '}
        <strong style={{ color: 'var(--nb-black)' }}>
          {totalItems}
        </strong>{' '}
        E-Book Terfilter
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {/* Previous Button */}
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="nb-pressable"
          style={{
            minHeight: '40px',
            paddingInline: '14px',
            backgroundColor:
              currentPage <= 1 ? 'var(--nb-muted)' : 'var(--nb-white)',
            color:
              currentPage <= 1
                ? 'var(--nb-disabled-text)'
                : 'var(--nb-black)',
            fontFamily: 'var(--nb-font-heading)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
          }}
        >
          Sebelumnya
        </button>

        {/* Page Number Buttons */}
        {pages.map((pageNumber) => {
          const isActive = pageNumber === currentPage;
          return (
            <button
              key={pageNumber}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onPageChange(pageNumber)}
              className="nb-pressable"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: isActive
                  ? 'var(--nb-yellow)'
                  : 'var(--nb-white)',
                color: 'var(--nb-black)',
                fontFamily: 'var(--nb-font-mono)',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="nb-pressable"
          style={{
            minHeight: '40px',
            paddingInline: '14px',
            backgroundColor:
              currentPage >= totalPages ? 'var(--nb-muted)' : 'var(--nb-white)',
            color:
              currentPage >= totalPages
                ? 'var(--nb-disabled-text)'
                : 'var(--nb-black)',
            fontFamily: 'var(--nb-font-heading)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
          }}
        >
          Berikutnya
        </button>
      </div>
    </nav>
  );
}
