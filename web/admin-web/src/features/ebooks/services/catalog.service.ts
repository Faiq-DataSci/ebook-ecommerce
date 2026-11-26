import { apiClient } from '../../../services/api/apiClient'
import { formatRupiah } from '../../../shared/utils/formatters'
import { MOCK_CATEGORIES } from '../../categories/data/categoryData'
import type { CategoryListItem } from '../../categories/types/category'
import { MOCK_EBOOKS } from '../data/catalogData'
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
  const priceNum = typeof raw.price === 'number' ? raw.price : parseFloat(String(raw.price)) || 0
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
 * Mengambil daftar kategori aktif untuk filter dan form pilihan kategori
 */
export async function fetchCategories(): Promise<{
  categories: CategoryListItem[]
  isSimulation: boolean
}> {
  try {
    const res = await apiClient.get<RawBackendCategory[]>('/categories')
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      const items: CategoryListItem[] = res.data.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        isActive: c.isActive,
        ebookCount: c._count?.ebooks ?? 0,
        createdAt: c.createdAt,
      }))
      return { categories: items, isSimulation: false }
    }
  } catch (err) {
    console.warn(
      'Endpoint backend /categories belum dapat diakses, menggunakan DATA SIMULASI fallback:',
      err,
    )
  }

  return { categories: MOCK_CATEGORIES, isSimulation: true }
}

/**
 * Mengambil daftar e-book untuk tabel admin dengan parameter pagination, pencarian, status, dan sorting
 */
export async function fetchAdminEbooks(filters: EbookTableFilters): Promise<{
  ebooks: EbookListItem[]
  total: number
  totalPages: number
  isSimulation: boolean
}> {
  try {
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

    const res = await apiClient.get<RawBackendEbook[]>(`/admin/ebooks?${params.toString()}`)
    if (res.data && Array.isArray(res.data)) {
      const mapped = res.data.map(mapBackendEbookToListItem)
      return {
        ebooks: mapped,
        total: res.meta?.total ?? mapped.length,
        totalPages: res.meta?.totalPages ?? Math.max(1, Math.ceil(mapped.length / filters.limit)),
        isSimulation: false,
      }
    }
  } catch (err) {
    console.warn(
      'Endpoint backend /admin/ebooks belum dapat diakses atau unauthenticated, menggunakan DATA SIMULASI fallback:',
      err,
    )
  }

  // Fallback lokal dengan dataset MOCK_EBOOKS
  let filtered = [...MOCK_EBOOKS]
  if (filters.search.trim()) {
    const q = filters.search.toLowerCase()
    filtered = filtered.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.categoryName.toLowerCase().includes(q),
    )
  }
  if (filters.categoryId) {
    filtered = filtered.filter((b) => b.categoryId === filters.categoryId)
  }
  if (filters.status !== 'ALL') {
    const activeBool = filters.status === 'AKTIF'
    filtered = filtered.filter((b) => b.isActive === activeBool)
  }

  filtered.sort((a, b) => {
    let cmp = 0
    if (filters.sortBy === 'title') {
      cmp = a.title.localeCompare(b.title)
    } else if (filters.sortBy === 'price') {
      cmp = a.priceNumeric - b.priceNumeric
    } else if (filters.sortBy === 'salesCount') {
      cmp = a.salesCount - b.salesCount
    } else if (filters.sortBy === 'createdAt') {
      cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
    return filters.sortOrder === 'asc' ? cmp : -cmp
  })

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / filters.limit))
  const start = (filters.page - 1) * filters.limit
  const paginated = filtered.slice(start, start + filters.limit)

  return {
    ebooks: paginated,
    total,
    totalPages,
    isSimulation: true,
  }
}

/**
 * Menyimpan e-book baru melalui POST /api/v1/admin/ebooks
 */
export async function createAdminEbook(
  formData: EbookFormData,
  categoryNameFallback = 'Umum',
): Promise<{
  ebook: EbookListItem
  isSimulation: boolean
}> {
  const priceNum = parseInt(formData.price.replace(/\D/g, ''), 10) || 0
  const pageCountNum = formData.pageCount ? parseInt(formData.pageCount, 10) : null
  const publishedYearNum = formData.publishedYear ? parseInt(formData.publishedYear, 10) : null

  const payload = {
    categoryId: formData.categoryId,
    title: formData.title.trim(),
    author: formData.author.trim(),
    description: formData.description.trim(),
    price: priceNum,
    coverUrl: formData.coverFileName ? `/covers/${formData.coverFileName}` : null,
    storagePath: formData.pdfFileName
      ? `ebooks-private/${formData.pdfFileName}`
      : 'ebooks-private/default.pdf',
    pageCount: pageCountNum,
    publishedYear: publishedYearNum,
    isActive: formData.isActive,
  }

  try {
    const res = await apiClient.post<RawBackendEbook>('/admin/ebooks', payload)
    if (res.data) {
      return { ebook: mapBackendEbookToListItem(res.data), isSimulation: false }
    }
  } catch (err) {
    console.warn('Gagal memanggil POST /admin/ebooks, beralih ke fallback simulasi:', err)
  }

  // Fallback simulasi
  const simulated: EbookListItem = {
    id: `00000000-0000-4000-8000-${Date.now().toString().slice(-12).padStart(12, '0')}`,
    title: formData.title.startsWith('DATA SIMULASI')
      ? formData.title.trim()
      : `DATA SIMULASI — ${formData.title.trim()}`,
    author: formData.author.startsWith('DATA SIMULASI')
      ? formData.author.trim()
      : `DATA SIMULASI — ${formData.author.trim()}`,
    categoryId: formData.categoryId,
    categoryName: categoryNameFallback,
    price: formatRupiah(priceNum),
    priceNumeric: priceNum,
    ratingAvg: 'Belum ada rating',
    salesCount: 0,
    pageCount: pageCountNum,
    publishedYear: publishedYearNum ?? new Date().getFullYear(),
    isActive: formData.isActive,
    coverUrl: null,
    createdAt: new Date().toISOString(),
    description: formData.description,
  }

  return { ebook: simulated, isSimulation: true }
}

