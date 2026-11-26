import { useState } from 'react';
import type { Book } from '../../types/book.types';

export interface BookCoverArtworkProps {
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
