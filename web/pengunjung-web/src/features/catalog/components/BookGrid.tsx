import type { Book } from '../../../types/book.types';
import { BookCard } from '../../../components/shared/BookCard';
import { EmptyState } from '../../../components/shared/EmptyState';

interface BookGridProps {
  books: Book[];
  onResetFilters: () => void;
}

export function BookGrid({ books, onResetFilters }: BookGridProps) {
  if (books.length === 0) {
    return (
      <EmptyState
        title="Tidak Ada E-Book yang Cocok dengan Filter"
        description="Coba ubah kata kunci pencarian judul, pilih kategori lain, atau bersihkan filter harga untuk menampilkan seluruh koleksi."
        actionLabel="Bersihkan Semua Filter"
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="nb-grid-cards">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
