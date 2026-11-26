import { ToggleSwitch } from '../../../shared/components/ui'
import type { PublisherFormData, PublisherListItem } from '../types/authorPublisher'

interface PublisherFormModalProps {
  isOpen: boolean
  editingPublisher: PublisherListItem | null
  formData: PublisherFormData
  errors: Record<string, string>
  setFormData: React.Dispatch<React.SetStateAction<PublisherFormData>>
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

export function PublisherFormModal({
  isOpen,
  editingPublisher,
  formData,
  errors,
  setFormData,
  onClose,
  onSubmit,
}: PublisherFormModalProps) {
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
        aria-labelledby="publisher-dialog-title"
      >
        <div className="nb-dialog-header">
          <h2 id="publisher-dialog-title" className="nb-dialog-title">
            {editingPublisher ? 'Ubah Mitra Penerbit' : 'Tambah Penerbit Baru'}
          </h2>
          <button
            type="button"
            className="nb-icon-btn nb-btn"
            onClick={onClose}
            aria-label="Tutup form penerbit"
          >
            Tutup
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="nb-dialog-body">
            <div className="nb-form-field">
              <label htmlFor="pub-name-input" className="nb-form-label">
                Nama Penerbit / Imprint <span style={{ color: 'var(--nb-pink)' }}>*</span>
              </label>
              <input
                id="pub-name-input"
                type="text"
                maxLength={150}
                className="nb-form-input"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Contoh: Pustaka Sains Komputasi"
                autoFocus
              />
              {errors.name && (
                <div className="nb-form-error-box" role="alert">
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            <div className="nb-form-field">
              <label htmlFor="pub-city-input" className="nb-form-label">
                Kota Domisili / Kantor Pusat <span style={{ color: 'var(--nb-pink)' }}>*</span>
              </label>
              <input
                id="pub-city-input"
                type="text"
                maxLength={100}
                className="nb-form-input"
                value={formData.city}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, city: e.target.value }))
                }
                placeholder="Contoh: Bandung"
              />
              {errors.city && (
                <div className="nb-form-error-box" role="alert">
                  <span>{errors.city}</span>
                </div>
              )}
            </div>

            <div className="nb-form-grid-2">
              <div className="nb-form-field">
                <label htmlFor="pub-website-input" className="nb-form-label">
                  Situs Web Resmi
                </label>
                <input
                  id="pub-website-input"
                  type="url"
                  className="nb-form-input font-mono-nb"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      website: e.target.value,
                    }))
                  }
                  placeholder="https://penerbit.id"
                />
              </div>

              <div className="nb-form-field">
                <label htmlFor="pub-email-input" className="nb-form-label">
                  Email Layanan Redaksi
                </label>
                <input
                  id="pub-email-input"
                  type="email"
                  className="nb-form-input font-mono-nb"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactEmail: e.target.value,
                    }))
                  }
                  placeholder="redaksi@penerbit.id"
                />
              </div>
            </div>

            <div className="nb-form-field">
              <label htmlFor="pub-desc-input" className="nb-form-label">
                Deskripsi Singkat Penerbit
              </label>
              <textarea
                id="pub-desc-input"
                className="nb-form-textarea"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Cakupan publikasi, reputasi buku teknis, dan mitra institusi..."
              />
            </div>

            <div className="nb-form-field">
              <label className="nb-form-label">Status Kemitraan</label>
              <ToggleSwitch
                checked={formData.isActive}
                onChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isActive: checked }))
                }
                activeLabel="Penerbit Aktif"
                inactiveLabel="Penerbit Nonaktif"
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
              Simpan Penerbit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
