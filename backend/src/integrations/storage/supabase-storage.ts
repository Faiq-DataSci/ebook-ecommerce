import { randomUUID } from 'node:crypto'
import { env } from '../../config/env.js'
import { getSupabaseAdmin } from '../../config/supabase.js'
import { AppError } from '../../utils/app-error.js'

const MAX_PDF_BYTES = 25 * 1024 * 1024 // 25 MB
const MAX_COVER_BYTES = 5 * 1024 * 1024 // 5 MB

const ALLOWED_COVER_MIMES = new Map<string, string>([
  ['image/jpeg', '.jpg'],
  ['image/jpg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
])

function sanitizeCoverFilename(originalName: string, contentType: string): string {
  const extFromMime = ALLOWED_COVER_MIMES.get(contentType.toLowerCase()) ?? '.png'
  const base = originalName
    .replace(/\.(jpe?g|png|webp)$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)

  return `${base || 'cover'}${extFromMime}`
}

function hasValidImageSignature(buffer: Buffer): boolean {
  if (buffer.length < 12) return false
  // JPEG: FF D8 FF
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
  // PNG: 89 50 4E 47
  const isPng =
    buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47
  // WebP: RIFF....WEBP
  const isWebp =
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  return isJpeg || isPng || isWebp
}

export interface UploadedPublicCoverResult {
  coverUrl: string
  storagePath: string
  fileName: string
  sizeBytes: number
  bucket: string
}

function sanitizePdfFilename(originalName: string): string {
  const base = originalName
    .replace(/\.pdf$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)

  return `${base || 'ebook'}.pdf`
}

export interface UploadedPrivatePdfResult {
  storagePath: string
  fileName: string
  sizeBytes: number
  bucket: string
}

/**
 * Mengunggah file PDF biner ke Supabase Storage bucket privat (`ebooks-private`).
 * Memvalidasi ukuran file dan header biner `%PDF-`.
 */
export async function uploadPrivatePdf(
  buffer: Buffer,
  originalName: string,
  contentType = 'application/pdf',
): Promise<UploadedPrivatePdfResult> {
  if (!buffer || buffer.length === 0) {
    throw new AppError(400, 'VALIDATION_ERROR', 'File PDF tidak boleh kosong')
  }

  if (buffer.length > MAX_PDF_BYTES) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Ukuran file PDF maksimal 25 MB')
  }

  const pdfMagic = buffer.subarray(0, 5).toString('ascii')
  if (pdfMagic !== '%PDF-') {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'Konten file bukan dokumen PDF yang valid (header %PDF- tidak ditemukan)',
    )
  }

  const safeFileName = sanitizePdfFilename(originalName)
  const objectPath = `ebooks/${Date.now()}-${randomUUID()}-${safeFileName}`
  const bucket = env.SUPABASE_EBOOK_BUCKET

  const supabaseAdmin = getSupabaseAdmin()
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(objectPath, buffer, {
      contentType: contentType || 'application/pdf',
      upsert: false,
    })

  if (error || !data?.path) {
    throw new AppError(
      500,
      'STORAGE_UPLOAD_FAILED',
      error?.message ?? 'Gagal mengunggah file PDF ke Supabase Storage privat',
    )
  }

  return {
    storagePath: data.path,
    fileName: safeFileName,
    sizeBytes: buffer.length,
    bucket,
  }
}

/**
 * Membuat signed URL sementara untuk file PDF di bucket privat.
 */
export async function createPrivatePdfSignedUrl(
  objectPath: string,
  expiresInSeconds = 300,
): Promise<string> {
  const supabaseAdmin = getSupabaseAdmin()
  const { data, error } = await supabaseAdmin.storage
    .from(env.SUPABASE_EBOOK_BUCKET)
    .createSignedUrl(objectPath, expiresInSeconds)

  if (error || !data?.signedUrl) {
    throw new Error(error?.message ?? 'Gagal membuat signed URL dari Supabase Storage')
  }

  return data.signedUrl
}

/**
 * Mengunggah gambar sampul e-book ke bucket publik Supabase Storage (`ebook-covers`)
 * dan mengembalikan public HTTPS URL untuk ditampilkan di Admin Web, Web Pengunjung, dan Mobile.
 */
export async function uploadPublicCoverImage(
  buffer: Buffer,
  originalName: string,
  contentType = 'image/png',
): Promise<UploadedPublicCoverResult> {
  if (!buffer || buffer.length === 0) {
    throw new AppError(400, 'VALIDATION_ERROR', 'File gambar sampul tidak boleh kosong')
  }

  if (buffer.length > MAX_COVER_BYTES) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Ukuran gambar sampul maksimal 5 MB')
  }

  const normalizedMime = contentType.toLowerCase()
  if (!ALLOWED_COVER_MIMES.has(normalizedMime) || !hasValidImageSignature(buffer)) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'Format gambar sampul tidak valid. Hanya JPEG, PNG, atau WebP yang diizinkan',
    )
  }

  const safeFileName = sanitizeCoverFilename(originalName, normalizedMime)
  const objectPath = `covers/${Date.now()}-${randomUUID()}-${safeFileName}`
  const bucket = env.SUPABASE_COVER_BUCKET
  const supabaseAdmin = getSupabaseAdmin()

  let uploadRes = await supabaseAdmin.storage.from(bucket).upload(objectPath, buffer, {
    contentType: normalizedMime,
    upsert: false,
  })

  // Jika bucket publik belum dibuat di Supabase Storage, buat otomatis lalu ulangi upload sekali
  if (
    uploadRes.error &&
    uploadRes.error.message.toLowerCase().includes('bucket not found')
  ) {
    await supabaseAdmin.storage.createBucket(bucket, { public: true })
    uploadRes = await supabaseAdmin.storage.from(bucket).upload(objectPath, buffer, {
      contentType: normalizedMime,
      upsert: false,
    })
  }

  if (uploadRes.error || !uploadRes.data?.path) {
    throw new AppError(
      500,
      'STORAGE_UPLOAD_FAILED',
      uploadRes.error?.message ?? 'Gagal mengunggah gambar sampul ke Supabase Storage',
    )
  }

  const { data: publicData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(uploadRes.data.path)

  return {
    coverUrl: publicData.publicUrl,
    storagePath: uploadRes.data.path,
    fileName: safeFileName,
    sizeBytes: buffer.length,
    bucket,
  }
}
