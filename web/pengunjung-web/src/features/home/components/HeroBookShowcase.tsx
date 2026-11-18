import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Book } from '../../../types/book.types';
import { ROUTES } from '../../../constants/routes';
import { formatCurrency } from '../../../utils/formatCurrency';

interface HeroBookShowcaseProps {
  books: Book[];
}

const ACCENT_COLORS: Record<string, string> = {
  yellow: 'var(--nb-yellow)',
  blue: 'var(--nb-blue)',
  orange: 'var(--nb-orange)',
  green: 'var(--nb-green)',
  pink: 'var(--nb-pink)',
};

export function HeroBookShowcase({ books }: HeroBookShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayBooks = books.slice(0, 4);
  const activeBook = displayBooks[activeIndex] ?? displayBooks[0];

  if (!activeBook) return null;

  const accentBg = ACCENT_COLORS[activeBook.coverAccent] ?? ACCENT_COLORS.yellow;
  const totalPages = activeBook.pageCount ?? 320;

  const handleNextBook = () => {
    setActiveIndex((prev) => (prev + 1) % displayBooks.length);
  };

  const handlePrevBook = () => {
    setActiveIndex((prev) => (prev - 1 + displayBooks.length) % displayBooks.length);
  };

  return (
    <div className="nb-showcase-card" aria-label={`Sorotan E-Book: ${activeBook.title}`}>
      <div className="nb-showcase-header">
        <span className="nb-mono nb-showcase-header-title">
          SOROTAN E-BOOK ({activeIndex + 1}/{displayBooks.length})
        </span>

        {displayBooks.length > 1 && (
          <div className="nb-showcase-nav-group">
            <button
              type="button"
              onClick={handlePrevBook}
              className="nb-showcase-icon-btn"
              aria-label="Lihat buku pilihan sebelumnya"
            >
              <ChevronLeft size={16} strokeWidth={2.5} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleNextBook}
              className="nb-showcase-icon-btn"
              aria-label="Lihat buku pilihan berikutnya"
            >
              <ChevronRight size={16} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <div className="nb-showcase-simple-body" key={activeBook.id}>
        <div
          className="nb-showcase-cover-banner"
          style={{ backgroundColor: accentBg }}
        >
          <div className="cover-tag-row">
            <span className="nb-mono cover-code">{activeBook.categoryName}</span>
            <span className="nb-mono cover-fmt">PDF • {totalPages} HLM</span>
          </div>
          <h2 className="nb-h3" style={{ margin: 0 }}>
            {activeBook.title}
          </h2>
          <p className="nb-body-sm" style={{ margin: 0, fontWeight: 600 }}>
            Penulis: {activeBook.author}
          </p>
        </div>

        <p
          className="nb-body-sm"
          style={{
            color: 'var(--nb-text-muted)',
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {activeBook.description}
        </p>

        <div className="nb-showcase-simple-footer">
          <div>
            <span className="nb-mono meta-label" style={{ display: 'block' }}>
              HARGA RESMI
            </span>
            <span className="meta-price">{formatCurrency(activeBook.price)}</span>
          </div>

          <Link
            to={ROUTES.BOOK_DETAIL(activeBook.id)}
            className="nb-pressable nb-showcase-cta-inline"
          >
            <span>Lihat Detail Buku</span>
            <ArrowRight size={16} strokeWidth={2.5} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

