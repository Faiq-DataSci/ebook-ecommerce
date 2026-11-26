import { useCallback, useEffect, useRef } from 'react'
import { SimulationBadge, ToggleSwitch } from '../../../shared/components/ui'
import {
  CATEGORY_DESCRIPTION_MAX_LENGTH,
  CATEGORY_NAME_MAX_LENGTH,
  CATEGORY_SLUG_MAX_LENGTH,
} from '../constants/category.constants'
import { useCategoryForm } from '../hooks/useCategoryForm'
import type {
  CategoryFormData,
  CategoryFormField,
  CategoryListItem,
} from '../types/category'

interface CategoryFormDialogProps {
  open: boolean
  category?: CategoryListItem | null
  existingCategories: CategoryListItem[]
  onSubmit: (data: CategoryFormData) => void | Promise<void>
  onClose: () => void
}

const FOCUSABLE_SELECTOR =
  'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'

export function CategoryFormDialog({
  open,
  category,
  existingCategories,
  onSubmit,
  onClose,
}: CategoryFormDialogProps) {
  if (!open) return null

  return (
    <CategoryFormDialogContent
      key={category?.id ?? 'create'}
      category={category}
      existingCategories={existingCategories}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  )
}

type CategoryFormDialogContentProps = Omit<CategoryFormDialogProps, 'open'>

