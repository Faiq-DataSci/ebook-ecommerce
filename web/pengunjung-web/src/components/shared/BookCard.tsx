import { Link } from 'react-router-dom';
import type { Book } from '../../types/book.types';
import { ROUTES } from '../../constants/routes';
import { Badge, SimulationBadge } from '../ui/Badge';
import { PriceDisplay } from './PriceDisplay';

interface BookCoverArtworkProps {
  title: string;
  author: string;
  categoryName: string;
  coverCode: string;
  accent: Book['coverAccent'];
  size?: 'md' | 'lg';
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
  categoryName,
  coverCode,
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
        backgroundColor: coverBgMap[accent],
        border: 'var(--nb-border)',
        boxShadow: 'var(--nb-shadow)',
        padding: size === 'lg' ? 'var(--nb-space-6)' : 'var(--nb-space-4)',
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
          gap: '8px',
          borderBottom: 'var(--nb-border-thin)',
          paddingBottom: '8px',
        }}
      >
        <span
          className="nb-mono"
          style={{
            backgroundColor: 'var(--nb-white)',
            border: 'var(--nb-border-thin)',
            padding: '2px 8px',
            fontSize: '0.75rem',
          }}
        >
          {coverCode}
        </span>
        <span
          className="nb-label"
          style={{
            backgroundColor: 'var(--nb-paper)',
            border: 'var(--nb-border-thin)',
            padding: '2px 8px',
            fontSize: '0.75rem',
          }}
        >
          {categoryName}
        </span>
      </div>

      <div
        style={{
          backgroundColor: 'var(--nb-white)',
          border: 'var(--nb-border)',
          boxShadow: 'var(--nb-shadow-sm)',
          padding: size === 'lg' ? 'var(--nb-space-5)' : 'var(--nb-space-3)',
          marginBlock: 'var(--nb-space-3)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--nb-font-heading)',
            fontWeight: 700,
            fontSize: size === 'lg' ? '1.35rem' : '1rem',
            lineHeight: 1.2,
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
          gap: '8px',
          backgroundColor: 'var(--nb-paper)',
          border: 'var(--nb-border-thin)',
          padding: '6px 10px',
        }}
      >
        <span className="nb-body-sm" style={{ fontWeight: 600 }}>
          {author}
        </span>
        <span className="nb-mono" style={{ fontSize: '0.75rem' }}>
          EDISI PDF
        </span>
      </div>
    </div>
  );
}

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <article
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'var(--nb-white)',
        border: 'var(--nb-border)',
        boxShadow: 'var(--nb-shadow)',
        padding: 'var(--nb-space-5)',
        gap: 'var(--nb-space-4)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nb-space-3)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <Badge tone="blue">{book.categoryName}</Badge>
          {book.isSimulation && <SimulationBadge />}
        </div>

        <BookCoverArtwork
          title={book.title}
          author={book.author}
          categoryName={book.categoryName}
          coverCode={book.coverCode}
          accent={book.coverAccent}
        />

        <div>
          <h3 className="nb-h3" style={{ marginBottom: '4px' }}>
            {book.title}
          </h3>
          <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
            Oleh {book.author}
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--nb-space-3)',
          borderTop: 'var(--nb-border-thin)',
          paddingTop: 'var(--nb-space-3)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <span className="nb-label">Harga E-Book</span>
          <PriceDisplay amount={book.price} />
        </div>

        <Link
          to={ROUTES.BOOK_DETAIL(book.id)}
          className="nb-pressable"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '44px',
            paddingInline: 'var(--nb-space-4)',
            backgroundColor: 'var(--nb-yellow)',
            color: 'var(--nb-black)',
            fontFamily: 'var(--nb-font-heading)',
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          Lihat Detail E-Book
        </Link>
      </div>
    </article>
  );
}
