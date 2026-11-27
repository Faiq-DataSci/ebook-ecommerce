import {
  API_BASE_URL,
  ApiError,
  apiClient,
  getAuthHeader,
} from '../../../services/api/apiClient'
import { formatRupiah } from '../../../shared/utils/formatters'
import type { CategoryListItem } from '../../categories/types/category'
import type {
  EbookFormData,
  EbookListItem,
  EbookTableFilters,
} from '../types/catalog'

export interface RawBackendCategory {
  id: string
  name: string
  slug: string
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt?: string
  _count?: {
    ebooks?: number
  }
}

export interface RawBackendEbook {
  id: string
  categoryId: string
  title: string
  author: string
  description: string
  price: string | number
  coverUrl: string | null
  storagePath: string
  pageCount: number | null
  publishedYear: number | null
  ratingAvg: string | number | null
  salesCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  category?: {
    id: string
    name: string
    slug: string
  }
}

/**
 * Mengubah objek raw dari backend Express/Prisma menjadi format tampilan EbookListItem
 */
export function mapBackendEbookToListItem(raw: RawBackendEbook): EbookListItem {
  const priceNum =
    typeof raw.price === 'number' ? raw.price : parseFloat(String(raw.price)) || 0
  const ratingNum = raw.ratingAvg ? parseFloat(String(raw.ratingAvg)) : 0

  return {
    id: raw.id,
    title: raw.title,
    author: raw.author,
    categoryId: raw.categoryId,
    categoryName: raw.category?.name || 'Umum',
    price: formatRupiah(priceNum),
    priceNumeric: priceNum,
    ratingAvg: ratingNum > 0 ? ratingNum.toFixed(2) : 'Belum ada rating',
    salesCount: raw.salesCount ?? 0,
    pageCount: raw.pageCount ?? null,
    publishedYear: raw.publishedYear ?? null,
    isActive: Boolean(raw.isActive),
    coverUrl: raw.coverUrl ?? null,
    createdAt: raw.createdAt,
    description: raw.description,
    storagePath: raw.storagePath,
  }
}

/**
 * Mengambil daftar kategori dari backend untuk filter dan form pilihan kategori
 */
export async function fetchCategories(): Promise<CategoryListItem[]> {
  const res = await apiClient.get<RawBackendCategory[]>(
    '/admin/categories?page=1&limit=50&status=ALL',
  )
  if (!Array.isArray(res.data)) return []

  return res.data.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    isActive: c.isActive,
    ebookCount: c._count?.ebooks ?? 0,
    createdAt: c.createdAt,
  }))
}

/**
 * Mengambil daftar e-book untuk tabel admin dengan parameter pagination, pencarian, status, dan sorting
 */
export async function fetchAdminEbooks(filters: EbookTableFilters): Promise<{
  ebooks: EbookListItem[]
  total: number
  totalPages: number
}> {
  const params = new URLSearchParams()
  params.set('page', String(filters.page))
  params.set('limit', String(filters.limit))
  params.set('status', filters.status)
  params.set('sortBy', filters.sortBy)
  params.set('sortOrder', filters.sortOrder)
  if (filters.search.trim()) {
    params.set('search', filters.search.trim())
  }
  if (filters.categoryId) {
    params.set('categoryId', filters.categoryId)
  }

  const res = await apiClient.get<RawBackendEbook[]>(
    `/admin/ebooks?${params.toString()}`,
  )
  const mapped = Array.isArray(res.data)
    ? res.data.map(mapBackendEbookToListItem)
    : []

  return {
    ebooks: mapped,
    total: res.meta?.total ?? mapped.length,
    totalPages:
      res.meta?.totalPages ?? Math.max(1, Math.ceil(mapped.length / filters.limit)),
  }
}

export interface UploadedCoverAsset {
  coverUrl: string
  storagePath: string
  fileName: string
  sizeBytes: number
  bucket: string
}

/**
 * Mengunggah gambar sampul e-book ke bucket publik Supabase Storage via backend Express
 * Endpoint: POST /api/v1/admin/ebooks/upload-cover (multipart/form-data)
 */
export async function uploadAdminEbookCover(file: File): Promise<UploadedCoverAsset> {
  const authHeaders = await getAuthHeader()
  const formData = new FormData()
  formData.append('coverFile', file)

  const res = await fetch(`${API_BASE_URL}/admin/ebooks/upload-cover`, {
    method: 'POST',
    headers: {
      ...authHeaders,
    },
    body: formData,
  })

  const json = (await res.json().catch(() => null)) as {
    success?: boolean
    data?: UploadedCoverAsset
    message?: string
    error?: { code?: string; message?: string }
  } | null

  if (!res.ok || !json?.data) {
    throw new ApiError(
      json?.error?.message ||
        json?.message ||
        `Gagal mengunggah gambar sampul (HTTP ${res.status})`,
      res.status,
      json?.error?.code,
    )
  }

  return json.data
}

export interface UploadedPdfAsset {
  storagePath: string
  fileName: string
  sizeBytes: number
  bucket: string
}

/**
 * Mengunggah berkas PDF biner langsung ke bucket privat Supabase Storage via backend Express
 * Endpoint: POST /api/v1/admin/ebooks/upload-pdf (multipart/form-data)
 */
