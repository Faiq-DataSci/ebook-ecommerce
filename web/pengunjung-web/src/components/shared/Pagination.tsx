import { Button } from '../ui/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Navigasi halaman katalog"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--nb-space-4)',
        padding: 'var(--nb-space-4)',
        backgroundColor: 'var(--nb-white)',
        border: 'var(--nb-border)',
        boxShadow: 'var(--nb-shadow-sm)',
        marginTop: 'var(--nb-space-8)',
      }}
    >
      <p className="nb-mono" style={{ fontSize: '0.875rem' }}>
        Halaman {currentPage} dari {totalPages} ({totalItems} e-book contoh)
      </p>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 'var(--nb-space-2)',
        }}
      >
        <Button
          variant="secondary"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Sebelumnya
        </Button>

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
                minWidth: '44px',
                minHeight: '44px',
                paddingInline: '12px',
                backgroundColor: isActive
                  ? 'var(--nb-yellow)'
                  : 'var(--nb-white)',
                fontFamily: 'var(--nb-font-mono)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {pageNumber}
            </button>
          );
        })}

        <Button
          variant="secondary"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Berikutnya
        </Button>
      </div>
    </nav>
  );
}
