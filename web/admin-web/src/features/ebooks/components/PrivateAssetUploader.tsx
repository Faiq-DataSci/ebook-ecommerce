import { useRef, useState } from 'react'

interface PrivateAssetUploaderProps {
  label: string
  accept: string
  maxSizeMB: number
  isPrivate?: boolean
  icon?: string
  hint?: string
  fileName?: string
  previewUrl?: string | null
  onFileSelect: (file: File) => void
  onFileRemove?: () => void
}

export function PrivateAssetUploader({
  label,
  accept,
  maxSizeMB,
  isPrivate = false,
  hint,
  fileName,
  previewUrl,
  onFileSelect,
  onFileRemove,
}: PrivateAssetUploaderProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleValidateAndSelect = (file: File) => {
    setErrorMessage(null)

    // Validate size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setErrorMessage(`Ukuran file melebihi batas maksimal ${maxSizeMB} MB.`)
      return
    }

    // Validate mime/extension
    if (
      accept === '.pdf' &&
      !file.name.toLowerCase().endsWith('.pdf') &&
      file.type !== 'application/pdf'
    ) {
      setErrorMessage('Format file tidak valid. Harap unggah dokumen dengan ekstensi .pdf.')
      return
    }

    if (
      accept.includes('image') &&
      !file.type.startsWith('image/') &&
      !['.png', '.jpg', '.jpeg', '.webp'].some((ext) =>
        file.name.toLowerCase().endsWith(ext),
      )
    ) {
      setErrorMessage('Format gambar tidak valid. Harap unggah JPEG, PNG, atau WebP.')
      return
    }

    // Create local preview if image
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setLocalPreviewUrl(url)
    }

    // Simulate upload progress animation
    setUploadProgress(15)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return null
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setUploadProgress(null), 300)
          return 100
        }
        return prev + 25
      })
    }, 80)

    onFileSelect(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleValidateAndSelect(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleValidateAndSelect(e.target.files[0])
    }
  }

  const activePreview = localPreviewUrl || previewUrl
  const hasFile = Boolean(fileName)

  return (
    <div className={`nb-asset-uploader-card ${isPrivate ? 'is-private' : 'is-public'}`}>
      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={handleChange}
      />

      {/* Card Header Slot */}
      <div className="nb-uploader-header">
        <div className="nb-uploader-title-wrap">
          <span className="nb-uploader-title">{label}</span>
        </div>

        {isPrivate ? (
          <span className="nb-private-bucket-badge" title="Disimpan pada bucket privat Supabase Storage">
            <span>BUCKET PRIVAT</span>
          </span>
        ) : (
          <span className="nb-public-bucket-badge" title="Disimpan pada bucket publik Supabase Storage">
            <span>PUBLIK</span>
          </span>
        )}
      </div>

      {/* Card Body Slot */}
      <div className="nb-uploader-body">
        {hasFile ? (
          /* State 1: File is Attached / Selected */
          <div className="nb-file-attached-card">
            <div className="nb-file-attached-info">
              {activePreview && (
                <div className="nb-file-thumbnail-frame">
                  <img
                    src={activePreview}
                    alt="Pratinjau sampul e-book"
                    className="nb-file-thumbnail-img"
                  />
                </div>
              )}

              <div className="nb-file-attached-meta">
                <span className="nb-file-attached-name" title={fileName}>
                  {fileName}
                </span>
                <div className="nb-file-attached-sub">
                  <span className="nb-file-status-badge">
                    <span className="nb-status-dot" aria-hidden="true" />
                    {isPrivate ? 'Tersimpan di Bucket Privat' : 'Tersimpan di Katalog Publik'}
                  </span>
                  {isPrivate && (
                    <span className="nb-signed-url-tag">Signed URL 60s</span>
                  )}
                </div>
              </div>
            </div>

            <div className="nb-file-attached-actions">
              <button
                type="button"
                className="nb-btn-replace"
                onClick={() => fileInputRef.current?.click()}
                title="Ganti berkas dengan dokumen lain"
              >
                <span>Ganti</span>
              </button>

              {onFileRemove && (
                <button
                  type="button"
                  className="nb-btn-delete"
                  onClick={() => {
                    setLocalPreviewUrl(null)
                    onFileRemove()
                  }}
                  title="Hapus berkas ini"
                  aria-label="Hapus file terpilih"
                >
                  <span>Hapus</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* State 2: Empty Dropzone */
          <div
            className={`nb-uploader-dropzone ${isDragging ? 'is-dragging' : ''} ${
              isPrivate ? 'is-private' : ''
            }`}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label={`Unggah file untuk ${label}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                fileInputRef.current?.click()
              }
            }}
          >
            <div className="nb-uploader-text-box">
              <div className="nb-uploader-prompt">
                <strong>Tarik file ke sini</strong> atau{' '}
                <span className="nb-uploader-link">pilih dari perangkat</span>
              </div>
              <div className="nb-uploader-hint">
                {hint || `Maksimal ${maxSizeMB} MB (${accept})`}
              </div>
            </div>
          </div>
        )}

        {/* Upload Progress Bar Animation */}
        {uploadProgress !== null && (
          <div
            className="nb-upload-progress-container"
            role="progressbar"
            aria-valuenow={uploadProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="nb-upload-progress-bar"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        {/* Error Validation Notification */}
        {errorMessage && (
          <div className="nb-form-error-box" role="alert">
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  )
}
