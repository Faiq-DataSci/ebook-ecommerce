import { useState } from 'react'
import { ConfirmDialog, StatusBadge } from '../../../../shared/components/ui'
import { formatIndonesianDateTime } from '../../customers/utils/customer.utils'
import type {
  AdminProfileData,
  UpdateAdminProfilePayload,
} from '../types/settings.types'

interface AdminAccountSectionProps {
  profile: AdminProfileData | null
  profileWarning: string | null
  isLoadingProfile: boolean
  isSavingProfile: boolean
  isSavingPassword: boolean
  hasLiveSupabaseSession: boolean
  onRefreshProfile: () => void
  onSaveProfile: (payload: UpdateAdminProfilePayload) => Promise<boolean>
  onChangePassword: (newPassword: string) => Promise<boolean>
}

export function AdminAccountSection({
  profile,
  profileWarning,
  isLoadingProfile,
  isSavingProfile,
  isSavingPassword,
  hasLiveSupabaseSession,
  onRefreshProfile,
  onSaveProfile,
  onChangePassword,
}: AdminAccountSectionProps) {
  // Profile Form Draft State (null = mengikuti nilai profile aktual)
  const [fullNameDraft, setFullNameDraft] = useState<string | null>(null)
  const [phoneDraft, setPhoneDraft] = useState<string | null>(null)
  const [profileErrors, setProfileErrors] = useState<{
    fullName?: string
    phone?: string
  }>({})
  const [confirmProfileOpen, setConfirmProfileOpen] = useState(false)

  const fullName = fullNameDraft ?? profile?.fullName ?? ''
  const phone = phoneDraft ?? profile?.phone ?? ''

  // Password Form State
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordErrors, setPasswordErrors] = useState<{
    newPassword?: string
    confirmPassword?: string
  }>({})
  const [confirmPasswordOpen, setConfirmPasswordOpen] = useState(false)

  const validateProfile = (): boolean => {
    const errors: { fullName?: string; phone?: string } = {}
    const trimmedName = fullName.trim()
    const trimmedPhone = phone.trim()

    if (trimmedName.length < 2) {
      errors.fullName = 'Nama lengkap minimal 2 karakter.'
    } else if (trimmedName.length > 120) {
      errors.fullName = 'Nama lengkap maksimal 120 karakter.'
    }

    if (trimmedPhone.length > 25) {
      errors.phone = 'Nomor telepon maksimal 25 karakter.'
    }

    setProfileErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validatePassword = (): boolean => {
    const errors: { newPassword?: string; confirmPassword?: string } = {}

    if (newPassword.length < 8) {
      errors.newPassword = 'Kata sandi baru minimal 8 karakter.'
    }

    if (confirmPassword !== newPassword) {
      errors.confirmPassword = 'Konfirmasi kata sandi tidak cocok.'
    }

    setPasswordErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateProfile()) return
    setConfirmProfileOpen(true)
  }

  const handleConfirmSaveProfile = async () => {
    setConfirmProfileOpen(false)
    const ok = await onSaveProfile({
      fullName: fullName.trim(),
      phone: phone.trim() ? phone.trim() : null,
    })
    if (ok) {
      setFullNameDraft(null)
      setPhoneDraft(null)
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validatePassword()) return
    setConfirmPasswordOpen(true)
  }

  const handleConfirmChangePassword = async () => {
    setConfirmPasswordOpen(false)
    const ok = await onChangePassword(newPassword)
    if (ok) {
      setNewPassword('')
      setConfirmPassword('')
      setPasswordErrors({})
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="sys-settings-grid" aria-busy="true">
        <div className="sys-settings-card">
          <div className="nb-skeleton-block" style={{ height: 22, width: '50%' }} />
          <div className="nb-skeleton-block is-delay-1" style={{ height: 48, width: '100%' }} />
          <div className="nb-skeleton-block is-delay-2" style={{ height: 48, width: '100%' }} />
        </div>
        <div className="sys-settings-card">
          <div className="nb-skeleton-block" style={{ height: 22, width: '50%' }} />
          <div className="nb-skeleton-block is-delay-1" style={{ height: 48, width: '100%' }} />
          <div className="nb-skeleton-block is-delay-2" style={{ height: 48, width: '100%' }} />
        </div>
      </div>
    )
  }

  const canUpdateBackendProfile = profile?.source === 'BACKEND'

  return (
    <>
      <div className="sys-settings-grid">
        {/* Profil Akun Admin */}
        <section className="sys-settings-card">
          <div className="sys-card-head">
            <div>
              <h2 className="sys-card-title">Profil Admin Aktif</h2>
              <p className="sys-card-desc">
                Kelola informasi profil akun administrator yang sedang masuk melalui{' '}
                <code>GET / PATCH /api/v1/users/me</code>.
              </p>
            </div>
            {profile?.source === 'BACKEND' ? (
              <StatusBadge status="Terhubung Backend" fill="var(--nb-green)" />
            ) : (
              <StatusBadge status="Sesi Lokal" fill="var(--nb-orange)" />
            )}
          </div>

          {profileWarning && (
            <div className="sys-banner is-warning" role="status">
              <div className="sys-banner-body">
                <p className="sys-banner-text">{profileWarning}</p>
              </div>
              <div className="sys-banner-actions">
                <button
                  type="button"
                  className="sys-btn sys-btn-sm nb-btn"
                  onClick={onRefreshProfile}
                >
                  Coba Muat Ulang
                </button>
              </div>
            </div>
          )}

          {profile ? (
            <form className="sys-form" onSubmit={handleProfileSubmit} noValidate>
              <div className="sys-field">
                <label htmlFor="admin-email-readonly" className="sys-label">
                  Email Admin
                </label>
                <input
                  id="admin-email-readonly"
                  type="email"
                  className="sys-input"
                  value={profile.email}
                  readOnly
                  disabled
                />
                <span className="sys-hint">
                  Email dikelola melalui Supabase Auth dan tidak dapat diubah
                  langsung dari form profil.
                </span>
              </div>

              <div className="sys-field">
                <label htmlFor="admin-fullname" className="sys-label">
                  Nama Lengkap Admin
                </label>
                <input
                  id="admin-fullname"
                  type="text"
                  className="sys-input"
                  value={fullName}
                  disabled={!canUpdateBackendProfile || isSavingProfile}
                  onChange={(e) => setFullNameDraft(e.target.value)}
                  onBlur={() => validateProfile()}
                  placeholder="Masukkan nama lengkap admin"
                />
                {profileErrors.fullName && (
                  <div className="sys-field-error" role="alert">
                    {profileErrors.fullName}
                  </div>
                )}
              </div>

              <div className="sys-field">
                <label htmlFor="admin-phone" className="sys-label">
                  Nomor Telepon (Opsional)
                </label>
                <input
                  id="admin-phone"
                  type="tel"
                  className="sys-input"
                  value={phone}
                  disabled={!canUpdateBackendProfile || isSavingProfile}
                  onChange={(e) => setPhoneDraft(e.target.value)}
                  onBlur={() => validateProfile()}
                  placeholder="Contoh: 081234567890"
                />
                {profileErrors.phone && (
                  <div className="sys-field-error" role="alert">
                    {profileErrors.phone}
                  </div>
                )}
              </div>

              {profile.updatedAt && (
                <div className="sys-hint">
                  Pembaruan terakhir:{' '}
                  <span className="font-mono-nb">
                    {formatIndonesianDateTime(profile.updatedAt)}
                  </span>
                </div>
              )}

              <div className="sys-form-actions">
                <button
                  type="button"
                  className="sys-btn nb-btn"
                  disabled={!canUpdateBackendProfile || isSavingProfile}
                  onClick={() => {
                    setFullNameDraft(null)
                    setPhoneDraft(null)
                    setProfileErrors({})
                  }}
                >
                  Batalkan Perubahan
                </button>
                <button
                  type="submit"
                  className="sys-btn sys-btn-primary nb-btn"
                  disabled={!canUpdateBackendProfile || isSavingProfile}
                >
                  {isSavingProfile ? 'Menyimpan...' : 'Simpan Profil'}
                </button>
              </div>
            </form>
          ) : (
            <div className="sys-banner is-error" role="alert">
              <div className="sys-banner-body">
                <h3 className="sys-banner-title">Profil admin tidak ditemukan</h3>
                <p className="sys-banner-text">
                  Tidak dapat membaca informasi akun admin yang sedang login.
                </p>
              </div>
              <div className="sys-banner-actions">
                <button
                  type="button"
                  className="sys-btn sys-btn-primary nb-btn"
                  onClick={onRefreshProfile}
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Pengubahan Kata Sandi Admin */}
        <section className="sys-settings-card">
          <div className="sys-card-head">
            <div>
              <h2 className="sys-card-title">Ubah Kata Sandi Admin</h2>
              <p className="sys-card-desc">
                Pembaruan kata sandi hanya berlaku untuk akun admin yang sedang login
                melalui Supabase Auth.
              </p>
            </div>
            {hasLiveSupabaseSession ? (
              <StatusBadge status="Supabase Auth Aktif" fill="var(--nb-green)" />
            ) : (
              <StatusBadge status="Sesi Simulasi" fill="var(--nb-muted)" />
            )}
          </div>

          {!hasLiveSupabaseSession && (
            <div className="sys-security-note">
              Pengubahan kata sandi dinonaktifkan karena Anda tidak masuk melalui
              sesi Supabase Auth aktif. Masuk dengan kredensial Supabase Auth untuk
              mengubah kata sandi akun Anda secara aman.
            </div>
          )}

          <form className="sys-form" onSubmit={handlePasswordSubmit} noValidate>
            <div className="sys-field">
              <label htmlFor="admin-new-password" className="sys-label">
                Kata Sandi Baru
              </label>
              <input
                id="admin-new-password"
                type="password"
                className="sys-input"
                autoComplete="new-password"
                value={newPassword}
                disabled={!hasLiveSupabaseSession || isSavingPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onBlur={() => {
                  if (newPassword) validatePassword()
                }}
                placeholder="Minimal 8 karakter"
              />
              {passwordErrors.newPassword && (
                <div className="sys-field-error" role="alert">
                  {passwordErrors.newPassword}
                </div>
              )}
            </div>

            <div className="sys-field">
              <label htmlFor="admin-confirm-password" className="sys-label">
                Konfirmasi Kata Sandi Baru
              </label>
              <input
                id="admin-confirm-password"
                type="password"
                className="sys-input"
                autoComplete="new-password"
                value={confirmPassword}
                disabled={!hasLiveSupabaseSession || isSavingPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => {
                  if (confirmPassword) validatePassword()
                }}
                placeholder="Ulangi kata sandi baru"
              />
              {passwordErrors.confirmPassword && (
                <div className="sys-field-error" role="alert">
                  {passwordErrors.confirmPassword}
                </div>
              )}
            </div>

            <div className="sys-security-note">
              <strong>Batasan Kewenangan:</strong> Halaman ini hanya mengubah kata
              sandi milik Anda sendiri. Administrator tidak dapat melihat atau
              mengubah kata sandi pelanggan lain.
            </div>

            <div className="sys-form-actions">
              <button
                type="submit"
                className="sys-btn sys-btn-primary nb-btn"
                disabled={!hasLiveSupabaseSession || isSavingPassword}
              >
                {isSavingPassword ? 'Memperbarui...' : 'Perbarui Kata Sandi'}
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* Dialog Konfirmasi Simpan Profil */}
      <ConfirmDialog
        open={confirmProfileOpen}
        title="Simpan Perubahan Profil Admin?"
        confirmLabel={isSavingProfile ? 'Menyimpan...' : 'Ya, Simpan Profil'}
        cancelLabel="Batal"
        confirmVariant="primary"
        isConfirmDisabled={isSavingProfile}
        onConfirm={() => void handleConfirmSaveProfile()}
        onCancel={() => setConfirmProfileOpen(false)}
      >
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>
          Perubahan nama lengkap dan nomor telepon akan langsung disimpan pada tabel{' '}
          <code>users</code> di backend melalui <code>PATCH /api/v1/users/me</code>.
        </p>
      </ConfirmDialog>

      {/* Dialog Konfirmasi Ubah Kata Sandi */}
      <ConfirmDialog
        open={confirmPasswordOpen}
        title="Perbarui Kata Sandi Akun Admin?"
        confirmLabel={isSavingPassword ? 'Memproses...' : 'Ya, Perbarui Kata Sandi'}
        cancelLabel="Batal"
        confirmVariant="danger"
        isConfirmDisabled={isSavingPassword}
        onConfirm={() => void handleConfirmChangePassword()}
        onCancel={() => setConfirmPasswordOpen(false)}
      >
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>
          Kata sandi akun administrator Anda akan diperbarui di Supabase Auth.
          Pastikan Anda menyimpan kata sandi baru dengan aman sebelum melanjutkan.
        </p>
      </ConfirmDialog>
    </>
  )
}
