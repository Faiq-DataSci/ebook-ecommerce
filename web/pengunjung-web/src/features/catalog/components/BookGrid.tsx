import type { Book, CatalogViewMode } from '../../../types/book.types';
import { BookCard } from '../../../components/shared/BookCard';
import { EmptyState } from '../../../components/shared/EmptyState';

interface BookGridProps {
  books: Book[];
  viewMode?: CatalogViewMode;
  onResetFilters: () => void;
  onBuyClick?: (book: Book) => void;
  onAddToCart?: (book: Book) => void;
}

export function BookGrid({
  books,
  viewMode = 'grid',
  onResetFilters,
  onBuyClick,
  onAddToCart,
}: BookGridProps) {
  if (books.length === 0) {
    return (
      <EmptyState
        title="Tidak Ada E-Book yang Cocok dengan Kriteria"
        description="Tidak ditemukan judul e-book atau nama penulis yang sesuai dengan kata kunci, kategori, atau rentang harga aktif saat ini. Anda dapat me-reset kriteria untuk melihat kembali seluruh koleksi."
        actionLabel="Bersihkan Semua Filter & Pencarian"
        onAction={onResetFilters}
      />
    );
  }

  if (viewMode === 'list') {
    return (
      <div
        id="catalog-grid"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--nb-space-4)',
        }}
      >
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            viewMode="list"
            onBuyClick={onBuyClick}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      id="catalog-grid"
      className="nb-catalog-grid"
    >
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          viewMode="grid"
          onBuyClick={onBuyClick}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
