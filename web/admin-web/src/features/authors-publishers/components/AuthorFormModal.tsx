import { ToggleSwitch } from '../../../shared/components/ui'
import type { AuthorFormData, AuthorListItem } from '../types/authorPublisher'

interface AuthorFormModalProps {
  isOpen: boolean
  editingAuthor: AuthorListItem | null
  formData: AuthorFormData
  errors: Record<string, string>
  setFormData: React.Dispatch<React.SetStateAction<AuthorFormData>>
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

export function AuthorFormModal({
  isOpen,
  editingAuthor,
  formData,
  errors,
  setFormData,
  onClose,
  onSubmit,
}: AuthorFormModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="nb-dialog-scrim"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="nb-dialog-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="author-dialog-title"
      >
        <div className="nb-dialog-header">
          <h2 id="author-dialog-title" className="nb-dialog-title">
            {editingAuthor ? 'Ubah Profil Penulis' : 'Tambah Penulis Baru'}
          </h2>
          <button
            type="button"
            className="nb-icon-btn nb-btn"
            onClick={onClose}
            aria-label="Tutup form penulis"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              close
            </span>
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="nb-dialog-body">
            <div className="nb-form-field">
              <label htmlFor="auth-name-input" className="nb-form-label">
                Nama Lengkap & Gelar <span style={{ color: 'var(--nb-pink)' }}>*</span>
              </label>
              <input
                id="auth-name-input"
                type="text"
                maxLength={120}
                className="nb-form-input"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Contoh: Dr. Hendra Pratama"
                autoFocus
              />
              {errors.name && (
                <div className="nb-form-error-box" role="alert">
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            <div className="nb-form-field">
              <label htmlFor="auth-email-input" className="nb-form-label">
                Email Kontak Resmi <span style={{ color: 'var(--nb-pink)' }}>*</span>
              </label>
              <input
                id="auth-email-input"
                type="email"
                maxLength={150}
                className="nb-form-input font-mono-nb"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="hendra@instansi.ac.id"
              />
              {errors.email && (
                <div className="nb-form-error-box" role="alert">
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            <div className="nb-form-field">
              <label htmlFor="auth-affiliation-input" className="nb-form-label">
                Afiliasi / Bidang Keahlian <span style={{ color: 'var(--nb-pink)' }}>*</span>
              </label>
              <input
                id="auth-affiliation-input"
                type="text"
                maxLength={150}
                className="nb-form-input"
                value={formData.affiliation}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    affiliation: e.target.value,
                  }))
                }
                placeholder="Contoh: Institut Teknologi Rekayasa Sistem"
              />
              {errors.affiliation && (
                <div className="nb-form-error-box" role="alert">
                  <span>{errors.affiliation}</span>
                </div>
              )}
            </div>

            <div className="nb-form-field">
              <label htmlFor="auth-bio-input" className="nb-form-label">
                Biografi Singkat (Opsional)
              </label>
              <textarea
                id="auth-bio-input"
                className="nb-form-textarea"
                rows={3}
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
                placeholder="Latar belakang pengalaman kepengarangan dan fokus riset..."
              />
            </div>

            <div className="nb-form-field">
              <label className="nb-form-label">Status Penulis</label>
              <ToggleSwitch
                checked={formData.isActive}
                onChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isActive: checked }))
                }
                activeLabel="Penulis Aktif"
                inactiveLabel="Penulis Nonaktif"
              />
            </div>
          </div>

          <div className="nb-dialog-footer">
            <button
              type="button"
              className="nb-btn nb-dialog-btn-secondary"
              onClick={onClose}
            >
              Batal
            </button>
            <button type="submit" className="nb-btn nb-dialog-btn-primary">
              Simpan Penulis
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
