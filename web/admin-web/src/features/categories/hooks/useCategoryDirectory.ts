import { useCallback, useMemo, useState } from 'react'
import type { ToastMessage } from '../../../shared/components/ui'
import { DEFAULT_CATEGORY_FILTERS } from '../constants/category.constants'
import { MOCK_CATEGORIES } from '../data/categoryData'
import type {
  CategoryFormData,
  CategoryListItem,
  CategorySortColumn,
  CategoryStatus,
  CategoryTableFilters,
} from '../types/category'
import {
  computeCategorySummaryMetrics,
  filterCategories,
  paginate,
  sortCategories,
} from '../utils/category.utils'

export function useCategoryDirectory() {
  const [categories, setCategories] =
    useState<CategoryListItem[]>(MOCK_CATEGORIES)
  const [filters, setFilters] = useState<CategoryTableFilters>(
    DEFAULT_CATEGORY_FILTERS,
  )
  const [isLoading] = useState<boolean>(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback(
    (type: ToastMessage['type'], text: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      setToasts((prev) => [...prev, { id, type, text }])
    },
    [],
  )

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const filteredAndSortedCategories = useMemo(() => {
    const filtered = filterCategories(categories, filters)
    return sortCategories(filtered, filters.sortBy, filters.sortOrder)
  }, [categories, filters])

  const {
    items: paginatedCategories,
    totalPages,
    currentPage,
  } = useMemo(
    () => paginate(filteredAndSortedCategories, filters.page, filters.limit),
    [filteredAndSortedCategories, filters.page, filters.limit],
  )

  const summaryMetrics = useMemo(
    () => computeCategorySummaryMetrics(categories),
    [categories],
  )

  const statusCounts = useMemo(
    () => ({
      ALL: summaryMetrics.totalCategories,
      AKTIF: summaryMetrics.activeCategories,
      NONAKTIF: summaryMetrics.inactiveCategories,
    }),
    [summaryMetrics],
  )

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }))
  }, [])

  const setStatus = useCallback((status: 'ALL' | CategoryStatus) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      search: '',
      status: 'ALL',
      page: 1,
    }))
  }, [])

  const handleSort = useCallback((column: CategorySortColumn) => {
    setFilters((prev) => {
      if (prev.sortBy === column) {
        return {
          ...prev,
          sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
        }
      }
      return {
        ...prev,
        sortBy: column,
        sortOrder: 'asc',
      }
    })
  }, [])

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  const refreshCategories = useCallback(() => {
    setCategories((prev) => [...prev])
    addToast('info', 'Data kategori berhasil disegarkan.')
  }, [addToast])

  const createCategory = useCallback(
    (data: CategoryFormData) => {
      const trimmedName = data.name.trim()
      const newCategory: CategoryListItem = {
        id: `cat-${Date.now()}`,
        name: trimmedName,
        slug: data.slug.trim(),
        description: data.description.trim() || null,
        isActive: data.isActive,
        ebookCount: 0,
        createdAt: new Date().toISOString(),
      }
      setCategories((prev) => [newCategory, ...prev])
      setFilters((prev) => ({ ...prev, page: 1 }))
      addToast('success', `Kategori "${trimmedName}" berhasil ditambahkan.`)
    },
    [addToast],
  )

  const updateCategory = useCallback(
    (categoryId: string, data: CategoryFormData) => {
      const trimmedName = data.name.trim()
      setCategories((prev) =>
        prev.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                name: trimmedName,
                slug: data.slug.trim(),
                description: data.description.trim() || null,
                isActive: data.isActive,
              }
            : category,
        ),
      )
      addToast('success', `Kategori "${trimmedName}" berhasil diperbarui.`)
    },
    [addToast],
  )

  const deleteCategory = useCallback(
    (target: CategoryListItem): boolean => {
      if (target.ebookCount > 0) {
        addToast(
          'error',
          `Kategori masih dipakai oleh ${target.ebookCount} e-book. Pindahkan atau arsipkan e-book terkait terlebih dahulu.`,
        )
        return false
      }

      setCategories((prev) => prev.filter((item) => item.id !== target.id))
      addToast('success', `Kategori "${target.name}" berhasil dihapus.`)
      return true
    },
    [addToast],
  )

  return {
    categories,
    filters,
    isLoading,
    toasts,
    filteredTotal: filteredAndSortedCategories.length,
    paginatedCategories,
    totalPages,
    currentPage,
    statusCounts,
    summaryMetrics,
    setSearch,
    setStatus,
    resetFilters,
    handleSort,
    setPage,
    refreshCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    dismissToast,
  }
}
