import { Sparkles } from 'lucide-react';
import { Badge, SimulationBadge } from '../../../components/ui/Badge';

interface RecommendationHeaderProps {
  isSimulation: boolean;
  calculatedAt: string;
  totalAlternatives: number;
}

export function RecommendationHeader({
  isSimulation,
  calculatedAt,
  totalAlternatives,
}: RecommendationHeaderProps) {
  return (
    <header
      className="nb-card"
      style={{
        backgroundColor: 'var(--nb-paper)',
        border: '3px solid var(--nb-black)',
        boxShadow: '6px 6px 0 var(--nb-black)',
        padding: '24px 28px',
        marginBottom: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          backgroundColor: 'var(--nb-lavender)',
          borderBottom: '2px solid var(--nb-black)',
        }}
        aria-hidden="true"
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '10px',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            backgroundColor: 'var(--nb-lavender)',
            border: '2px solid var(--nb-black)',
            boxShadow: '2px 2px 0 var(--nb-black)',
            fontFamily: 'var(--nb-font-heading)',
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          <Sparkles size={14} aria-hidden="true" />
          <span>Sistem Pendukung Keputusan (SPK)</span>
        </span>

        <Badge tone="yellow">Metode Simple Additive Weighting (SAW)</Badge>

        {isSimulation && <SimulationBadge />}
      </div>

      <h1
        style={{
          fontFamily: 'var(--nb-font-heading)',
          fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
          fontWeight: 900,
          color: 'var(--nb-black)',
          margin: '0 0 10px 0',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
        }}
      >
        Rekomendasi E-Book Terbaik
      </h1>

      <p
        style={{
          fontFamily: 'var(--nb-font-body)',
          fontSize: '0.9375rem',
          color: 'var(--nb-text-muted)',
          lineHeight: 1.5,
          maxWidth: '820px',
          margin: 0,
        }}
      >
        Peringkat e-book ini dihitung secara objektif oleh engine backend menggunakan metode pembobotan <strong>Simple Additive Weighting (SAW)</strong>. Hasil evaluasi menggabungkan faktor efisiensi harga e-book, kepuasan ulasan pembaca (rating), dan tingkat penjualan buku yang dikonfigurasi oleh Admin.
      </p>

      <div
        style={{
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          fontSize: '0.8125rem',
          fontFamily: 'var(--nb-font-mono)',
          color: 'var(--nb-black)',
          borderTop: '2px dashed var(--nb-black)',
          paddingTop: '12px',
        }}
      >
        <div>
          <strong>Status Engine:</strong> {isSimulation ? 'Mode Simulasi Terverifikasi' : 'Backend Terhubung'}
        </div>
        <div>
          <strong>Waktu Hitung:</strong> {calculatedAt} WIB
        </div>
        <div>
          <strong>Kandidat Dibandingkan:</strong> {totalAlternatives} E-Book
        </div>
      </div>
    </header>
  );
}
