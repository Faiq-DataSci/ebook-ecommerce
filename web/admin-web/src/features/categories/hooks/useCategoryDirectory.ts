import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ToastMessage } from '../../../shared/components/ui'
import { DEFAULT_CATEGORY_FILTERS } from '../constants/category.constants'
import {
  createAdminCategory,
  deleteAdminCategory,
  fetchAdminCategories,
  toggleAdminCategoryStatus,
  updateAdminCategory,
} from '../services/category.service'
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
  const [categories, setCategories] = useState<CategoryListItem[]>([])
  const [filters, setFilters] = useState<CategoryTableFilters>(
    DEFAULT_CATEGORY_FILTERS,
  )
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
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

  const loadCategories = useCallback(
    async (showFeedback = false) => {
      setIsLoading(true)
      setErrorMessage(null)
      try {
        const list = await fetchAdminCategories()
        setCategories(list)
        if (showFeedback) {
          addToast('info', 'Data kategori berhasil disinkronkan dari server.')
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Gagal memuat daftar kategori dari server backend.'
        setErrorMessage(message)
        if (showFeedback) {
          addToast('error', message)
        }
      } finally {
        setIsLoading(false)
      }
    },
    [addToast],
  )

  useEffect(() => {
    let isMounted = true
    fetchAdminCategories()
      .then((list) => {
        if (!isMounted) return
        setCategories(list)
        setErrorMessage(null)
      })
      .catch((err) => {
        if (!isMounted) return
        const message =
          err instanceof Error
            ? err.message
            : 'Gagal memuat daftar kategori dari server backend.'
        setErrorMessage(message)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })
    return () => {
      isMounted = false
    }
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
    void loadCategories(true)
  }, [loadCategories])

  const createCategory = useCallback(
    async (data: CategoryFormData) => {
      try {
        const res = await createAdminCategory(data)
        setFilters((prev) => ({ ...prev, page: 1 }))
        await loadCategories(false)
        addToast('success', res.message)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Gagal menambahkan kategori.'
        addToast('error', message)
        throw err
      }
    },
    [addToast, loadCategories],
  )

  const updateCategory = useCallback(
    async (categoryId: string, data: CategoryFormData) => {
      try {
        const res = await updateAdminCategory(categoryId, data)
        await loadCategories(false)
        addToast('success', res.message)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Gagal memperbarui kategori.'
        addToast('error', message)
        throw err
      }
    },
    [addToast, loadCategories],
  )

  const toggleCategoryStatus = useCallback(
    async (target: CategoryListItem): Promise<boolean> => {
      const nextActive = !target.isActive
      try {
        const res = await toggleAdminCategoryStatus(target.id, nextActive)
        await loadCategories(false)
        addToast('success', res.message)
        return true
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Gagal mengubah status kategori.'
        addToast('error', message)
        return false
      }
    },
    [addToast, loadCategories],
  )

  const deleteCategory = useCallback(
    async (target: CategoryListItem): Promise<boolean> => {
      try {
        const res = await deleteAdminCategory(target.id)
        await loadCategories(false)
        addToast('success', res.message)
        return true
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Gagal menghapus kategori.'
        addToast('error', message)
        return false
      }
    },
    [addToast, loadCategories],
  )

  return {
    categories,
    filters,
    isLoading,
    errorMessage,
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
    toggleCategoryStatus,
    deleteCategory,
    dismissToast,
  }
}
