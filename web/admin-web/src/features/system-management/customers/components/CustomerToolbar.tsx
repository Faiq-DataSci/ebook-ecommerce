import { FilterSelect, SearchInput } from '../../../../shared/components/ui'
import type {
  CustomerRoleFilter,
  CustomerStatusFilter,
  CustomerTableFilters,
} from '../types/customer.types'

interface CustomerToolbarProps {
  filters: CustomerTableFilters
  totalMatched: number
  isDisabled: boolean
  onSearchChange: (value: string) => void
  onStatusChange: (value: CustomerStatusFilter) => void
  onRoleChange: (value: CustomerRoleFilter) => void
  onResetFilters: () => void
  onRefresh: () => void
}

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Semua Status' },
  { value: 'ACTIVE', label: 'Aktif' },
  { value: 'INACTIVE', label: 'Nonaktif' },
]

const ROLE_OPTIONS = [
  { value: 'ALL', label: 'Semua Peran' },
  { value: 'CUSTOMER', label: 'Pelanggan (CUSTOMER)' },
  { value: 'ADMIN', label: 'Admin (ADMIN)' },
]

export function CustomerToolbar({
  filters,
  totalMatched,
  isDisabled,
  onSearchChange,
  onStatusChange,
  onRoleChange,
  onResetFilters,
  onRefresh,
}: CustomerToolbarProps) {
  const hasActiveFilter =
    Boolean(filters.search.trim()) ||
    filters.status !== 'ALL' ||
    filters.role !== 'ALL'

  return (
    <section className="sys-toolbar" aria-label="Pencarian dan filter pelanggan">
      <div className="sys-toolbar-row">
        <div className="sys-toolbar-search">
          <SearchInput
            value={filters.search}
            onChange={onSearchChange}
            onClear={() => onSearchChange('')}
            placeholder="Cari nama lengkap atau alamat email..."
            ariaLabel="Cari pelanggan berdasarkan nama atau email"
          />
        </div>

        <div className="sys-toolbar-filters">
          <FilterSelect
            id="customer-status-filter"
            label="Status Akun"
            value={filters.status}
            options={STATUS_OPTIONS}
            onChange={(val) => onStatusChange(val as CustomerStatusFilter)}
          />

          <FilterSelect
            id="customer-role-filter"
            label="Peran"
            value={filters.role}
            options={ROLE_OPTIONS}
            onChange={(val) => onRoleChange(val as CustomerRoleFilter)}
          />

          <button
            type="button"
            className="sys-btn nb-btn"
            disabled={isDisabled}
            onClick={onRefresh}
          >
            Muat Ulang
          </button>
        </div>
      </div>

      <div className="sys-toolbar-meta">
        <span>
          Ditemukan <strong className="font-mono-nb">{totalMatched}</strong> akun
          pengguna sesuai kriteria saat ini.
        </span>

        {hasActiveFilter && (
          <button
            type="button"
            className="sys-btn sys-btn-sm nb-btn"
            onClick={onResetFilters}
          >
            Reset Filter
          </button>
        )}
      </div>
    </section>
  )
}
