import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { BookCoverArtwork } from '../../../components/shared/BookCard';
import { PriceDisplay } from '../../../components/shared/PriceDisplay';
import { SimulationBadge } from '../../../components/ui/Badge';
import type { Book } from '../../../types/book.types';

interface HeroSectionProps {
  featuredPreviewBooks: Book[];
}

export function HeroSection({ featuredPreviewBooks }: HeroSectionProps) {
  const primaryHeroBook = featuredPreviewBooks[0];
  const secondaryHeroBook = featuredPreviewBooks[1];

  return (
    <section
      className="nb-section nb-halftone-zone-a"
      style={{
        backgroundColor: 'var(--nb-paper)',
        borderBottom: 'var(--nb-border-thick)',
      }}
    >
      <div
        className="nb-container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--nb-space-8)',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--nb-white)',
            border: 'var(--nb-border-thick)',
            boxShadow: 'var(--nb-shadow-xl)',
            padding: 'var(--nb-space-8)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--nb-space-5)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <SimulationBadge />
          </div>

          <h1 className="nb-display">
            Temukan Bacaan Digital Berikutnya.
          </h1>

          <p className="nb-body-lg">
            Telusuri buku elektronik pilihan yang memperluas wawasan teknis,
            metodologi riset, dan perspektif baru langsung di layar Anda.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--nb-space-4)',
              paddingTop: 'var(--nb-space-2)',
            }}
          >
            <Link
              to={ROUTES.CATALOG}
              className="nb-pressable"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '52px',
                paddingInline: 'var(--nb-space-6)',
                backgroundColor: 'var(--nb-yellow)',
                fontFamily: 'var(--nb-font-heading)',
                fontWeight: 700,
                fontSize: '1rem',
              }}
            >
              Jelajahi Katalog E-Book
            </Link>

            <a
              href="#kategori-buku"
              className="nb-pressable"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '52px',
                paddingInline: 'var(--nb-space-6)',
                backgroundColor: 'var(--nb-white)',
                fontFamily: 'var(--nb-font-heading)',
                fontWeight: 700,
                fontSize: '1rem',
              }}
            >
              Telusuri Kategori Buku
            </a>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--nb-space-5)',
            alignItems: 'start',
          }}
        >
          {primaryHeroBook && (
            <div
              style={{
                backgroundColor: 'var(--nb-yellow)',
                border: 'var(--nb-border-thick)',
                boxShadow: 'var(--nb-shadow-lg)',
                padding: 'var(--nb-space-4)',
                transform: 'rotate(-1.2deg)',
              }}
            >
              <BookCoverArtwork
                title={primaryHeroBook.title}
                author={primaryHeroBook.author}
                categoryName={primaryHeroBook.categoryName}
                coverCode={primaryHeroBook.coverCode}
                accent={primaryHeroBook.coverAccent}
              />
              <div
                style={{
                  marginTop: 'var(--nb-space-3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <PriceDisplay amount={primaryHeroBook.price} size="sm" />
                <Link
                  to={ROUTES.BOOK_DETAIL(primaryHeroBook.id)}
                  className="nb-label"
                  style={{ textDecoration: 'underline' }}
                >
                  Detail Buku
                </Link>
              </div>
            </div>
          )}

          {secondaryHeroBook && (
            <div
              style={{
                backgroundColor: 'var(--nb-blue)',
                border: 'var(--nb-border-thick)',
                boxShadow: 'var(--nb-shadow-lg)',
                padding: 'var(--nb-space-4)',
                transform: 'rotate(1.2deg)',
              }}
            >
              <BookCoverArtwork
                title={secondaryHeroBook.title}
                author={secondaryHeroBook.author}
                categoryName={secondaryHeroBook.categoryName}
                coverCode={secondaryHeroBook.coverCode}
                accent={secondaryHeroBook.coverAccent}
              />
              <div
                style={{
                  marginTop: 'var(--nb-space-3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <PriceDisplay amount={secondaryHeroBook.price} size="sm" />
                <Link
                  to={ROUTES.BOOK_DETAIL(secondaryHeroBook.id)}
                  className="nb-label"
                  style={{ textDecoration: 'underline' }}
                >
                  Detail Buku
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
