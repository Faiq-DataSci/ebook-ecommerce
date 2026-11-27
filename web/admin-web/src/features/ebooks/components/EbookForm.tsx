import React, { useMemo } from 'react'
import {
  SimulationBadge,
  ToggleSwitch,
} from '../../../shared/components/ui'
import type { CategoryListItem } from '../../categories/types/category'
import { MOCK_CATEGORIES } from '../../categories/data/categoryData'
import type { EbookFormData, EbookListItem } from '../types/catalog'
import { formatRupiah, getCategoryMeta } from '../utils/catalog.utils'
import { EbookLivePreview } from './EbookLivePreview'
import { PrivateAssetUploader } from './PrivateAssetUploader'

interface EbookFormProps {
  editingEbook: EbookListItem | null
  formData: EbookFormData
  formErrors: Record<string, string>
  categories: CategoryListItem[]
  isSubmitting: boolean
  isFormDirty: boolean
  isSimulationData: boolean
  setFormData: React.Dispatch<React.SetStateAction<EbookFormData>>
  setIsFormDirty: (dirty: boolean) => void
  onApplySynopsisTemplate: () => void
  onCancel: () => void
  onSubmit: (e: React.FormEvent) => void
  onCoverSelect: (file: File) => void
  onCoverRemove: () => void
  onPdfSelect: (file: File) => void
  onPdfRemove: () => void
}

