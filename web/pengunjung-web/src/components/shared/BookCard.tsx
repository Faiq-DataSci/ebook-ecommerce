import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ShoppingCart } from 'lucide-react';
import type { Book } from '../../types/book.types';
import { ROUTES } from '../../constants/routes';
import { CategoryBadge, SimulationBadge } from '../ui/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAuth } from '../../features/auth/hooks/useAuth';

interface BookCoverArtworkProps {
  title: string;
  author: string;
  coverCode?: string;
  accent: Book['coverAccent'];
  size?: 'md' | 'lg';
  categoryId?: string;
  categoryName?: string;
}

const coverBgMap: Record<Book['coverAccent'], string> = {
  yellow: 'var(--nb-yellow)',
  blue: 'var(--nb-blue)',
  orange: 'var(--nb-orange)',
  green: 'var(--nb-green)',
  pink: 'var(--nb-pink)',
};

export function BookCoverArtwork({
  title,
  author,
  accent,
  size = 'md',
}: BookCoverArtworkProps) {
  return (
    <div
      role="img"
      aria-label={`Sampul ilustrasi untuk e-book ${title} karya ${author}`}
      style={{
        aspectRatio: '2 / 3',
        width: '100%',
        backgroundColor: coverBgMap[accent] ?? 'var(--nb-yellow)',
        border: 'var(--nb-border-thin)',
        boxShadow: 'var(--nb-shadow-sm)',
        padding: size === 'lg' ? 'var(--nb-space-5)' : 'var(--nb-space-3)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '6px',
          borderBottom: 'var(--nb-border-thin)',
          paddingBottom: '6px',
        }}
      >
        <span
          className="nb-mono"
          style={{
            backgroundColor: 'var(--nb-white)',
            border: 'var(--nb-border-thin)',
            padding: '1px 6px',
            fontSize: '0.6875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
          }}
        >
          FORMAT PDF
        </span>
        <span
          className="nb-mono"
          style={{
            backgroundColor: 'var(--nb-paper)',
            border: '1px solid var(--nb-black)',
            padding: '1px 6px',
            fontSize: '0.625rem',
            fontWeight: 700,
            textTransform: 'uppercase',
          }}
        >
          E-BOOK RESMI
        </span>
      </div>

      <div
        style={{
          backgroundColor: 'var(--nb-white)',
          border: 'var(--nb-border-thin)',
          boxShadow: 'var(--nb-shadow-sm)',
          padding: size === 'lg' ? 'var(--nb-space-4)' : 'var(--nb-space-2)',
          marginBlock: 'var(--nb-space-2)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--nb-font-heading)',
            fontWeight: 700,
            fontSize: size === 'lg' ? '1.2rem' : '0.9375rem',
            lineHeight: 1.2,
            textTransform: 'uppercase',
          }}
        >
          {title}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '6px',
          backgroundColor: 'var(--nb-paper)',
          border: 'var(--nb-border-thin)',
          padding: '4px 8px',
        }}
      >
        <span
          className="nb-body-sm"
          style={{
            fontWeight: 600,
            fontSize: '0.75rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {author}
        </span>
      </div>
    </div>
  );
}

