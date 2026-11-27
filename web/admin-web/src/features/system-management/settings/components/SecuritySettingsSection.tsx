import { useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { ConfirmDialog, StatusBadge } from '../../../../shared/components/ui'
import type { AdminUser } from '../../../authentication/types/auth.types'
import { formatIndonesianDateTime } from '../../customers/utils/customer.utils'

interface SecuritySettingsSectionProps {
  user: AdminUser | null
  session: Session | null
  onLogout: () => Promise<void>
  onNavigate?: (path: string) => void
}

export function SecuritySettingsSection({
  user,
  session,
  onLogout,
  onNavigate,
}: SecuritySettingsSectionProps) {
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const sessionExpiresIso = session?.expires_at
    ? new Date(session.expires_at * 1000).toISOString()
    : null

  const handleConfirmLogout = async () => {
    setConfirmLogoutOpen(false)
    setIsLoggingOut(true)
    try {
      await onLogout()
      onNavigate?.('/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <div className="sys-settings-grid">
        {/* Informasi Sesi Autentikasi */}
        <section className="sys-settings-card">
          <div className="sys-card-head">
            <div>
              <h2 className="sys-card-title">Informasi Sesi Akun Saat Ini</h2>
              <p className="sys-card-desc">
                Status autentikasi aktif pada peramban ini tanpa menampilkan token
                akses maupun kredensial sensitif.
              </p>
            </div>
            <StatusBadge
              status={session ? 'JWT Supabase Aktif' : 'Sesi Simulasi'}
              fill={session ? 'var(--nb-green)' : 'var(--nb-orange)'}
            />
          </div>

          <div className="sys-kv-list">
            <div className="sys-kv-row">
              <span className="sys-kv-key">Akun Masuk</span>
              <span className="sys-kv-val">{user?.email ?? '-'}</span>
            </div>
            <div className="sys-kv-row">
              <span className="sys-kv-key">Peran Terverifikasi</span>
              <span className="sys-kv-val font-mono-nb">{user?.role ?? '-'}</span>
            </div>
            <div className="sys-kv-row">
              <span className="sys-kv-key">Mekanisme Autentikasi</span>
              <span className="sys-kv-val">
                {session
                  ? 'Supabase Auth Bearer JWT + Verifikasi Role Backend'
                  : 'Mode Simulasi Pengembangan Lokal'}
              </span>
            </div>
            <div className="sys-kv-row">
              <span className="sys-kv-key">Masa Berlaku Token Sesi</span>
              <span className="sys-kv-val font-mono-nb">
                {sessionExpiresIso
                  ? formatIndonesianDateTime(sessionExpiresIso)
                  : 'Berakhir saat tab/sesi ditutup'}
              </span>
            </div>
          </div>

          <div className="sys-form-actions">
            <button
              type="button"
              className="sys-btn sys-btn-danger nb-btn"
              disabled={isLoggingOut}
              onClick={() => setConfirmLogoutOpen(true)}
            >
              {isLoggingOut ? 'Mengakhiri Sesi...' : 'Akhiri Sesi Sekarang'}
            </button>
          </div>
        </section>

        {/* Kontrol Akses Berbasis Peran (RBAC) */}
        <section className="sys-settings-card">
          <div className="sys-card-head">
            <div>
              <h2 className="sys-card-title">Kebijakan Akses Berdasarkan Role (RBAC)</h2>
              <p className="sys-card-desc">
                Mengikuti enum <code>UserRole</code> pada <code>schema.prisma</code>{' '}
                dan middleware <code>authenticate</code> + <code>authorize</code> di
                backend.
              </p>
            </div>
            <span className="sys-tag is-info">ENFORCED DI BACKEND</span>
          </div>

          <div className="sys-kv-list">
            <div className="sys-kv-row">
              <div>
                <div className="sys-kv-key">Role: ADMIN</div>
                <div className="sys-kv-val">
                  Akses penuh rute <code>/api/v1/admin/*</code> (dashboard, katalog
                  e-book, bobot SAW, dan pengelolaan administratif).
                </div>
              </div>
              <StatusBadge status="Aktif" fill="var(--nb-green)" />
            </div>

            <div className="sys-kv-row">
              <div>
                <div className="sys-kv-key">Role: CUSTOMER</div>
                <div className="sys-kv-val">
                  Akses katalog publik, pesanan pribadi, transaksi pribadi, rekomendasi
                  SAW, serta permintaan Signed URL e-book miliknya. Ditolak (HTTP 403)
                  pada rute admin.
                </div>
              </div>
              <StatusBadge status="Terisolasi" fill="var(--nb-blue)" />
            </div>
          </div>

          <div className="sys-security-note">
            <strong>Prinsip Otorisasi Proyek:</strong> Menyembunyikan menu di UI
            hanya bersifat kosmetik. Validasi hak akses dilakukan penuh di server
            Express pada setiap permintaan API.
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={confirmLogoutOpen}
        title="Akhiri Sesi Administrator?"
        confirmLabel={isLoggingOut ? 'Memproses...' : 'Ya, Akhiri Sesi'}
        cancelLabel="Batal"
        confirmVariant="danger"
        isConfirmDisabled={isLoggingOut}
        onConfirm={() => void handleConfirmLogout()}
        onCancel={() => setConfirmLogoutOpen(false)}
      >
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>
          Anda akan keluar dari konsol admin dan diarahkan ke halaman login. Token
          sesi aktif pada peramban ini akan dihapus.
        </p>
      </ConfirmDialog>
    </>
  )
}
