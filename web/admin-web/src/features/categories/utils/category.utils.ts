import {
  CATEGORY_DESCRIPTION_MAX_LENGTH,
  CATEGORY_NAME_MAX_LENGTH,
  CATEGORY_SLUG_MAX_LENGTH,
  CATEGORY_SLUG_PATTERN,
} from '../constants/category.constants'
import type {
  CategoryFormData,
  CategoryFormErrors,
  CategoryListItem,
  CategorySortColumn,
  CategorySummaryMetrics,
  CategoryTableFilters,
} from '../types/category'

function normalizeKey(value: string): string {
  return value.trim().toLowerCase()
}

export function generateSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, CATEGORY_SLUG_MAX_LENGTH)
}

export function isDuplicateName(
  name: string,
  categories: CategoryListItem[],
  excludeId?: string,
): boolean {
  const normalizedTarget = normalizeKey(name)
  if (!normalizedTarget) return false

  return categories.some(
    (category) =>
      category.id !== excludeId &&
      normalizeKey(category.name) === normalizedTarget,
  )
}

export function isDuplicateSlug(
  slug: string,
  categories: CategoryListItem[],
  excludeId?: string,
): boolean {
  const normalizedTarget = normalizeKey(slug)
  if (!normalizedTarget) return false

  return categories.some(
    (category) =>
      category.id !== excludeId &&
      normalizeKey(category.slug) === normalizedTarget,
  )
}

export function validateCategoryForm(
  data: CategoryFormData,
  existingCategories: CategoryListItem[],
  editingId?: string,
): CategoryFormErrors {
  const errors: CategoryFormErrors = {}
  const trimmedName = data.name.trim()
  const trimmedSlug = data.slug.trim()
  const trimmedDescription = data.description.trim()

  if (!trimmedName) {
    errors.name = 'Nama kategori wajib diisi. Masukkan nama kategori yang jelas.'
  } else if (trimmedName.length > CATEGORY_NAME_MAX_LENGTH) {
    errors.name = `Nama kategori maksimal ${CATEGORY_NAME_MAX_LENGTH} karakter. Persingkat nama kategori.`
  } else if (isDuplicateName(trimmedName, existingCategories, editingId)) {
    errors.name = 'Nama kategori sudah dipakai. Gunakan nama kategori lain.'
  }

  if (!trimmedSlug) {
    errors.slug =
      'Slug kategori wajib diisi. Gunakan huruf kecil, angka, dan tanda hubung.'
  } else if (trimmedSlug.length > CATEGORY_SLUG_MAX_LENGTH) {
    errors.slug = `Slug kategori maksimal ${CATEGORY_SLUG_MAX_LENGTH} karakter. Persingkat slug.`
  } else if (!CATEGORY_SLUG_PATTERN.test(trimmedSlug)) {
    errors.slug =
      'Format slug tidak valid. Gunakan huruf kecil, angka, dan tanda hubung tanpa spasi (contoh: sains-data).'
  } else if (isDuplicateSlug(trimmedSlug, existingCategories, editingId)) {
    errors.slug = 'Slug sudah dipakai. Gunakan slug lain.'
  }

  if (trimmedDescription.length > CATEGORY_DESCRIPTION_MAX_LENGTH) {
    errors.description = `Deskripsi maksimal ${CATEGORY_DESCRIPTION_MAX_LENGTH} karakter. Ringkas penjelasan kategori.`
  }

  return errors
}

export function filterCategories(
  categories: CategoryListItem[],
  filters: Pick<CategoryTableFilters, 'search' | 'status'>,
): CategoryListItem[] {
  const query = normalizeKey(filters.search)

  return categories.filter((category) => {
    if (filters.status !== 'ALL') {
      const shouldBeActive = filters.status === 'AKTIF'
      if (category.isActive !== shouldBeActive) return false
    }

    if (!query) return true

    return (
      category.name.toLowerCase().includes(query) ||
      category.slug.toLowerCase().includes(query) ||
      Boolean(category.description?.toLowerCase().includes(query))
    )
  })
}

export function sortCategories(
  categories: CategoryListItem[],
  sortBy: CategorySortColumn,
  sortOrder: 'asc' | 'desc',
): CategoryListItem[] {
  const sorted = [...categories]

  sorted.sort((a, b) => {
    let comparison = 0
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name, 'id')
    } else if (sortBy === 'slug') {
      comparison = a.slug.localeCompare(b.slug, 'id')
    } else if (sortBy === 'ebookCount') {
      comparison = a.ebookCount - b.ebookCount
    } else if (sortBy === 'createdAt') {
      comparison =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
    return sortOrder === 'asc' ? comparison : -comparison
  })

  return sorted
}

export function paginate<T>(
  items: T[],
  page: number,
  limit: number,
): {
  items: T[]
  totalPages: number
  currentPage: number
} {
  const safeLimit = Math.max(1, limit)
  const totalPages = Math.max(1, Math.ceil(items.length / safeLimit))
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const start = (currentPage - 1) * safeLimit

  return {
    items: items.slice(start, start + safeLimit),
    totalPages,
    currentPage,
  }
}

export function computeCategorySummaryMetrics(
  categories: CategoryListItem[],
): CategorySummaryMetrics {
  const totalCategories = categories.length
  let activeCategories = 0
  let totalLinkedEbooks = 0
  let emptyCategories = 0

  for (const category of categories) {
    if (category.isActive) {
      activeCategories += 1
    }
    totalLinkedEbooks += category.ebookCount
    if (category.ebookCount === 0) {
      emptyCategories += 1
    }
  }

  const inactiveCategories = totalCategories - activeCategories
  const activePercentage =
    totalCategories > 0
      ? Math.round((activeCategories / totalCategories) * 100)
      : 0
  const avgEbooksPerCategory =
    totalCategories > 0
      ? (totalLinkedEbooks / totalCategories).toFixed(1).replace('.', ',')
      : '0,0'

  return {
    totalCategories,
    activeCategories,
    inactiveCategories,
    totalLinkedEbooks,
    emptyCategories,
    activePercentage,
    avgEbooksPerCategory,
  }
}