export function BookCover({
  book,
  size = 'md',
}: {
  book: Book;
  size?: 'md' | 'lg';
}) {
  const [imgError, setImgError] = useState(false);

  const hasRealImage = Boolean(
    book.coverImage &&
      (book.coverImage.startsWith('http') || book.coverImage.startsWith('/')) &&
      !book.coverImage.includes('placeholders') &&
      !imgError,
  );

  const formats = book.formats && book.formats.length > 0 ? book.formats : ['PDF', 'EPUB'];

  if (hasRealImage) {
    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '2 / 3',
          border: '2px solid var(--nb-black)',
          boxShadow: '3px 3px 0 0 var(--nb-black)',
          overflow: 'hidden',
          backgroundColor: 'var(--nb-muted)',
        }}
      >
        <img
          src={book.coverImage}
          alt={`Sampul buku digital ${book.title}`}
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            display: 'flex',
            gap: '4px',
            zIndex: 2,
          }}
        >
          {formats.map((fmt) => (
            <span
              key={fmt}
              className="nb-mono"
              style={{
                padding: '1px 5px',
                backgroundColor: 'var(--nb-paper)',
                border: '1px solid var(--nb-black)',
                fontSize: '0.625rem',
                fontWeight: 700,
                color: 'var(--nb-black)',
              }}
            >
              {fmt}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <BookCoverArtwork
        title={book.title}
        author={book.author}
        categoryId={book.categoryId}
        categoryName={book.categoryName}
        coverCode={book.coverCode}
        accent={book.coverAccent}
        size={size}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          display: 'flex',
          gap: '4px',
          zIndex: 2,
        }}
      >
        {formats.map((fmt) => (
          <span
            key={fmt}
            className="nb-mono"
            style={{
              padding: '1px 5px',
              backgroundColor: 'var(--nb-paper)',
              border: '1px solid var(--nb-black)',
              fontSize: '0.625rem',
              fontWeight: 700,
              color: 'var(--nb-black)',
            }}
          >
            {fmt}
          </span>
        ))}
      </div>
    </div>
  );
}

// Interactive recommendation & quality score breakdown
function QualityScoreBreakdown({ book }: { book: Book }) {
  const scoreVal = book.sawScore?.value ?? 0.812;
  const percentage = Math.round(scoreVal * 100);
  const qualityLabel =
    percentage >= 93
      ? 'Pilihan Utama'
      : percentage >= 88
        ? 'Sangat Unggul'
        : percentage >= 84
          ? 'Direkomendasikan'
          : 'Populer';

  const breakdown = book.sawBreakdown ?? { c1: 25, c2: 35, c3: 20, c4: 20 };

  return (
    <div
      style={{
        marginBlock: '8px',
        padding: '7px 9px',
        backgroundColor: '#f5f4ec',
        border: '2px solid var(--nb-black)',
        boxShadow: '2px 2px 0 0 var(--nb-black)',
      }}
    >
      <div
        className="nb-mono"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.6875rem',
          marginBottom: '4px',
        }}
      >
        <span style={{ fontWeight: 700, color: 'var(--nb-black)' }}>
          Skor Kecocokan:
        </span>
        <span
          style={{
            fontWeight: 700,
            color: percentage >= 90 ? '#745c00' : 'var(--nb-black)',
          }}
        >
          {percentage}% • {qualityLabel}
        </span>
      </div>
      <div
        style={{
          height: '10px',
          width: '100%',
          backgroundColor: 'var(--nb-muted)',
          border: '1px solid var(--nb-black)',
          display: 'flex',
          overflow: 'hidden',
        }}
        title={`Indeks Kurasi: Harga (${breakdown.c1}%), Kepuasan (${breakdown.c2}%), Popularitas (${breakdown.c3}%), Kelengkapan (${breakdown.c4}%)`}
      >
        <div
          style={{
            width: `${breakdown.c1}%`,
            height: '100%',
            backgroundColor: 'var(--nb-yellow)',
            borderRight: '1px solid var(--nb-black)',
          }}
          title={`Harga Keterjangkauan (${breakdown.c1}%)`}
        />
        <div
          style={{
            width: `${breakdown.c2}%`,
            height: '100%',
            backgroundColor: 'var(--nb-green)',
            borderRight: '1px solid var(--nb-black)',
          }}
          title={`Kepuasan Pembaca (${breakdown.c2}%)`}
        />
        <div
          style={{
            width: `${breakdown.c3}%`,
            height: '100%',
            backgroundColor: 'var(--nb-blue)',
            borderRight: '1px solid var(--nb-black)',
          }}
          title={`Minat & Ulasan (${breakdown.c3}%)`}
        />
        <div
          style={{
            width: `${breakdown.c4}%`,
            height: '100%',
            backgroundColor: 'var(--nb-lavender)',
          }}
          title={`Kelengkapan Materi (${breakdown.c4}%)`}
        />
      </div>
    </div>
  );
}

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
                onClick={handleCartAction}
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
                onClick={handleBuyAction}
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