/**
 * Memperbarui data e-book melalui PUT /api/v1/admin/ebooks/:id
 */
export async function updateAdminEbook(
  id: string,
  formData: Partial<EbookFormData>,
  categoryNameFallback = 'Umum',
): Promise<{ ebook: EbookListItem; isSimulation: boolean }> {
  const priceNum = formData.price ? parseInt(formData.price.replace(/\D/g, ''), 10) : undefined
  const pageCountNum = formData.pageCount ? parseInt(formData.pageCount, 10) : undefined
  const publishedYearNum = formData.publishedYear ? parseInt(formData.publishedYear, 10) : undefined

  const payload: Record<string, unknown> = {}
  if (formData.categoryId !== undefined) payload.categoryId = formData.categoryId
  if (formData.title !== undefined) payload.title = formData.title.trim()
  if (formData.author !== undefined) payload.author = formData.author.trim()
  if (formData.description !== undefined) payload.description = formData.description.trim()
  if (priceNum !== undefined) payload.price = priceNum
  if (pageCountNum !== undefined) payload.pageCount = pageCountNum
  if (publishedYearNum !== undefined) payload.publishedYear = publishedYearNum
  if (formData.isActive !== undefined) payload.isActive = formData.isActive
  if (formData.coverFileName) payload.coverUrl = `/covers/${formData.coverFileName}`
  if (formData.pdfFileName) payload.storagePath = `ebooks-private/${formData.pdfFileName}`

  try {
    const res = await apiClient.put<RawBackendEbook>(`/admin/ebooks/${id}`, payload)
    if (res.data) {
      return { ebook: mapBackendEbookToListItem(res.data), isSimulation: false }
    }
  } catch (err) {
    console.warn('Gagal memanggil PUT /admin/ebooks/:id, beralih ke fallback simulasi:', err)
  }

  // Fallback simulasi
  const simulated: EbookListItem = {
    id,
    title: formData.title?.trim() || 'DATA SIMULASI — E-Book Diperbarui',
    author: formData.author?.trim() || 'DATA SIMULASI — Penulis',
    categoryId: formData.categoryId || '00000000-0000-4000-8000-000000000101',
    categoryName: categoryNameFallback,
    price: formatRupiah(priceNum ?? 75000),
    priceNumeric: priceNum ?? 75000,
    ratingAvg: '4.80',
    salesCount: 10,
    pageCount: pageCountNum ?? 200,
    publishedYear: publishedYearNum ?? 2025,
    isActive: formData.isActive ?? true,
    coverUrl: null,
    createdAt: new Date().toISOString(),
    description: formData.description,
  }

  return { ebook: simulated, isSimulation: true }
}

/**
 * Mengubah status aktif / arsip e-book melalui PATCH /api/v1/admin/ebooks/:id/status
 */
export async function toggleAdminEbookStatus(
  id: string,
  isActive: boolean,
): Promise<{ ebook: EbookListItem; isSimulation: boolean }> {
  try {
    const res = await apiClient.patch<RawBackendEbook>(`/admin/ebooks/${id}/status`, { isActive })
    if (res.data) {
      return { ebook: mapBackendEbookToListItem(res.data), isSimulation: false }
    }
  } catch (err) {
    console.warn(
      'Gagal memanggil PATCH /admin/ebooks/:id/status, beralih ke fallback simulasi:',
      err,
    )
  }

  const simulated: EbookListItem = {
    id,
    title: 'DATA SIMULASI — E-Book Status',
    author: 'DATA SIMULASI — Penulis',
    categoryId: '00000000-0000-4000-8000-000000000101',
    categoryName: 'Umum',
    price: 'Rp 75.000',
    priceNumeric: 75000,
    ratingAvg: 'Belum ada rating',
    salesCount: 0,
    pageCount: 200,
    publishedYear: 2025,
    isActive,
    coverUrl: null,
    createdAt: new Date().toISOString(),
  }

  return { ebook: simulated, isSimulation: true }
}
