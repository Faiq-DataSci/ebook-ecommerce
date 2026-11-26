import { Link } from 'react-router-dom';
import { BookOpen, ShoppingCart } from 'lucide-react';
import type { Book } from '../../types/book.types';
import { ROUTES } from '../../constants/routes';
import { CategoryBadge, SimulationBadge } from '../ui/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import { BookCover } from './BookCoverArtwork';
import { QualityScoreBreakdown } from './QualityScoreBreakdown';

interface BookCardHorizontalProps {
  book: Book;
  onBuyAction: () => void;
  onCartAction: () => void;
}

export function BookCardHorizontal({
  book,
  onBuyAction,
  onCartAction,
}: BookCardHorizontalProps) {
  return (
    <article className="nb-catalog-card-list ebook-card">
      {/* Cover Left */}
      <div className="nb-card-list-cover">
        <BookCover book={book} size="md" />
      </div>

      {/* Content Right */}
      <div className="nb-card-list-content">
        <div>
          {/* Badges Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '8px',
            }}
          >
            <CategoryBadge
              categoryId={book.categoryId}
              categoryName={book.categoryName}
              size="sm"
            />

            {book.rating && (
              <div
                className="nb-mono"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--nb-black)',
                  marginLeft: 'auto',
                }}
              >
                <span style={{ color: 'var(--nb-orange)', fontSize: '0.9rem' }}>★</span>
                <span>{book.rating.toFixed(2)}</span>
                {book.reviewCount && (
                  <span style={{ color: 'var(--nb-text-muted)', fontWeight: 400 }}>
                    ({book.reviewCount})
                  </span>
                )}
              </div>
            )}

            {book.isSimulation && <SimulationBadge />}
          </div>

          {/* Title */}
          <h3
            className="nb-h3"
            style={{
              fontSize: '1.1875rem',
              textTransform: 'uppercase',
              lineHeight: 1.25,
              marginBottom: '4px',
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
              marginBottom: '8px',
              fontSize: '0.8125rem',
            }}
          >
            Oleh {book.author} {book.publishedYear ? `• Terbit ${book.publishedYear}` : ''}
          </p>

          {/* Description */}
          {book.description && (
            <p
              className="nb-body-sm"
              style={{
                color: 'var(--nb-text-muted)',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                marginBottom: '10px',
                fontSize: '0.8125rem',
                lineHeight: 1.4,
              }}
            >
              {book.description}
            </p>
          )}

          {/* Quality Score Breakdown Mini-Bar */}
          <QualityScoreBreakdown book={book} />
        </div>

        {/* Price & Actions Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            borderTop: 'var(--nb-border-thin)',
            paddingTop: '10px',
            marginTop: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
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
                padding: '2px 10px',
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--nb-black)',
              }}
            >
              {formatCurrency(book.price)}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Link
              to={ROUTES.BOOK_DETAIL(book.id)}
              className="nb-pressable"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                minHeight: '38px',
                paddingInline: '12px',
                backgroundColor: 'var(--nb-white)',
                color: 'var(--nb-black)',
                border: '2px solid var(--nb-black)',
                boxShadow: '3px 3px 0 0 var(--nb-black)',
                fontFamily: 'var(--nb-font-heading)',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              <BookOpen size={15} strokeWidth={2.25} />
              Detail
            </Link>

            <button
              type="button"
              onClick={onCartAction}
              className="nb-pressable"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                minHeight: '38px',
                paddingInline: '14px',
                backgroundColor: 'var(--nb-white)',
                color: 'var(--nb-black)',
                border: '2px solid var(--nb-black)',
                boxShadow: '3px 3px 0 0 var(--nb-black)',
                fontFamily: 'var(--nb-font-heading)',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              <ShoppingCart size={15} strokeWidth={2.25} />
              + Troli
            </button>

            <button
              type="button"
              onClick={onBuyAction}
              className="nb-pressable"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                minHeight: '38px',
                paddingInline: '16px',
                backgroundColor: 'var(--nb-yellow)',
                color: 'var(--nb-black)',
                border: '2px solid var(--nb-black)',
                boxShadow: '3px 3px 0 0 var(--nb-black)',
                fontFamily: 'var(--nb-font-heading)',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Beli Cepat
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
