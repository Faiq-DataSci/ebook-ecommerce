import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import type { Book } from '../../types/book.types';
import { ROUTES } from '../../constants/routes';
import { CategoryBadge, SimulationBadge } from '../ui/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { BookCover, BookCoverArtwork } from './BookCoverArtwork';
import { QualityScoreBreakdown } from './QualityScoreBreakdown';
import { BookCardHorizontal } from './BookCardHorizontal';

// Re-export subcomponent for backward-compatibility
export { BookCoverArtwork };

export interface BookCardProps {
  book: Book;
  viewMode?: 'grid' | 'list';
  onBuyClick?: (book: Book) => void;
  onAddToCart?: (book: Book) => void;
}

export function BookCard({
  book,
  viewMode = 'grid',
  onBuyClick,
  onAddToCart,
}: BookCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleBuyAction = () => {
    if (onBuyClick) {
      onBuyClick(book);
      return;
    }
    if (!isAuthenticated) {
      navigate(
        `${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.BOOK_DETAIL(book.id))}`,
      );
    } else {
      navigate(ROUTES.BOOK_DETAIL(book.id));
    }
  };

  const handleCartAction = () => {
    if (onAddToCart) {
      onAddToCart(book);
    }
  };

  // List View Mode
  if (viewMode === 'list') {
    return (
      <BookCardHorizontal
        book={book}
        onBuyAction={handleBuyAction}
        onCartAction={handleCartAction}
      />
    );
  }

  // Grid View Mode (Default - Matching Stitch Design 100%)
  return (
    <article className="nb-catalog-card ebook-card">
      {/* 1. Top Badges Row: Rating + Simulation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '6px',
          marginBottom: '10px',
          minHeight: '26px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {book.rating && (
            <div
              className="nb-mono"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: 'var(--nb-white)',
                border: '1px solid var(--nb-black)',
                padding: '2px 6px',
                color: 'var(--nb-black)',
              }}
            >
              <span style={{ color: 'var(--nb-orange)' }}>★</span>
              <span>{book.rating.toFixed(2)}</span>
            </div>
          )}
          {book.isSimulation && <SimulationBadge />}
        </div>
      </div>

      {/* 2. Cover Visual 2:3 */}
      <div className="nb-card-cover-wrapper" style={{ marginBottom: '10px' }}>
        <Link
          to={ROUTES.BOOK_DETAIL(book.id)}
          tabIndex={-1}
          style={{ display: 'block', textDecoration: 'none' }}
        >
          <BookCover book={book} size="md" />
        </Link>
      </div>

      {/* 3. Meta & Judul */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Category Chip Ramping & Proporsional di Atas Judul Buku */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '6px',
            marginBottom: '6px',
          }}
        >
          <CategoryBadge
            categoryId={book.categoryId}
            categoryName={book.categoryName}
            size="sm"
          />

          <span
            className="nb-mono"
            style={{
              fontSize: '0.625rem',
              fontWeight: 700,
              color: 'var(--nb-text-muted)',
            }}
          >
            {book.publishedYear ? `EDISI ${book.publishedYear}` : 'DIGITAL'}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: 'var(--nb-font-heading)',
            fontSize: '1.0625rem',
            lineHeight: 1.25,
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--nb-black)',
            marginTop: '2px',
            marginBottom: '4px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.7rem',
          }}
        >
          <Link
            to={ROUTES.BOOK_DETAIL(book.id)}
            style={{ color: 'inherit', textDecoration: 'none' }}
            className="hover:underline"
          >
            {book.title}
          </Link>
        </h3>

        {/* Author */}
        <p
          className="nb-body-sm"
          style={{
            color: 'var(--nb-text-muted)',
            fontSize: '0.8125rem',
            marginBottom: '6px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Oleh {book.author}
        </p>

        {/* 4. Quality Score Breakdown Mini-Bar */}
        <QualityScoreBreakdown book={book} />
      </div>

      {/* 5. Price & Actions */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '6px',
        }}
      >
        {/* Price row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px',
            marginBottom: '10px',
            minHeight: '28px',
          }}
        >
          {book.originalPrice && book.originalPrice > book.price && (
            <span
              className="nb-mono"
              style={{
                fontSize: '0.8125rem',
                textDecoration: 'line-through',
                color: 'var(--nb-text-muted)',
              }}
            >
              {formatCurrency(book.originalPrice)}
            </span>
          )}
          <span
            className="nb-mono"
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--nb-yellow)',
              border: '2px solid var(--nb-black)',
              boxShadow: '2px 2px 0 0 var(--nb-black)',
              padding: '2px 8px',
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--nb-black)',
            }}
          >
            {formatCurrency(book.price)}
          </span>
        </div>

        {/* 2 Buttons: + Troli & Beli Cepat */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
          }}
        >
          <button
            type="button"
            onClick={handleCartAction}
            className="nb-pressable"
            style={{
              height: '40px',
              backgroundColor: 'var(--nb-white)',
              color: 'var(--nb-black)',
              border: '2px solid var(--nb-black)',
              boxShadow: '3px 3px 0 0 var(--nb-black)',
              fontFamily: 'var(--nb-font-heading)',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            <ShoppingCart size={15} strokeWidth={2.5} />
            + Troli
          </button>

          <button
            type="button"
            onClick={handleBuyAction}
            className="nb-pressable"
            style={{
              height: '40px',
              backgroundColor: 'var(--nb-yellow)',
              color: 'var(--nb-black)',
              border: '2px solid var(--nb-black)',
              boxShadow: '3px 3px 0 0 var(--nb-black)',
              fontFamily: 'var(--nb-font-heading)',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            Beli Cepat
          </button>
        </div>
      </div>
    </article>
  );
}
