import { Link } from 'react-router-dom';
import type { Book } from '../../../types/book.types';
import { ROUTES } from '../../../constants/routes';
import { BookCard } from '../../../components/shared/BookCard';
import { SimulationBadge } from '../../../components/ui/Badge';

interface FeaturedBooksProps {
  books: Book[];
}

export function FeaturedBooks({ books }: FeaturedBooksProps) {
  return (
    <section
      className="nb-section"
      style={{ backgroundColor: 'var(--nb-white)' }}
    >
      <div className="nb-container">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 'var(--nb-space-4)',
            marginBottom: 'var(--nb-space-8)',
          }}
        >
          <div>
            <div style={{ marginBottom: '8px' }}>
              <SimulationBadge />
            </div>
            <h2 className="nb-h1">Pilihan E-Book Unggulan</h2>
            <p className="nb-body" style={{ color: 'var(--nb-text-muted)' }}>
              Kumpulan e-book representatif tanpa diskon atau rating fabrikasi.
            </p>
          </div>

          <Link
            to={ROUTES.CATALOG}
            className="nb-pressable"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '44px',
              paddingInline: 'var(--nb-space-5)',
              backgroundColor: 'var(--nb-yellow)',
              fontFamily: 'var(--nb-font-heading)',
              fontWeight: 700,
            }}
          >
            Lihat Seluruh Katalog
          </Link>
        </div>

        <div className="nb-grid-cards nb-grid-cards-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
}
