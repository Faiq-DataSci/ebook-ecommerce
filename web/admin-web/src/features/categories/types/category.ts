export type CategoryStatus = 'AKTIF' | 'NONAKTIF'

export type CategorySortColumn = 'name' | 'slug' | 'ebookCount' | 'createdAt'

export type CategoryFormField = 'name' | 'slug' | 'description'

export interface CategoryListItem {
  id: string
  name: string
  slug: string
  description: string | null
  isActive: boolean
  ebookCount: number
  createdAt: string
}

export interface CategoryFormData {
  name: string
  slug: string
  description: string
  isActive: boolean
}

export type CategoryFormErrors = Partial<Record<CategoryFormField, string>>

export interface CategoryTableFilters {
  search: string
  status: 'ALL' | CategoryStatus
  sortBy: CategorySortColumn
  sortOrder: 'asc' | 'desc'
  page: number
  limit: number
}

export interface CategoryOption {
  id: string
  name: string
}

export interface CategorySummaryMetrics {
  totalCategories: number
  activeCategories: number
  inactiveCategories: number
  totalLinkedEbooks: number
  emptyCategories: number
  activePercentage: number
  avgEbooksPerCategory: string
}