function CategoryFormDialogContent({
  category,
  existingCategories,
  onSubmit,
  onClose,
}: CategoryFormDialogContentProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const nameInputRef = useRef<HTMLInputElement | null>(null)
  const slugInputRef = useRef<HTMLInputElement | null>(null)
  const descInputRef = useRef<HTMLTextAreaElement | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const focusField = useCallback((field: CategoryFormField) => {
    if (field === 'name') {
      nameInputRef.current?.focus()
    } else if (field === 'slug') {
      slugInputRef.current?.focus()
    } else if (field === 'description') {
      descInputRef.current?.focus()
    }
  }, [])

  const {
    isEditMode,
    formData,
    errors,
    submitError,
    isSubmitting,
    handleNameChange,
    handleSlugChange,
    handleRegenerateSlug,
    handleDescriptionChange,
    handleActiveChange,
    handleBlur,
    handleSubmit,
  } = useCategoryForm({
    category,
    existingCategories,
    onSubmit,
    onFirstErrorField: focusField,
  })

  useEffect(() => {
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null

    const focusTimer = window.requestAnimationFrame(() => {
      nameInputRef.current?.focus()
    })

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSubmitting) return
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusables =
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        if (focusables.length === 0) return

        const firstElement = focusables[0]
        const lastElement = focusables[focusables.length - 1]

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.cancelAnimationFrame(focusTimer)
      window.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus()
    }
  }, [isSubmitting, onClose])

  const nameDescribedBy = errors.name
    ? 'cat-name-hint cat-name-error'
    : 'cat-name-hint'
  const slugDescribedBy = errors.slug
    ? 'cat-slug-hint cat-slug-error'
    : 'cat-slug-hint'
  const descDescribedBy = errors.description
    ? 'cat-desc-hint cat-desc-error'
    : 'cat-desc-hint'

  return (
    <div
      className="nb-dialog-scrim"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose()
        }
      }}
    >
      <div
        ref={dialogRef}
        className="nb-dialog-panel nb-category-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-dialog-title"
        aria-describedby="category-dialog-desc"
      >
        <div className="nb-dialog-header nb-category-dialog-header">
          <div className="nb-category-dialog-heading">
            <div className="nb-category-dialog-title-row">
              <h2 id="category-dialog-title" className="nb-dialog-title">
                {isEditMode ? 'Ubah Kategori' : 'Tambah Kategori Baru'}
              </h2>
              <SimulationBadge compact />
            </div>
            <p id="category-dialog-desc" className="nb-category-dialog-desc">
              {isEditMode
                ? 'Perbarui nama, slug URL, deskripsi, atau status aktivasi kategori.'
                : 'Lengkapi detail kategori e-book untuk mengelompokkan produk di katalog.'}
            </p>
          </div>

          <button
            type="button"
            className="nb-dialog-close-btn nb-btn"
            style={{ width: 'auto', padding: '0 12px', fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-heading)' }}
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Tutup dialog kategori"
          >
            Tutup
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="nb-dialog-body nb-category-dialog-body">
            {submitError && (
              <div className="nb-form-error-box" role="alert">
                <span>{submitError}</span>
              </div>
            )}

            <div className="nb-category-form-grid">
              <div className="nb-form-field">
                <div className="nb-form-label-row">
                  <label htmlFor="cat-name-input" className="nb-form-label">
                    Nama Kategori{' '}
                    <span className="nb-form-required" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <span className="nb-form-char-count font-mono-nb">
                    {formData.name.length}/{CATEGORY_NAME_MAX_LENGTH}
                  </span>
                </div>
                <input
                  ref={nameInputRef}
                  id="cat-name-input"
                  type="text"
                  maxLength={CATEGORY_NAME_MAX_LENGTH}
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={nameDescribedBy}
                  disabled={isSubmitting}
                  className="nb-form-input"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onBlur={() => handleBlur('name')}
                  placeholder="Contoh: Sains Data & AI"
                />
                <span id="cat-name-hint" className="nb-form-hint">
                  Gunakan nama yang singkat dan mudah dikenali pembaca.
                </span>
                {errors.name && (
                  <div
                    id="cat-name-error"
                    className="nb-form-error-box"
                    role="alert"
                  >
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>

              <div className="nb-form-field">
                <div className="nb-form-label-row">
                  <label htmlFor="cat-slug-input" className="nb-form-label">
                    Slug Kategori{' '}
                    <span className="nb-form-required" aria-hidden="true">
                      *
                    </span>
                  </label>
                  {formData.name.trim() && (
                    <button
                      type="button"
                      className="nb-form-inline-action"
                      onClick={handleRegenerateSlug}
                      disabled={isSubmitting}
                    >
                      Buat dari nama
                    </button>
                  )}
                </div>
                <input
                  ref={slugInputRef}
                  id="cat-slug-input"
                  type="text"
                  maxLength={CATEGORY_SLUG_MAX_LENGTH}
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.slug)}
                  aria-describedby={slugDescribedBy}
                  disabled={isSubmitting}
                  className="nb-form-input font-mono-nb"
                  value={formData.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  onBlur={() => handleBlur('slug')}
                  placeholder="sains-data-ai"
                />
                <span id="cat-slug-hint" className="nb-form-hint">
                  Huruf kecil, angka, dan tanda hubung tanpa spasi (unik).
                </span>
                {errors.slug && (
                  <div
                    id="cat-slug-error"
                    className="nb-form-error-box"
                    role="alert"
                  >
                    <span>{errors.slug}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="nb-form-field">
              <div className="nb-form-label-row">
                <label htmlFor="cat-desc-input" className="nb-form-label">
                  Deskripsi Singkat (Opsional)
                </label>
                <span className="nb-form-char-count font-mono-nb">
                  {formData.description.length}/{CATEGORY_DESCRIPTION_MAX_LENGTH}
                </span>
              </div>
              <textarea
                ref={descInputRef}
                id="cat-desc-input"
                maxLength={CATEGORY_DESCRIPTION_MAX_LENGTH}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={descDescribedBy}
                disabled={isSubmitting}
                className="nb-form-textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                onBlur={() => handleBlur('description')}
                placeholder="Penjelasan ringkas cakupan materi e-book di bawah kategori ini..."
              />
              <span id="cat-desc-hint" className="nb-form-hint">
                Membantu admin membedakan cakupan antar kategori.
              </span>
              {errors.description && (
                <div
                  id="cat-desc-error"
                  className="nb-form-error-box"
                  role="alert"
                >
                  <span>{errors.description}</span>
                </div>
              )}
            </div>

            <div className="nb-form-field nb-category-status-panel">
              <label htmlFor="cat-status-switch" className="nb-form-label">
                Status Aktivasi
              </label>
              <ToggleSwitch
                id="cat-status-switch"
                checked={formData.isActive}
                onChange={handleActiveChange}
                disabled={isSubmitting}
                activeLabel="Aktif"
                inactiveLabel="Nonaktif"
              />
              <span className="nb-form-hint">
                Kategori aktif dapat dipilih saat menambah atau menyunting
                e-book.
              </span>
            </div>
          </div>

          <div className="nb-dialog-footer nb-category-dialog-footer">
            <button
              type="button"
              className="nb-btn nb-dialog-btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="nb-btn nb-dialog-btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <span className="nb-btn-spinner" aria-hidden="true" />
              )}
              <span>
                {isSubmitting ? 'Menyimpan...' : 'Simpan Kategori'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
