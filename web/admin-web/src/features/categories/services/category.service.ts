import { apiClient } from '../../../services/api/apiClient'
import type { CategoryFormData, CategoryListItem } from '../types/category'

export interface RawAdminCategory {
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

export function mapRawCategoryToListItem(raw: RawAdminCategory): CategoryListItem {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description ?? null,
    isActive: Boolean(raw.isActive),
    ebookCount: raw._count?.ebooks ?? 0,
    createdAt: raw.createdAt,
  }
}

export async function fetchAdminCategories(): Promise<CategoryListItem[]> {
  const res = await apiClient.get<RawAdminCategory[]>(
    '/admin/categories?page=1&limit=50&status=ALL',
  )
  return Array.isArray(res.data) ? res.data.map(mapRawCategoryToListItem) : []
}

export async function createAdminCategory(
  data: CategoryFormData,
): Promise<{ category: CategoryListItem; message: string }> {
  const payload = {
    name: data.name.trim(),
    slug: data.slug.trim() || undefined,
    description: data.description.trim() || null,
    isActive: data.isActive,
  }

  const res = await apiClient.post<RawAdminCategory>('/admin/categories', payload)
  return {
    category: mapRawCategoryToListItem(res.data),
    message: res.message || `Kategori "${payload.name}" berhasil ditambahkan.`,
  }
}

export async function updateAdminCategory(
  categoryId: string,
  data: CategoryFormData,
): Promise<{ category: CategoryListItem; message: string }> {
  const payload = {
    name: data.name.trim(),
    slug: data.slug.trim() || undefined,
    description: data.description.trim() || null,
    isActive: data.isActive,
  }

  const res = await apiClient.patch<RawAdminCategory>(
    `/admin/categories/${categoryId}`,
    payload,
  )
  return {
    category: mapRawCategoryToListItem(res.data),
    message: res.message || `Kategori "${payload.name}" berhasil diperbarui.`,
  }
}

export async function toggleAdminCategoryStatus(
  categoryId: string,
  isActive: boolean,
): Promise<{ category: CategoryListItem; message: string }> {
  const res = await apiClient.patch<RawAdminCategory>(
    `/admin/categories/${categoryId}/status`,
    { isActive },
  )
  return {
    category: mapRawCategoryToListItem(res.data),
    message:
      res.message ||
      (isActive
        ? 'Kategori berhasil diaktifkan kembali ke katalog publik.'
        : 'Kategori berhasil diarsipkan dari katalog publik.'),
  }
}

export async function deleteAdminCategory(
  categoryId: string,
): Promise<{ message: string }> {
  const res = await apiClient.delete<RawAdminCategory>(
    `/admin/categories/${categoryId}`,
  )
  return {
    message: res.message || 'Kategori berhasil dihapus permanen.',
  }
}
