import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Download, Smartphone } from 'lucide-react';
import { APP_CONFIG } from '../../../constants/app.constants';
import { ROUTES } from '../../../constants/routes';
import { Badge, SimulationBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export function PromotionalSection() {
  const [downloaded, setDownloaded] = useState(false);

  const handleSimulatedDownload = () => {
    const releaseManifest = [
      '======================================================',
      'E-BOOK STORE MOBILE APP (ANDROID) - DATA SIMULASI',
      '======================================================',
      `Sistem        : ${APP_CONFIG.SYSTEM_NAME}`,
      'Nama Proyek   : ebook_store (Flutter + Dart + Riverpod + Dio)',
      'Platform      : Android (APK Distribusi Internal)',
      'Status Modul  : [RENCANA] / Paket Simulasi Antarmuka Web',
      `Waktu Unduh   : ${new Date().toISOString()}`,
    ].join('\n');

    const blob = new Blob([releaseManifest], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ebook_store-android-info-simulasi.txt';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);

    setDownloaded(true);
  };

  return (
    <section
      id="download-app"
      className="nb-section"
      style={{ backgroundColor: 'var(--nb-yellow)' }}
    >
      <div
        className="nb-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--nb-space-6)',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--nb-white)',
            border: 'var(--nb-border-thick)',
            boxShadow: 'var(--nb-shadow-xl)',
            padding: 'var(--nb-space-8)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--nb-space-6)',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '12px',
              }}
            >
              <SimulationBadge />
              <Badge
                tone="blue"
                icon={<Smartphone size={14} strokeWidth={2.25} aria-hidden="true" />}
              >
                Aplikasi Android: ebook_store [RENCANA]
              </Badge>
            </div>
            <h2 className="nb-h1" style={{ marginBottom: '10px' }}>
              Download Apps E-Book Store di Perangkat Android Anda.
            </h2>
            <p className="nb-body-lg">
              Bawa pustaka digital Anda ke mana saja. Aplikasi mobile resmi{' '}
              <strong>E-Book Store (`ebook_store`)</strong> berbasis Flutter
              memungkinkan Anda menjelajahi katalog, memantau status pesanan,
              serta membaca PDF terverifikasi dengan nyaman di ponsel.
            </p>
            {downloaded && (
              <p
                className="nb-label"
                style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  backgroundColor: 'var(--nb-green)',
                  border: 'var(--nb-border-thin)',
                  display: 'inline-block',
                }}
              >
                Berkas simulasi rilis APK (
                <code>ebook_store-android-info-simulasi.txt</code>) berhasil
                diunduh.
              </p>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <Button
              type="button"
              variant="blue"
              size="lg"
              leftIcon={
                downloaded ? (
                  <Check size={18} strokeWidth={2.5} aria-hidden="true" />
                ) : (
                  <Download size={18} strokeWidth={2.25} aria-hidden="true" />
                )
              }
              onClick={handleSimulatedDownload}
            >
              {downloaded
                ? 'Info APK Terunduh (Simulasi)'
                : 'Download APK Android (Simulasi)'}
            </Button>
            <Link
              to={ROUTES.CATALOG}
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
              Telusuri Koleksi E-Book
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