export function EbookForm({
  editingEbook,
  formData,
  formErrors,
  categories,
  isSubmitting,
  isFormDirty,
  isSimulationData,
  setFormData,
  setIsFormDirty,
  onApplySynopsisTemplate,
  onCancel,
  onSubmit,
  onCoverSelect,
  onCoverRemove,
  onPdfSelect,
  onPdfRemove,
}: EbookFormProps) {
  const previewCategoryObj = useMemo(() => {
    return (
      categories.find((c) => c.id === formData.categoryId) ||
      categories[0] ||
      MOCK_CATEGORIES[0]
    )
  }, [categories, formData.categoryId])

  const previewCategoryMeta = useMemo(() => {
    return getCategoryMeta(previewCategoryObj?.slug)
  }, [previewCategoryObj])

  const previewCategoryName = useMemo(() => {
    return previewCategoryObj
      ? previewCategoryObj.name.replace('DATA SIMULASI — ', '')
      : 'Umum'
  }, [previewCategoryObj])

  return (
    <form onSubmit={onSubmit} className="catalog-page-container">
      {/* Page Header */}
      <div className="catalog-page-header">
        <div className="catalog-title-group">
          <div className="catalog-header-title-row">
            <h1 className="catalog-page-title">
              {editingEbook ? 'Ubah Data E-Book' : 'Tambah E-Book Baru'}
            </h1>
            {isSimulationData ? (
              <SimulationBadge />
            ) : (
              <span
                className="nb-simulation-badge"
                style={{
                  backgroundColor: '#D1FAE5',
                  color: '#065F46',
                  borderColor: '#065F46',
                }}
                title="Terhubung langsung dengan backend API PostgreSQL"
              >
                <span>API LIVE</span>
              </span>
            )}
          </div>
          <p className="catalog-page-subtitle">
            Isi rincian buku, unggah sampul publik, dan simpan berkas naskah PDF ke bucket privat.
          </p>
        </div>

        <button
          type="button"
          className="nb-btn nb-dialog-btn-secondary"
          onClick={onCancel}
        >
          Kembali ke Koleksi
        </button>
      </div>

      {/* Form + Sticky Live Preview Split Layout */}
      <div className="catalog-form-layout">
        <div className="catalog-form-main-col">
          {/* Card 1: Metadata Dasar */}
          <div className="catalog-form-card">
            <div className="catalog-form-card-header">
              <div className="catalog-form-card-title-group">
                <span className="catalog-form-card-step-badge">1</span>
                <div>
                  <h2 className="catalog-form-card-title">Informasi & Bibliografi E-Book</h2>
                  <p className="catalog-form-card-subtitle">
                    Identitas buku yang akan ditampilkan pada etalase toko dan sistem pencarian.
                  </p>
                </div>
              </div>
              <span
                className="catalog-form-card-tag"
                style={{ backgroundColor: 'var(--nb-yellow)' }}
              >
                Wajib Diisi
              </span>
            </div>

            {/* Judul E-book */}
            <div className="catalog-form-row-1col">
              <div className="catalog-field-label-row">
                <label htmlFor="form-title-input" className="nb-form-label">
                  Judul Lengkap E-Book <span style={{ color: 'var(--nb-pink)' }}>*</span>
                </label>
                <span
                  className={`catalog-field-char-count ${
                    formData.title.length > 180 ? 'is-warning' : ''
                  }`}
                >
                  {formData.title.length}/200
                </span>
              </div>
              <input
                id="form-title-input"
                type="text"
                maxLength={200}
                className="nb-form-input font-heading"
                style={{ fontWeight: 700, fontSize: 15 }}
                value={formData.title}
                onChange={(e) => {
                  setIsFormDirty(true)
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }}
                placeholder="Contoh: Arsitektur Microservices Berbasis Event & Cloud Native"
              />
              {formErrors.title && (
                <div className="nb-form-error-box" role="alert">
                  <span>{formErrors.title}</span>
                </div>
              )}
            </div>

            {/* Penulis & Kategori Grid */}
            <div className="catalog-form-row-2col">
              <div className="catalog-form-row-1col">
                <label htmlFor="form-author-input" className="nb-form-label">
                  Nama Penulis / Kontributor <span style={{ color: 'var(--nb-pink)' }}>*</span>
                </label>
                <input
                  id="form-author-input"
                  type="text"
                  maxLength={150}
                  className="nb-form-input"
                  value={formData.author}
                  onChange={(e) => {
                    setIsFormDirty(true)
                    setFormData((prev) => ({ ...prev, author: e.target.value }))
                  }}
                  placeholder="Contoh: Dr. Hendra Pratama, M.Kom."
                />
                <span className="nb-form-hint">
                  Nama lengkap penulis beserta gelar akademik/profesi bila ada.
                </span>
                {formErrors.author && (
                  <div className="nb-form-error-box" role="alert">
                    <span>{formErrors.author}</span>
                  </div>
                )}
              </div>

              <div className="catalog-form-row-1col">
                <label htmlFor="form-category-select" className="nb-form-label">
                  Kategori E-Book <span style={{ color: 'var(--nb-pink)' }}>*</span>
                </label>
                <select
                  id="form-category-select"
                  className="nb-form-select font-heading"
                  style={{ fontWeight: 700 }}
                  value={formData.categoryId}
                  onChange={(e) => {
                    setIsFormDirty(true)
                    setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
                  }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name.replace('DATA SIMULASI — ', '')}
                    </option>
                  ))}
                </select>
                <span className="nb-form-hint">
                  Klasifikasi kategori utama untuk navigasi dan pembobotan SAW.
                </span>
                {formErrors.categoryId && (
                  <div className="nb-form-error-box" role="alert">
                    <span>{formErrors.categoryId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sinopsis & Deskripsi */}
            <div className="catalog-form-row-1col">
              <div className="catalog-field-label-row">
                <label htmlFor="form-desc-textarea" className="nb-form-label">
                  Sinopsis & Ringkasan Pembahasan <span style={{ color: 'var(--nb-pink)' }}>*</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: 'var(--nb-black)',
                      fontFamily: 'var(--font-heading)',
                      fontSize: 12,
                      fontWeight: 700,
                      textDecoration: 'underline',
                    }}
                    onClick={onApplySynopsisTemplate}
                  >
                    + Sisipkan Contoh Draf
                  </button>
                  <span className="catalog-field-char-count">
                    {formData.description.length}/1000
                  </span>
                </div>
              </div>
              <textarea
                id="form-desc-textarea"
                className="nb-form-textarea"
                rows={4}
                value={formData.description}
                onChange={(e) => {
                  setIsFormDirty(true)
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }}
                placeholder="Tuliskan ringkasan pembahasan buku, keunggulan materi, target pembaca, dan daftar bab utama yang diulas..."
              />
              {formErrors.description && (
                <div className="nb-form-error-box" role="alert">
                  <span>{formErrors.description}</span>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Harga & Status */}
          <div className="catalog-form-card">
            <div className="catalog-form-card-header">
              <div className="catalog-form-card-title-group">
                <span className="catalog-form-card-step-badge">2</span>
                <div>
                  <h2 className="catalog-form-card-title">Penetapan Harga & Status Toko</h2>
                  <p className="catalog-form-card-subtitle">
                    Tentukan harga jual dalam Rupiah, spesifikasi buku, dan ketersediaan di etalase pembeli.
                  </p>
                </div>
              </div>
              <span
                className="catalog-form-card-tag"
                style={{ backgroundColor: 'var(--nb-green)' }}
              >
                Monetisasi
              </span>
            </div>

            {/* Harga Jual & Status */}
            <div className="catalog-form-row-2col">
              <div className="catalog-form-row-1col">
                <label htmlFor="form-price-input" className="nb-form-label">
                  Harga Jual Satuan (IDR) <span style={{ color: 'var(--nb-pink)' }}>*</span>
                </label>
                <div className="catalog-currency-group">
                  <span className="catalog-currency-prefix">Rp</span>
                  <input
                    id="form-price-input"
                    type="number"
                    min="0"
                    step="1000"
                    className="catalog-currency-input"
                    value={formData.price}
                    onChange={(e) => {
                      setIsFormDirty(true)
                      setFormData((prev) => ({ ...prev, price: e.target.value }))
                    }}
                    placeholder="75000"
                  />
                  <span className="catalog-currency-preview-badge">
                    {formatRupiah(formData.price)}
                  </span>
                </div>

                <div className="catalog-price-presets-row">
                  <span className="catalog-price-presets-label">Preset:</span>
                  {[45000, 75000, 95000, 120000, 0].map((presetPrice) => (
                    <button
                      type="button"
                      key={presetPrice}
                      className={`catalog-price-preset-chip ${
                        formData.price === String(presetPrice) ? 'is-active' : ''
                      }`}
                      onClick={() => {
                        setIsFormDirty(true)
                        setFormData((prev) => ({ ...prev, price: String(presetPrice) }))
                      }}
                    >
                      {presetPrice === 0
                        ? 'Gratis'
                        : `${(presetPrice / 1000).toLocaleString('id-ID')}k`}
                    </button>
                  ))}
                </div>

                {formErrors.price && (
                  <div className="nb-form-error-box" role="alert">
                    <span>{formErrors.price}</span>
                  </div>
                )}
              </div>

              <div className="catalog-form-row-1col">
                <label className="nb-form-label">Status Katalog Toko</label>
                <div className="catalog-status-box">
                  <div className="catalog-status-box-left">
                    <span
                      className={`catalog-status-indicator-dot ${
                        formData.isActive ? 'is-active' : 'is-inactive'
                      }`}
                    />
                    <span>
                      {formData.isActive ? 'Toko Publik (Aktif)' : 'Draf Privat (Nonaktif)'}
                    </span>
                  </div>
                  <ToggleSwitch
                    checked={formData.isActive}
                    onChange={(checked) => {
                      setIsFormDirty(true)
                      setFormData((prev) => ({ ...prev, isActive: checked }))
                    }}
                    activeLabel="Aktif"
                    inactiveLabel="Draf"
                  />
                </div>
                <span className="nb-form-hint">
                  {formData.isActive
                    ? 'Buku langsung dapat dicari & dibeli di etalase toko.'
                    : 'Buku disembunyikan dari pembeli (hanya admin yang dapat melihat).'}
                </span>
              </div>
            </div>

            {/* Spesifikasi Buku: Halaman & Tahun */}
            <div className="catalog-form-row-2col">
              <div className="catalog-form-row-1col">
                <label htmlFor="form-pages-input" className="nb-form-label">
                  Jumlah Halaman Naskah
                </label>
                <input
                  id="form-pages-input"
                  type="number"
                  min="1"
                  className="nb-form-input font-mono-nb"
                  value={formData.pageCount}
                  onChange={(e) => {
                    setIsFormDirty(true)
                    setFormData((prev) => ({ ...prev, pageCount: e.target.value }))
                  }}
                  placeholder="Contoh: 240"
                />
              </div>

              <div className="catalog-form-row-1col">
                <label htmlFor="form-year-input" className="nb-form-label">
                  Tahun Terbit Publikasi
                </label>
                <input
                  id="form-year-input"
                  type="number"
                  min="1900"
                  max="2030"
                  className="nb-form-input font-mono-nb"
                  value={formData.publishedYear}
                  onChange={(e) => {
                    setIsFormDirty(true)
                    setFormData((prev) => ({ ...prev, publishedYear: e.target.value }))
                  }}
                  placeholder="2025"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Berkas Sampul & PDF */}
          <div className="catalog-form-card">
            <div className="catalog-form-card-header">
              <div className="catalog-form-card-title-group">
                <span className="catalog-form-card-step-badge">3</span>
                <div>
                  <h2 className="catalog-form-card-title">Berkas Sampul & Naskah PDF Privat</h2>
                  <p className="catalog-form-card-subtitle">
                    Unggah gambar sampul untuk katalog dan amankan dokumen PDF resmi ke bucket privat.
                  </p>
                </div>
              </div>
              <span
                className="catalog-form-card-tag"
                style={{ backgroundColor: 'var(--nb-blue)' }}
              >
                Supabase Storage
              </span>
            </div>

            <div className="catalog-form-row-2col">
              {/* Uploader Sampul Publik */}
              <PrivateAssetUploader
                label="Berkas Sampul Katalog"
                accept="image/jpeg,image/png,image/webp"
                maxSizeMB={5}
                isPrivate={false}
                hint="Format JPG, PNG, atau WebP (maks. 5 MB • rasio 2:3)."
                fileName={formData.coverFileName}
                previewUrl={formData.coverUrl ?? editingEbook?.coverUrl}
                onFileSelect={onCoverSelect}
                onFileRemove={onCoverRemove}
              />

              {/* Uploader PDF Privat */}
              <PrivateAssetUploader
                label="Dokumen Naskah PDF"
                accept=".pdf"
                maxSizeMB={25}
                isPrivate={true}
                hint="Format .PDF dokumen resmi saja (maks. 25 MB)."
                fileName={formData.pdfFileName}
                onFileSelect={onPdfSelect}
                onFileRemove={onPdfRemove}
              />
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Pratinjau Fisik Neo-Brutalist (Sticky Live Preview) */}
        <EbookLivePreview
          formData={formData}
          categoryMeta={previewCategoryMeta}
          categoryName={previewCategoryName}
        />
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="catalog-bottom-action-bar">
        <div>
          {isFormDirty ? (
            <span className="catalog-bottom-status-text is-dirty">
              Ada perubahan yang belum disimpan
            </span>
          ) : (
            <span className="catalog-bottom-status-text">
              Formulir siap disimpan
            </span>
          )}
        </div>

        <div className="catalog-bottom-btn-group">
          <button
            type="button"
            className="nb-btn nb-dialog-btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Batal
          </button>

          <button
            type="submit"
            className="nb-btn nb-dialog-btn-primary"
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan E-Book'}</span>
          </button>
        </div>
      </div>
    </form>
  )
}
