import { StatusBadge } from '../../../../shared/components/ui'
import { formatIndonesianDateTime } from '../../customers/utils/customer.utils'
import type { SystemHealthSnapshot } from '../types/settings.types'

interface SystemConfigSectionProps {
  health: SystemHealthSnapshot | null
  isCheckingHealth: boolean
  onRefreshHealth: () => void
  onNavigate?: (path: string) => void
}

export function SystemConfigSection({
  health,
  isCheckingHealth,
  onRefreshHealth,
  onNavigate,
}: SystemConfigSectionProps) {
  return (
    <div className="sys-settings-grid">
      {/* Status Layanan Backend & Integrasi */}
      <section className="sys-settings-card is-full">
        <div className="sys-card-head">
          <div>
            <h2 className="sys-card-title">Status Layanan &amp; Integrasi Backend</h2>
            <p className="sys-card-desc">
              Pemeriksaan konektivitas langsung ke <code>GET /api/v1/health</code> dan
              otorisasi admin <code>GET /api/v1/admin/ping</code>.
            </p>
          </div>
          <button
            type="button"
            className="sys-btn sys-btn-primary sys-btn-sm nb-btn"
            disabled={isCheckingHealth}
            onClick={onRefreshHealth}
          >
            {isCheckingHealth ? 'Memeriksa...' : 'Periksa Ulang Layanan'}
          </button>
        </div>

        {isCheckingHealth && !health ? (
          <div className="sys-kv-list" aria-busy="true">
            <div className="nb-skeleton-block" style={{ height: 46, width: '100%' }} />
            <div className="nb-skeleton-block is-delay-1" style={{ height: 46, width: '100%' }} />
            <div className="nb-skeleton-block is-delay-2" style={{ height: 46, width: '100%' }} />
          </div>
        ) : health ? (
          <>
            <div className="sys-kv-list">
              <div className="sys-kv-row">
                <span className="sys-kv-key">Backend Express REST API</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="sys-kv-val font-mono-nb">{health.apiBaseUrl}</span>
                  <StatusBadge
                    status={health.backendStatusText}
                    fill={health.backendReachable ? 'var(--nb-green)' : 'var(--nb-pink)'}
                  />
                </div>
              </div>

              <div className="sys-kv-row">
                <span className="sys-kv-key">Environment Backend</span>
                <span className="sys-kv-val font-mono-nb">
                  {health.backendEnvironment ?? 'Tidak diketahui (server offline)'}
                </span>
              </div>

              <div className="sys-kv-row">
                <span className="sys-kv-key">Otorisasi Endpoint Admin (/admin/ping)</span>
                <StatusBadge
                  status={health.adminAuthStatusText}
                  fill={health.adminAuthorized ? 'var(--nb-green)' : 'var(--nb-orange)'}
                />
              </div>

              <div className="sys-kv-row">
                <span className="sys-kv-key">Integrasi Supabase Auth (Frontend)</span>
                <StatusBadge
                  status={
                    health.supabaseConfigured
                      ? 'Terkonfigurasi'
                      : 'Belum Dikonfigurasi'
                  }
                  fill={health.supabaseConfigured ? 'var(--nb-green)' : 'var(--nb-muted)'}
                />
              </div>
            </div>

            <div className="sys-hint">
              Terakhir diperiksa:{' '}
              <span className="font-mono-nb">
                {formatIndonesianDateTime(health.checkedAt)}
              </span>
            </div>
          </>
        ) : (
          <div className="sys-banner is-error" role="alert">
            <div className="sys-banner-body">
              <h3 className="sys-banner-title">Status layanan gagal diperiksa</h3>
              <p className="sys-banner-text">
                Tekan tombol Periksa Ulang Layanan untuk menguji ulang koneksi ke
                backend Express.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Konfigurasi Operasional & Penyimpanan */}
      <section className="sys-settings-card">
        <div className="sys-card-head">
          <div>
            <h2 className="sys-card-title">Penyimpanan PDF &amp; Pembayaran</h2>
            <p className="sys-card-desc">
              Ringkasan kebijakan infrastruktur yang dikunci pada backend (tanpa
              mengekspos kredensial rahasia).
            </p>
          </div>
        </div>

        <div className="sys-kv-list">
          <div className="sys-kv-row">
            <span className="sys-kv-key">Penyimpanan File PDF</span>
            <span className="sys-kv-val">
              Supabase Storage Bucket Privat (<code>ebooks-private</code>)
            </span>
          </div>
          <div className="sys-kv-row">
            <span className="sys-kv-key">Mekanisme Akses PDF</span>
            <span className="sys-kv-val">
              Signed URL sementara setelah validasi <code>EbookAccess</code> di backend
            </span>
          </div>
          <div className="sys-kv-row">
            <span className="sys-kv-key">Payment Gateway</span>
            <span className="sys-kv-val">
              Xendit QRIS (verifikasi via x-callback-token &amp; idempoten)
            </span>
          </div>
        </div>

        <div className="sys-security-note">
          <strong>Keamanan Konfigurasi:</strong> Secret key, service role key, server
          key payment gateway, dan kredensial database dikelola eksklusif di server
          backend dan tidak pernah dikirim ke aplikasi web admin.
        </div>
      </section>

      {/* Pengaturan Operasional yang Dapat Dikelola */}
      <section className="sys-settings-card">
        <div className="sys-card-head">
          <div>
            <h2 className="sys-card-title">Pengaturan Operasional Aktif</h2>
            <p className="sys-card-desc">
              Konfigurasi sistem yang saat ini sudah memiliki endpoint pengelolaan
              nyata di backend.
            </p>
          </div>
          <span className="sys-tag is-success">TERSEDIA</span>
        </div>

        <div className="sys-kv-list">
          <div className="sys-kv-row">
            <div>
              <div className="sys-kv-key">Bobot Kriteria Rekomendasi SPK (SAW)</div>
              <div className="sys-kv-val">
                Endpoint: <code>GET / PUT /api/v1/admin/saw/weights</code>
              </div>
            </div>
            {onNavigate && (
              <button
                type="button"
                className="sys-btn sys-btn-primary sys-btn-sm nb-btn"
                onClick={() => onNavigate('/admin/spk/kriteria')}
              >
                Kelola Bobot SAW
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
