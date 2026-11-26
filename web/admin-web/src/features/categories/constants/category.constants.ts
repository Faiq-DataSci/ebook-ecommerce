import type { CategoryStatus, CategoryTableFilters } from '../types/category'

export const CATEGORY_NAME_MAX_LENGTH = 100
export const CATEGORY_SLUG_MAX_LENGTH = 120
export const CATEGORY_DESCRIPTION_MAX_LENGTH = 300
export const CATEGORY_SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/
export const CATEGORY_PAGE_SIZE = 6

export const DEFAULT_CATEGORY_FILTERS: CategoryTableFilters = {
  search: '',
  status: 'ALL',
  sortBy: 'name',
  sortOrder: 'asc',
  page: 1,
  limit: CATEGORY_PAGE_SIZE,
}

export interface CategoryStatusOptionConfig {
  value: 'ALL' | CategoryStatus
  label: string
  icon: string
  activeBg: string
}

export const CATEGORY_STATUS_OPTIONS: CategoryStatusOptionConfig[] = [
  {
    value: 'ALL',
    label: 'Semua Status',
    icon: 'apps',
    activeBg: 'var(--nb-yellow)',
  },
  {
    value: 'AKTIF',
    label: 'Aktif',
    icon: 'check_circle',
    activeBg: 'var(--nb-green)',
  },
  {
    value: 'NONAKTIF',
    label: 'Nonaktif',
    icon: 'do_not_disturb_on',
    activeBg: 'var(--nb-muted)',
  },
]
