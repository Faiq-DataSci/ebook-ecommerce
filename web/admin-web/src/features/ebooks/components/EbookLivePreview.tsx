import { SimulationBadge } from '../../../shared/components/ui'
import type { EbookFormData } from '../types/catalog'
import { formatRupiah } from '../utils/catalog.utils'

interface EbookLivePreviewProps {
  formData: EbookFormData
  categoryMeta: { icon: string; activeBg: string }
  categoryName: string
}

export function EbookLivePreview({
  formData,
  categoryMeta,
  categoryName,
}: EbookLivePreviewProps) {
  return (
    <div className="catalog-form-preview-col">
      <div className="catalog-preview-box">
        <div className="catalog-preview-top-bar">
          <div className="catalog-preview-top-label">
            <span className="catalog-preview-live-dot" />
            <span>Pratinjau Etalase Toko</span>
          </div>
          <SimulationBadge />
        </div>

        {/* Tangible Book Mockup Frame */}
        <div className="catalog-preview-mockup-frame">
          {/* Cover Stage */}
          <div
            className="catalog-preview-cover-stage"
            style={{ backgroundColor: categoryMeta.activeBg }}
          >
            <div className="catalog-preview-cover-chip">
              <span
                className="catalog-card-category-chip"
                style={{ backgroundColor: 'var(--nb-white)' }}
              >
                <span>{categoryName}</span>
              </span>
            </div>

            <div className="catalog-preview-cover-watermark">
              {formData.coverFileName ? formData.coverFileName : 'SAMPUL DIGITAL'}
            </div>
          </div>

          {/* Book Details */}
          <div className="catalog-preview-details">
            <div className="catalog-preview-meta-row">
              <span
                className="nb-status-badge font-mono-nb"
                style={{ fontSize: 10, padding: '1px 6px' }}
              >
                {formData.isActive ? '● AKTIF' : '○ DRAF'}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  color: '#666',
                }}
              >
                {formData.publishedYear || '2025'}
              </span>
            </div>

            <h3 className="catalog-preview-book-title" title={formData.title}>
              {formData.title.trim() || 'Judul E-Book Belum Diisi'}
            </h3>

            <p className="catalog-preview-book-author">
              oleh {formData.author.trim() || 'Nama Penulis'}
            </p>

            <div className="catalog-preview-price-row">
              <span className="catalog-preview-price-tag">
                {formatRupiah(formData.price || 0)}
              </span>
              <span className="catalog-preview-specs">
                {formData.pageCount ? `${formData.pageCount} Hal` : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Storage & Delivery Info Footnote */}
        <div className="catalog-preview-security-box">
          <div className="catalog-preview-security-row">
            <span className="catalog-preview-security-label">Bucket:</span>
            <span className="catalog-preview-security-val">ebooks-private</span>
          </div>
          <div className="catalog-preview-security-row">
            <span className="catalog-preview-security-label">Akses:</span>
            <span className="catalog-preview-security-val">Signed URL TTL 60s</span>
          </div>
          <div className="catalog-preview-security-row">
            <span className="catalog-preview-security-label">PDF:</span>
            <span
              className="catalog-preview-security-val"
              title={formData.pdfFileName || 'Belum dipilih'}
            >
              {formData.pdfFileName || '(Belum diunggah)'}
            </span>
          </div>
          <div className="catalog-preview-security-row">
            <span className="catalog-preview-security-label">Proteksi:</span>
            <span
              className="catalog-preview-security-val"
              style={{ color: 'var(--nb-green)' }}
            >
              Verified Direct Stream
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
