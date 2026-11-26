import type { Book } from '../../types/book.types';

export function QualityScoreBreakdown({ book }: { book: Book }) {
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
