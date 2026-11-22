import { Star } from 'lucide-react';

export interface RatingStarsProps {
  /** Nilai rating (1.0 – 5.0). Jika undefined atau <= 0, tampil "Belum ada rating" sesuai design.md 5.9 */
  rating?: number;
  /** Jumlah ulasan opsional untuk ditampilkan di samping angka rating */
  reviewCount?: number;
  /** Ukuran kotak bintang persegi */
  size?: 'sm' | 'md' | 'lg';
  /** Sembunyikan angka teks di sebelah kanan bila hanya ingin kotak bintang */
  hideValue?: boolean;
  /** Mode interaktif untuk memilih rating (1 – 5) pada form ulasan */
  interactiveValue?: number;
  onSelectRating?: (star: number) => void;
}

/**
 * RatingStars (design.md bagian 5.9):
 * - Lima kotak persegi (border-radius: 0, border hitam tegas)
 * - Kotak terisi = nb-yellow (#FFD23F), kotak kosong = nb-white (#FFFFFF)
 * - Selalu disertai angka format koma Indonesia (mis. "4,9") dalam font Space Mono
 * - Jika e-book belum punya rating, tampil "Belum ada rating" (bukan nol bintang)
 */
export function RatingStars({
  rating,
  reviewCount,
  size = 'md',
  hideValue = false,
  interactiveValue,
  onSelectRating,
}: RatingStarsProps) {
  const isInteractive = typeof onSelectRating === 'function';
  const activeRating = isInteractive ? (interactiveValue ?? 5) : rating;

  if (!isInteractive && (activeRating === undefined || activeRating <= 0)) {
    return (
      <span
        className="nb-mono"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '2px 8px',
          backgroundColor: 'var(--nb-muted)',
          border: '2px solid var(--nb-black)',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--nb-text-muted)',
        }}
      >
        Belum ada rating
      </span>
    );
  }

  const numericRating = activeRating ?? 0;
  const filledCount = Math.round(numericRating);
  const formattedScore = numericRating.toFixed(1).replace('.', ',');

  const boxPx = size === 'sm' ? 22 : size === 'lg' ? 32 : 26;
  const iconPx = size === 'sm' ? 12 : size === 'lg' ? 17 : 14;
  const fontSize = size === 'sm' ? '0.75rem' : size === 'lg' ? '1rem' : '0.875rem';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: size === 'sm' ? '6px' : '8px',
      }}
      aria-label={
        isInteractive
          ? `Pilih rating bintang: saat ini ${numericRating} dari 5`
          : `Rating ${formattedScore} dari 5 bintang${
              reviewCount !== undefined ? ` berdasarkan ${reviewCount} ulasan` : ''
            }`
      }
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = starIndex <= filledCount;

          if (isInteractive) {
            return (
              <button
                key={starIndex}
                type="button"
                onClick={() => onSelectRating(starIndex)}
                className="nb-pressable"
                aria-label={`Beri ${starIndex} bintang`}
                aria-pressed={starIndex === filledCount}
                style={{
                  width: `${boxPx}px`,
                  height: `${boxPx}px`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isFilled ? 'var(--nb-yellow)' : 'var(--nb-white)',
                  color: 'var(--nb-black)',
                  border: '2px solid var(--nb-black)',
                  borderRadius: 0,
                  boxShadow: '2px 2px 0 0 var(--nb-black)',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <Star
                  size={iconPx}
                  strokeWidth={2.5}
                  fill={isFilled ? 'var(--nb-black)' : 'none'}
                  aria-hidden="true"
                />
              </button>
            );
          }

          return (
            <span
              key={starIndex}
              aria-hidden="true"
              style={{
                width: `${boxPx}px`,
                height: `${boxPx}px`,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isFilled ? 'var(--nb-yellow)' : 'var(--nb-white)',
                color: 'var(--nb-black)',
                border: '2px solid var(--nb-black)',
                borderRadius: 0,
                boxShadow: '2px 2px 0 0 var(--nb-black)',
              }}
            >
              <Star
                size={iconPx}
                strokeWidth={2.5}
                fill={isFilled ? 'var(--nb-black)' : 'none'}
              />
            </span>
          );
        })}
      </div>

      {!hideValue && (
        <span
          className="nb-mono"
          style={{
            fontSize,
            fontWeight: 700,
            color: 'var(--nb-black)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <strong>{formattedScore}</strong>
          {reviewCount !== undefined && (
            <span style={{ color: 'var(--nb-text-muted)', fontWeight: 600 }}>
              ({reviewCount} ulasan)
            </span>
          )}
        </span>
      )}
    </div>
  );
}
