interface RatingFilterGroupProps {
  minRating?: number;
  totalBooksCount: number;
  onSelectMinRating: (rating: number) => void;
}

export function RatingFilterGroup({
  minRating,
  totalBooksCount,
  onSelectMinRating,
}: RatingFilterGroupProps) {
  const options = [
    { rating: 4.0, stars: '★★★★☆', label: '≥ 4.0', count: 280 },
    { rating: 4.5, stars: '★★★★★', label: '≥ 4.5', count: 140 },
    { rating: 0, stars: '', label: 'Semua Nilai Ulasan', count: totalBooksCount },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        borderTop: '2px solid var(--nb-black)',
        paddingTop: '0.875rem',
      }}
    >
      <span
        className="nb-label"
        style={{
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.04em',
          color: 'var(--nb-black)',
        }}
      >
        Rating Pembaca
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {options.map((rItem) => {
          const isChecked =
            rItem.rating === 0
              ? !minRating || minRating === 0
              : minRating === rItem.rating;

          return (
            <label
              key={rItem.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                fontSize: '0.8125rem',
                padding: '5px 8px',
                backgroundColor: isChecked
                  ? 'rgba(255, 210, 63, 0.35)'
                  : 'transparent',
                border: isChecked
                  ? '1px solid var(--nb-black)'
                  : '1px solid transparent',
                fontWeight: isChecked ? 700 : 400,
                userSelect: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="radio"
                  name="rating-filter"
                  checked={isChecked}
                  onChange={() => onSelectMinRating(rItem.rating)}
                  style={{
                    accentColor: 'var(--nb-black)',
                    cursor: 'pointer',
                    width: '15px',
                    height: '15px',
                  }}
                />
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  {rItem.stars && (
                    <span
                      style={{
                        color: 'var(--nb-orange)',
                        fontWeight: 700,
                        marginRight: '5px',
                        fontSize: '0.875rem',
                      }}
                    >
                      {rItem.stars}
                    </span>
                  )}
                  {rItem.label}
                </span>
              </div>
              <span
                className="nb-mono"
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: isChecked ? 700 : 400,
                  color: isChecked ? 'var(--nb-black)' : 'var(--nb-text-muted)',
                }}
              >
                ({rItem.count})
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
