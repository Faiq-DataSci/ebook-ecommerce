import { BookOpen } from 'lucide-react';
import { SimulationBadge } from '../../../components/ui/Badge';

export function CatalogHero() {
  return (
    <header className="nb-catalog-hero">
      {/* Background Watermark Art */}
      <div className="nb-catalog-hero-watermark" aria-hidden="true">
        <BookOpen size={240} strokeWidth={1} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '896px' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
          }}
        >
          <div
            className="nb-mono"
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--nb-yellow)',
              border: 'var(--nb-border-thin)',
              boxShadow: 'var(--nb-shadow-sm)',
              padding: '4px 12px',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--nb-black)',
            }}
          >
            STOREFRONT RESMI • BACA BUKU PRESS
          </div>
          <SimulationBadge />
        </div>

        <h1
          className="nb-h1"
          style={{
            fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
            lineHeight: 1.1,
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            color: 'var(--nb-black)',
            marginBottom: '12px',
            fontWeight: 800,
          }}
        >
          KATALOG LENGKAP E-BOOK
        </h1>

        <p
          className="nb-body-lg"
          style={{
            color: 'var(--nb-text-muted)',
            fontSize: 'clamp(1rem, 1.2vw, 1.125rem)',
            lineHeight: 1.6,
            maxWidth: '768px',
          }}
        >
          Jelajahi koleksi buku terverifikasi dengan lisensi DRM legal kriptografis,
          penilaian objektif berbasis{' '}
          <span
            style={{
              backgroundColor: 'var(--nb-yellow)',
              padding: '2px 8px',
              border: '1px solid var(--nb-black)',
              fontFamily: 'var(--nb-font-heading)',
              fontWeight: 700,
              color: 'var(--nb-black)',
              fontSize: '0.875rem',
              textTransform: 'uppercase',
            }}
          >
            Kurasi Cerdas Objektif
          </span>
          , dan akses berkas seketika tanpa proteksi kadaluarsa.
        </p>
      </div>
    </header>
  );
}