export async function uploadAdminEbookPdf(file: File): Promise<UploadedPdfAsset> {
  const authHeaders = await getAuthHeader()
  const formData = new FormData()
  formData.append('pdfFile', file)

  const res = await fetch(`${API_BASE_URL}/admin/ebooks/upload-pdf`, {
    method: 'POST',
    headers: {
      ...authHeaders,
    },
    body: formData,
  })

  const json = (await res.json().catch(() => null)) as {
    success?: boolean
    data?: UploadedPdfAsset
    message?: string
    error?: { code?: string; message?: string }
  } | null

  if (!res.ok || !json?.data) {
    throw new ApiError(
      json?.error?.message ||
        json?.message ||
        `Gagal mengunggah PDF ke bucket privat (HTTP ${res.status})`,
      res.status,
      json?.error?.code,
    )
  }

  return json.data
}

/**
 * Menyimpan e-book baru melalui POST /api/v1/admin/ebooks
 */
export async function createAdminEbook(
  formData: EbookFormData,
): Promise<{ ebook: EbookListItem; message: string }> {
  const priceNum = parseInt(formData.price.replace(/\D/g, ''), 10) || 0
  const pageCountNum = formData.pageCount ? parseInt(formData.pageCount, 10) : null
  const publishedYearNum = formData.publishedYear
    ? parseInt(formData.publishedYear, 10)
    : null

  const normalizedStoragePath = formData.pdfFileName
    ? formData.pdfFileName.includes('/')
      ? formData.pdfFileName
      : `ebooks-private/${formData.pdfFileName}`
    : 'ebooks-private/default.pdf'

  const payload = {
    categoryId: formData.categoryId,
    title: formData.title.trim(),
    author: formData.author.trim(),
    description: formData.description.trim(),
    price: priceNum,
    coverUrl:
      formData.coverUrl ||
      (formData.coverFileName?.startsWith('http') ? formData.coverFileName : null),
    storagePath: normalizedStoragePath,
    pageCount: pageCountNum,
    publishedYear: publishedYearNum,
    isActive: formData.isActive,
  }

  const res = await apiClient.post<RawBackendEbook>('/admin/ebooks', payload)
  return {
    ebook: mapBackendEbookToListItem(res.data),
    message: res.message || `E-book "${payload.title}" berhasil disimpan ke backend.`,
  }
}

/**
 * Memperbarui data e-book melalui PATCH /api/v1/admin/ebooks/:id
 */
export async function updateAdminEbook(
  id: string,
  formData: Partial<EbookFormData>,
): Promise<{ ebook: EbookListItem; message: string }> {
  const priceNum = formData.price
    ? parseInt(formData.price.replace(/\D/g, ''), 10)
    : undefined
  const pageCountNum = formData.pageCount
    ? parseInt(formData.pageCount, 10)
    : undefined
  const publishedYearNum = formData.publishedYear
    ? parseInt(formData.publishedYear, 10)
    : undefined

  const payload: Record<string, unknown> = {}
  if (formData.categoryId !== undefined) payload.categoryId = formData.categoryId
  if (formData.title !== undefined) payload.title = formData.title.trim()
  if (formData.author !== undefined) payload.author = formData.author.trim()
  if (formData.description !== undefined)
    payload.description = formData.description.trim()
  if (priceNum !== undefined) payload.price = priceNum
  if (pageCountNum !== undefined) payload.pageCount = pageCountNum
  if (publishedYearNum !== undefined) payload.publishedYear = publishedYearNum
  if (formData.isActive !== undefined) payload.isActive = formData.isActive
  if (formData.coverUrl !== undefined) {
    payload.coverUrl = formData.coverUrl
  }
  if (formData.pdfFileName) {
    payload.storagePath = formData.pdfFileName.includes('/')
      ? formData.pdfFileName
      : `ebooks-private/${formData.pdfFileName}`
  }

  const res = await apiClient.patch<RawBackendEbook>(`/admin/ebooks/${id}`, payload)
  return {
    ebook: mapBackendEbookToListItem(res.data),
    message: res.message || 'Data e-book berhasil diperbarui di backend.',
  }
}

/**
 * Mengubah status aktif / arsip e-book:
 * - Arsipkan (isActive = false): DELETE /api/v1/admin/ebooks/:id (soft delete)
 * - Aktifkan kembali (isActive = true): PATCH /api/v1/admin/ebooks/:id/status
 */
export async function toggleAdminEbookStatus(
  id: string,
  isActive: boolean,
): Promise<{ ebook: EbookListItem; message: string }> {
  const res = isActive
    ? await apiClient.patch<RawBackendEbook>(`/admin/ebooks/${id}/status`, {
        isActive: true,
      })
    : await apiClient.delete<RawBackendEbook>(`/admin/ebooks/${id}`)

  return {
    ebook: mapBackendEbookToListItem(res.data),
    message:
      res.message ||
      (isActive
        ? 'E-book berhasil diaktifkan kembali di etalase publik.'
        : 'E-book berhasil diarsipkan dari etalase publik.'),
  }
}
