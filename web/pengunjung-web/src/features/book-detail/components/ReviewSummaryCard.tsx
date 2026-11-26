import type { Book } from '../../../types/book.types';
import { RatingStars } from '../../../components/shared/RatingStars';
import { Card } from '../../../components/ui/Card';

interface StarDistRow {
  star: number;
  percent: number;
  count: number;
}

interface ReviewSummaryCardProps {
  book: Book;
  effectiveRating: number;
  effectiveReviewCount: number;
  starDistribution: StarDistRow[];
}

export function ReviewSummaryCard({
  book,
  effectiveRating,
  effectiveReviewCount,
  starDistribution,
}: ReviewSummaryCardProps) {
  return (
    <Card tone="white" zone="B" padding="lg">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'var(--nb-space-6)',
          alignItems: 'center',
        }}
      >
        {/* Kiri: Skor Utama & RatingStars Persegi */}
        <div
          style={{
            backgroundColor: 'var(--nb-paper)',
            border: 'var(--nb-border)',
            boxShadow: 'var(--nb-shadow-sm)',
            padding: 'var(--nb-space-5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
            <span
              className="nb-mono"
              style={{
                fontSize: 'clamp(2.25rem, 3.5vw, 3rem)',
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {effectiveRating.toFixed(2).replace('.', ',')}
            </span>
            <span className="nb-mono" style={{ fontSize: '1rem', color: 'var(--nb-text-muted)', fontWeight: 700 }}>
              / 5,00
            </span>
          </div>

          <RatingStars
            rating={effectiveRating}
            reviewCount={effectiveReviewCount}
            size="md"
            hideValue
          />

          <p className="nb-body-sm" style={{ fontWeight: 600 }}>
            Berdasarkan{' '}
            <span className="nb-mono" style={{ fontWeight: 700 }}>
              {effectiveReviewCount}
            </span>{' '}
            ulasan pembaca terdata
          </p>

          {book.sawScore && (
            <div
              style={{
                backgroundColor: 'var(--nb-lavender)',
                border: '2px solid var(--nb-black)',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              <span className="nb-label" style={{ fontSize: '0.75rem' }}>
                Skor Akhir SAW ({book.sawScore.code}):
              </span>
              <span className="nb-mono" style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                {book.sawScore.value.toFixed(3).replace('.', ',')}
              </span>
            </div>
          )}
        </div>

        {/* Kanan: Batang Distribusi 5 Bintang s/d 1 Bintang */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
            <span className="nb-label">Distribusi Tingkat Kepuasan Pembaca</span>
            <span className="nb-mono" style={{ fontSize: '0.75rem', color: 'var(--nb-text-muted)' }}>
              100% Transparan
            </span>
          </div>

          {starDistribution.map((row) => (
            <div
              key={row.star}
              style={{
                display: 'grid',
                gridTemplateColumns: '54px 1fr 78px',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span className="nb-mono" style={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                {row.star} ★
              </span>

              <div
                aria-hidden="true"
                style={{
                  height: '16px',
                  backgroundColor: 'var(--nb-paper)',
                  border: '2px solid var(--nb-black)',
                  borderRadius: 0,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: `${row.percent}%`,
                    height: '100%',
                    backgroundColor:
                      row.star === 5
                        ? 'var(--nb-yellow)'
                        : row.star === 4
                          ? 'var(--nb-green)'
                          : 'var(--nb-blue)',
                    borderRight: row.percent > 0 && row.percent < 100 ? '2px solid var(--nb-black)' : 'none',
                  }}
                />
              </div>

              <span
                className="nb-mono"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textAlign: 'right',
                  color: 'var(--nb-text-muted)',
                }}
              >
                {row.percent}% ({row.count})
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
