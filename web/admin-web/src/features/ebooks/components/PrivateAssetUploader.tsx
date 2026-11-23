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
  icon = 'upload_file',
  hint,
  fileName,
  previewUrl,
  onFileSelect,
  onFileRemove,
}: PrivateAssetUploaderProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleValidateAndSelect = (file: File) => {
    setErrorMessage(null)

    // Validate size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setErrorMessage(`Ukuran file melebihi batas maksimal ${maxSizeMB} MB.`)
      return
    }

    // Validate mime/extension if needed
    if (accept === '.pdf' && !file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setErrorMessage('Format file tidak valid. Harap unggah dokumen dengan ekstensi .pdf.')
      return
    }

    if (
      accept.includes('image') &&
      !file.type.startsWith('image/') &&
      !['.png', '.jpg', '.jpeg', '.webp'].some((ext) => file.name.toLowerCase().endsWith(ext))
    ) {
      setErrorMessage('Format gambar tidak valid. Harap unggah JPEG, PNG, atau WebP.')
      return
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

  return (
    <div className="nb-asset-uploader-wrap">
      <div className="nb-uploader-header">
        <label className="nb-form-label">{label}</label>
        {isPrivate ? (
          <span className="nb-private-bucket-badge">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 14 }}
              aria-hidden="true"
            >
              lock
            </span>
            <span>Bucket Privat — Akses via Signed URL</span>
          </span>
        ) : (
          <span className="nb-public-bucket-badge">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 14 }}
              aria-hidden="true"
            >
              public
            </span>
            <span>Sampul (Publik)</span>
          </span>
        )}
      </div>

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
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={handleChange}
        />

        <div className="nb-uploader-icon-box" aria-hidden="true">
          <span className="material-symbols-outlined" style={{ fontSize: 32 }}>
            {icon}
          </span>
        </div>

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

      {fileName && (
        <div className="nb-uploaded-file-row">
          <div className="nb-uploaded-file-meta">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 18 }}
              aria-hidden="true"
            >
              description
            </span>
            <span className="nb-uploaded-file-name">{fileName}</span>
          </div>
          {onFileRemove && (
            <button
              type="button"
              className="nb-btn nb-file-remove-btn"
              onClick={onFileRemove}
              aria-label="Hapus file terpilih"
            >
              Hapus
            </button>
          )}
        </div>
      )}

      {previewUrl && (
        <div className="nb-uploader-preview-box">
          <img
            src={previewUrl}
            alt="Pratinjau sampul e-book"
            className="nb-uploader-preview-img"
          />
        </div>
      )}

      {errorMessage && (
        <div className="nb-form-error-box" role="alert">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 16 }}
            aria-hidden="true"
          >
            error
          </span>
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  )
}
