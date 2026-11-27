import { Sparkles } from 'lucide-react';

export function CatalogQualityGuaranteeCard() {
  return (
    <div
      style={{
        backgroundColor: '#f5f4ec',
        border: '2px solid var(--nb-black)',
        boxShadow: '4px 4px 0 0 var(--nb-black)',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'var(--nb-font-heading)',
          fontWeight: 700,
          fontSize: '0.8125rem',
          textTransform: 'uppercase',
          color: 'var(--nb-black)',
        }}
      >
        <Sparkles size={16} strokeWidth={2.5} color="var(--nb-black)" />
        JAMINAN KURASI OBJEKTIF
      </div>
      <p
        className="nb-body-sm"
        style={{
          fontSize: '0.8125rem',
          lineHeight: 1.45,
          color: 'var(--nb-black)',
          margin: 0,
        }}
      >
        Setiap e-book dinilai secara objektif berdasarkan kepuasan pembaca asli,
        keterjangkauan harga, dan kedalaman materi bebas dari ulasan palsu atau
        promosi berbayar.
      </p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          paddingTop: '2px',
        }}
      >
        <span
          className="nb-mono"
          style={{
            fontSize: '0.625rem',
            fontWeight: 700,
            backgroundColor: 'var(--nb-yellow)',
            border: '1px solid var(--nb-black)',
            boxShadow: '1px 1px 0 0 var(--nb-black)',
            padding: '2px 6px',
          }}
        >
          100% PRODUK ASLI
        </span>
        <span
          className="nb-mono"
          style={{
            fontSize: '0.625rem',
            fontWeight: 700,
            backgroundColor: 'var(--nb-green)',
            border: '1px solid var(--nb-black)',
            boxShadow: '1px 1px 0 0 var(--nb-black)',
            padding: '2px 6px',
          }}
        >
          VERIFIED RATING
        </span>
      </div>
    </div>
  );
}
