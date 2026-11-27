import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ToastMessage } from '../../../../shared/components/ui'
import {
  fetchAdminCustomers,
  fetchCustomerDetail,
  querySimulationCustomers,
  SIMULATION_CUSTOMERS,
  updateCustomerAccountStatus,
} from '../services/customers.service'
import type {
  CustomerDataSource,
  CustomerRecord,
  CustomerRoleFilter,
  CustomerSortField,
  CustomerStatusFilter,
  CustomerSummaryMetrics,
  CustomerTableFilters,
} from '../types/customer.types'

const DEFAULT_FILTERS: CustomerTableFilters = {
  search: '',
  status: 'ALL',
  role: 'ALL',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 8,
}

export function useCustomers() {
  const [filters, setFilters] = useState<CustomerTableFilters>(DEFAULT_FILTERS)
  const [reloadTick, setReloadTick] = useState<number>(0)

  // Live backend state
  const [liveItems, setLiveItems] = useState<CustomerRecord[]>([])
  const [liveTotal, setLiveTotal] = useState<number>(0)
  const [liveTotalPages, setLiveTotalPages] = useState<number>(1)
  const [liveSummary, setLiveSummary] = useState<CustomerSummaryMetrics | null>(null)
  const [liveDashboardActiveCount, setLiveDashboardActiveCount] = useState<number | null>(null)
  const [liveSource, setLiveSource] = useState<CustomerDataSource>('UNAVAILABLE')
  const [liveErrorMessage, setLiveErrorMessage] = useState<string | null>(null)
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(true)

  // Explicit opt-in simulation mode state (never pretends to be live data)
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(false)
  const [simulationStore, setSimulationStore] =
    useState<CustomerRecord[]>(SIMULATION_CUSTOMERS)

  // Selected customer for detail drawer
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false)

  // Mutation loading state
  const [isMutating, setIsMutating] = useState<boolean>(false)

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const pushToast = useCallback((type: ToastMessage['type'], text: string) => {
    setToasts((prev) => [
      ...prev,
      { id: `cust-toast-${Date.now()}-${Math.random()}`, type, text },
    ])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  useEffect(() => {
    if (isSimulationMode) return

    let active = true
    fetchAdminCustomers(filters).then((result) => {
      if (!active) return
      setLiveItems(result.items)
      setLiveTotal(result.total)
      setLiveTotalPages(result.totalPages)
      setLiveSummary(result.summary)
      setLiveDashboardActiveCount(result.liveDashboardActiveCount)
      setLiveSource(result.source)
      setLiveErrorMessage(result.errorMessage ?? null)
      setIsLoadingLive(false)
    })

    return () => {
      active = false
    }
  }, [filters, isSimulationMode, reloadTick])

  const simulationResult = useMemo(() => {
    if (!isSimulationMode) return null
    return querySimulationCustomers(
      simulationStore,
      filters,
      liveDashboardActiveCount,
    )
  }, [isSimulationMode, simulationStore, filters, liveDashboardActiveCount])

  const items = isSimulationMode ? (simulationResult?.items ?? []) : liveItems
  const total = isSimulationMode ? (simulationResult?.total ?? 0) : liveTotal
  const totalPages = isSimulationMode
    ? (simulationResult?.totalPages ?? 1)
    : liveTotalPages
  const summary = isSimulationMode
    ? (simulationResult?.summary ?? null)
    : liveSummary
  const source: CustomerDataSource = isSimulationMode ? 'SIMULATION' : liveSource
  const errorMessage = isSimulationMode ? null : liveErrorMessage
  const isLoading = isSimulationMode ? false : isLoadingLive

  const loadCustomers = useCallback(async () => {
    if (isSimulationMode) return
    setIsLoadingLive(true)
    setLiveErrorMessage(null)
    setReloadTick((prev) => prev + 1)
  }, [isSimulationMode])

  const setSearch = useCallback(
    (search: string) => {
      if (!isSimulationMode) setIsLoadingLive(true)
      setFilters((prev) => ({ ...prev, search, page: 1 }))
    },
    [isSimulationMode],
  )

  const setStatus = useCallback(
    (status: CustomerStatusFilter) => {
      if (!isSimulationMode) setIsLoadingLive(true)
      setFilters((prev) => ({ ...prev, status, page: 1 }))
    },
    [isSimulationMode],
  )

  const setRole = useCallback(
    (role: CustomerRoleFilter) => {
      if (!isSimulationMode) setIsLoadingLive(true)
      setFilters((prev) => ({ ...prev, role, page: 1 }))
    },
    [isSimulationMode],
  )

  const setPage = useCallback(
    (page: number) => {
      if (!isSimulationMode) setIsLoadingLive(true)
      setFilters((prev) => ({ ...prev, page }))
    },
    [isSimulationMode],
  )

  const handleSort = useCallback(
    (field: CustomerSortField) => {
      if (!isSimulationMode) setIsLoadingLive(true)
      setFilters((prev) => {
        const nextOrder =
          prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
        return { ...prev, sortBy: field, sortOrder: nextOrder, page: 1 }
      })
    },
    [isSimulationMode],
  )

  const resetFilters = useCallback(() => {
    if (!isSimulationMode) setIsLoadingLive(true)
    setFilters(DEFAULT_FILTERS)
  }, [isSimulationMode])

  const enableSimulationPreview = useCallback(() => {
    setIsSimulationMode(true)
    setFilters(DEFAULT_FILTERS)
    pushToast(
      'warning',
      'Mode DATA SIMULASI diaktifkan. Data yang tampil bukan data produksi backend.',
    )
  }, [pushToast])

  const exitSimulationPreview = useCallback(() => {
    setIsSimulationMode(false)
    setSelectedCustomer(null)
    setIsLoadingLive(true)
    setFilters(DEFAULT_FILTERS)
    setReloadTick((prev) => prev + 1)
  }, [])

  const openCustomerDetail = useCallback(
    async (customer: CustomerRecord) => {
      setSelectedCustomer(customer)
      if (source !== 'LIVE') return

      setIsLoadingDetail(true)
      try {
        const fresh = await fetchCustomerDetail(customer.id)
        if (fresh) {
          setSelectedCustomer(fresh)
        }
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Gagal memuat detail lengkap pelanggan dari backend.'
        pushToast('error', msg)
      } finally {
        setIsLoadingDetail(false)
      }
    },
    [source, pushToast],
  )

  const closeCustomerDetail = useCallback(() => {
    setSelectedCustomer(null)
  }, [])

  const toggleCustomerStatus = useCallback(
    async (customer: CustomerRecord) => {
      const nextStatus = !customer.isActive
      setIsMutating(true)

      try {
        if (source === 'LIVE') {
          const updated = await updateCustomerAccountStatus(customer.id, nextStatus)
          setLiveItems((prev) =>
            prev.map((row) => (row.id === updated.id ? updated : row)),
          )
          if (selectedCustomer?.id === updated.id) {
            setSelectedCustomer(updated)
          }
          pushToast(
            'success',
            `Status akun ${updated.fullName} berhasil diubah menjadi ${
              updated.isActive ? 'Aktif' : 'Nonaktif'
            }.`,
          )
          setIsLoadingLive(true)
          setReloadTick((prev) => prev + 1)
        } else if (source === 'SIMULATION') {
          const updatedAt = new Date().toISOString()
          setSimulationStore((prev) =>
            prev.map((row) =>
              row.id === customer.id
                ? { ...row, isActive: nextStatus, updatedAt }
                : row,
            ),
          )
          if (selectedCustomer?.id === customer.id) {
            setSelectedCustomer((prev) =>
              prev ? { ...prev, isActive: nextStatus, updatedAt } : null,
            )
          }
          pushToast(
            'info',
            `DATA SIMULASI: Status akun ${customer.fullName} diubah lokal menjadi ${
              nextStatus ? 'Aktif' : 'Nonaktif'
            } (belum tersimpan ke backend).`,
          )
        }
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Gagal mengubah status akun pelanggan.'
        pushToast('error', msg)
      } finally {
        setIsMutating(false)
      }
    },
    [source, selectedCustomer, pushToast],
  )

  return {
    filters,
    items,
    total,
    totalPages,
    summary,
    liveDashboardActiveCount,
    source,
    errorMessage,
    isLoading,
    isSimulationMode,
    selectedCustomer,
    isLoadingDetail,
    isMutating,
    toasts,
    setSearch,
    setStatus,
    setRole,
    setPage,
    handleSort,
    resetFilters,
    loadCustomers,
    enableSimulationPreview,
    exitSimulationPreview,
    openCustomerDetail,
    closeCustomerDetail,
    toggleCustomerStatus,
    dismissToast,
  }
}
