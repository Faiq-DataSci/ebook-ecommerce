import { BadgeCheck, Sparkles } from 'lucide-react';

interface CatalogBottomBannerProps {
  onOpenCalculator?: () => void;
}

export function CatalogBottomBanner({ onOpenCalculator }: CatalogBottomBannerProps) {
  return (
    <aside
      aria-label="Informasi Lisensi dan Garansi Akses Digital"
      className="nb-catalog-bottom-banner"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--nb-space-3)',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'var(--nb-orange)',
            border: '2px solid var(--nb-black)',
            boxShadow: '2px 2px 0 0 var(--nb-black)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <BadgeCheck size={22} strokeWidth={2.5} color="var(--nb-black)" />
        </div>

        <div>
          <h4
            className="nb-h3"
            style={{
              fontSize: '1rem',
              textTransform: 'uppercase',
              color: 'var(--nb-black)',
              margin: 0,
            }}
          >
            GARANSI AKSES SEUMUR HIDUP
          </h4>
          <p
            className="nb-body-sm"
            style={{
              color: 'var(--nb-text-muted)',
              fontSize: '0.8125rem',
              lineHeight: 1.45,
              marginTop: '2px',
              marginRight: '8px',
            }}
          >
            Setiap buku dibundel dengan stempel kriptografis nama pembeli. Unduh
            ulang kapan saja tanpa biaya tambahan.
          </p>
        </div>
      </div>

      <div style={{ flexShrink: 0 }}>
        <button
          type="button"
          onClick={onOpenCalculator}
          className="nb-pressable"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            minHeight: '40px',
            paddingInline: '16px',
            backgroundColor: 'var(--nb-lavender)',
            color: 'var(--nb-black)',
            border: '2px solid var(--nb-black)',
            boxShadow: '3px 3px 0 0 var(--nb-black)',
            fontFamily: 'var(--nb-font-heading)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          <Sparkles size={18} strokeWidth={2.25} />
          Lihat Pilihan Terbaik
        </button>
      </div>
    </aside>
  );
}
