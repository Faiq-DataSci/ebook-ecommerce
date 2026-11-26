import { AlertTriangle, BookOpen, Sparkles } from 'lucide-react';
import { APP_CONFIG } from '../../constants/app.constants';

export function NavbarMarquee() {
  return (
    <div
      className="nb-marquee-strip"
      role="region"
      aria-label="Informasi Status Toko Berjalan"
    >
      <div className="nb-marquee-track">
        {/* Iterasi 1 */}
        <div className="nb-marquee-group" aria-hidden="false">
          <div className="nb-marquee-item">
            <span className="nb-marquee-badge">
              <AlertTriangle size={12} strokeWidth={2.5} aria-hidden="true" />
              {APP_CONFIG.SIMULATION_LABEL}
            </span>
            <span>Etalase Toko Digital Pelanggan Web &amp; Transaksi B2C</span>
          </div>

          <span className="nb-marquee-star" aria-hidden="true">✦</span>

          <div className="nb-marquee-item">
            <span className="nb-marquee-tag">
              <BookOpen size={12} strokeWidth={2.5} aria-hidden="true" />
              Toko Tunggal B2C E-Book Digital
            </span>
            <span>Akses Berkas PDF Instan &amp; Hak Baca Digital Seumur Hidup</span>
          </div>

          <span className="nb-marquee-star" aria-hidden="true">✦</span>

          <div className="nb-marquee-item">
            <span className="nb-marquee-badge" style={{ backgroundColor: 'var(--nb-black)', color: 'var(--nb-green)' }}>
              <Sparkles size={12} strokeWidth={2.5} aria-hidden="true" />
              TERVERIFIKASI SISTEM
            </span>
            <span>Katalog Literatur Teknik &amp; Sistem Informasi Resmi</span>
          </div>

          <span className="nb-marquee-star" aria-hidden="true">✦</span>
        </div>

        {/* Iterasi 2 (Clone untuk Infinite Seamless Loop) */}
        <div className="nb-marquee-group" aria-hidden="true">
          <div className="nb-marquee-item">
            <span className="nb-marquee-badge">
              <AlertTriangle size={12} strokeWidth={2.5} aria-hidden="true" />
              {APP_CONFIG.SIMULATION_LABEL}
            </span>
            <span>Etalase Toko Digital Pelanggan Web &amp; Transaksi B2C</span>
          </div>

          <span className="nb-marquee-star" aria-hidden="true">✦</span>

          <div className="nb-marquee-item">
            <span className="nb-marquee-tag">
              <BookOpen size={12} strokeWidth={2.5} aria-hidden="true" />
              Toko Tunggal B2C E-Book Digital
            </span>
            <span>Akses Berkas PDF Instan &amp; Hak Baca Digital Seumur Hidup</span>
          </div>

          <span className="nb-marquee-star" aria-hidden="true">✦</span>

          <div className="nb-marquee-item">
            <span className="nb-marquee-badge" style={{ backgroundColor: 'var(--nb-black)', color: 'var(--nb-green)' }}>
              <Sparkles size={12} strokeWidth={2.5} aria-hidden="true" />
              TERVERIFIKASI SISTEM
            </span>
            <span>Katalog Literatur Teknik &amp; Sistem Informasi Resmi</span>
          </div>

          <span className="nb-marquee-star" aria-hidden="true">✦</span>
        </div>
      </div>
    </div>
  );
}
