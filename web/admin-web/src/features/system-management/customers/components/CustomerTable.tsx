import {
  EmptyState,
  Pagination,
  StatusBadge,
  TableSkeleton,
} from '../../../../shared/components/ui'
import { formatRupiah } from '../../../../shared/utils/formatters'
import type {
  CustomerRecord,
  CustomerSortField,
  CustomerTableFilters,
} from '../types/customer.types'
import { formatIndonesianDate } from '../utils/customer.utils'

interface CustomerTableProps {
  customers: CustomerRecord[]
  filters: CustomerTableFilters
  totalItems: number
  totalPages: number
  isLoading: boolean
  isMutating: boolean
  hasActiveFilters: boolean
  onSort: (field: CustomerSortField) => void
  onPageChange: (page: number) => void
  onResetFilters: () => void
  onViewDetail: (customer: CustomerRecord) => void
  onRequestToggleStatus: (customer: CustomerRecord) => void
}

function getAriaSort(
  currentField: CustomerSortField,
  columnField: CustomerSortField,
  order: 'asc' | 'desc',
): 'ascending' | 'descending' | 'none' {
  if (currentField !== columnField) return 'none'
  return order === 'asc' ? 'ascending' : 'descending'
}

function getSortSymbol(
  currentField: CustomerSortField,
  columnField: CustomerSortField,
  order: 'asc' | 'desc',
): string {
  if (currentField !== columnField) return 'Urut'
  return order === 'asc' ? 'Naik' : 'Turun'
}

export function CustomerTable({
  customers,
  filters,
  totalItems,
  totalPages,
  isLoading,
  isMutating,
  hasActiveFilters,
  onSort,
  onPageChange,
  onResetFilters,
  onViewDetail,
  onRequestToggleStatus,
}: CustomerTableProps) {
  if (isLoading) {
    return <TableSkeleton rows={5} cols={6} />
  }

  if (customers.length === 0) {
    return (
      <EmptyState
        title={
          hasActiveFilters
            ? 'Tidak ada akun yang cocok dengan filter'
            : 'Belum ada data pelanggan terdaftar'
        }
        description={
          hasActiveFilters
            ? 'Ubah kata kunci pencarian atau reset filter status dan peran untuk melihat akun lainnya.'
            : 'Akun pelanggan akan tampil di tabel ini setelah pengguna mendaftar dan tersinkronisasi ke database.'
        }
        actionLabel={hasActiveFilters ? 'Reset Filter' : undefined}
        onAction={hasActiveFilters ? onResetFilters : undefined}
      />
    )
  }

  return (
    <section className="sys-table-card" aria-label="Daftar Pelanggan dan User">
      {/* Desktop & Tablet Table View */}
      <div className="sys-table-scroll">
        <table className="sys-table">
          <caption>Daftar akun pelanggan dan user terdaftar pada sistem</caption>
          <thead>
            <tr>
              <th
                scope="col"
                aria-sort={getAriaSort(filters.sortBy, 'fullName', filters.sortOrder)}
              >
                <button
                  type="button"
                  className="sys-sort-btn"
                  onClick={() => onSort('fullName')}
                >
                  <span>Nama Pelanggan</span>
                  <span className="sys-sort-indicator">
                    {getSortSymbol(filters.sortBy, 'fullName', filters.sortOrder)}
                  </span>
                </button>
              </th>
              <th scope="col">Email &amp; Peran</th>
              <th
                scope="col"
                aria-sort={getAriaSort(filters.sortBy, 'createdAt', filters.sortOrder)}
              >
                <button
                  type="button"
                  className="sys-sort-btn"
                  onClick={() => onSort('createdAt')}
                >
                  <span>Tanggal Bergabung</span>
                  <span className="sys-sort-indicator">
                    {getSortSymbol(filters.sortBy, 'createdAt', filters.sortOrder)}
                  </span>
                </button>
              </th>
              <th
                scope="col"
                aria-sort={getAriaSort(filters.sortBy, 'isActive', filters.sortOrder)}
              >
                <button
                  type="button"
                  className="sys-sort-btn"
                  onClick={() => onSort('isActive')}
                >
                  <span>Status Akun</span>
                  <span className="sys-sort-indicator">
                    {getSortSymbol(filters.sortBy, 'isActive', filters.sortOrder)}
                  </span>
                </button>
              </th>
              <th
                scope="col"
                className="is-numeric"
                aria-sort={getAriaSort(filters.sortBy, 'totalSpent', filters.sortOrder)}
              >
                <button
                  type="button"
                  className="sys-sort-btn"
                  onClick={() => onSort('totalSpent')}
                >
                  <span>Aktivitas Transaksi</span>
                  <span className="sys-sort-indicator">
                    {getSortSymbol(filters.sortBy, 'totalSpent', filters.sortOrder)}
                  </span>
                </button>
              </th>
              <th scope="col" className="is-numeric">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <div className="sys-customer-name">{customer.fullName}</div>
                  <div className="sys-customer-sub">
                    {customer.phone ? customer.phone : 'Nomor telepon belum diisi'}
                  </div>
                </td>
                <td>
                  <div>{customer.email}</div>
                  <div className="sys-customer-sub">
                    <span
                      className={`sys-tag ${
                        customer.role === 'ADMIN' ? 'is-info' : 'is-muted'
                      }`}
                    >
                      {customer.role}
                    </span>
                  </div>
                </td>
                <td className="sys-mono-cell">
                  {formatIndonesianDate(customer.createdAt)}
                </td>
                <td>
                  {customer.isActive ? (
                    <StatusBadge status="Aktif" fill="var(--nb-green)" />
                  ) : (
                    <StatusBadge status="Nonaktif" fill="var(--nb-muted)" />
                  )}
                </td>
                <td className="is-numeric">
                  <div>{formatRupiah(customer.totalSpent)}</div>
                  <div className="sys-customer-sub">
                    {customer.ordersCount} pesanan · {customer.activeAccessCount} akses e-book
                  </div>
                </td>
                <td>
                  <div className="sys-row-actions">
                    <button
                      type="button"
                      className="sys-btn sys-btn-sm nb-btn"
                      onClick={() => onViewDetail(customer)}
                    >
                      Detail
                    </button>
                    <button
                      type="button"
                      className={`sys-btn sys-btn-sm nb-btn ${
                        customer.isActive ? 'sys-btn-danger' : 'sys-btn-success'
                      }`}
                      disabled={isMutating}
                      onClick={() => onRequestToggleStatus(customer)}
                    >
                      {customer.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card Layout (< 768px) */}
      <div className="sys-mobile-cards" aria-label="Daftar Pelanggan (Tampilan Kartu)">
        {customers.map((customer) => (
          <article key={customer.id} className="sys-mobile-card">
            <div className="sys-mobile-card-head">
              <div>
                <div className="sys-customer-name">{customer.fullName}</div>
                <div className="sys-customer-sub">{customer.email}</div>
              </div>
              {customer.isActive ? (
                <StatusBadge status="Aktif" fill="var(--nb-green)" />
              ) : (
                <StatusBadge status="Nonaktif" fill="var(--nb-muted)" />
              )}
            </div>

            <div className="sys-mobile-kv">
              <div className="sys-mobile-kv-item">
                <span className="sys-mobile-kv-label">Peran</span>
                <span className="sys-mobile-kv-val">{customer.role}</span>
              </div>
              <div className="sys-mobile-kv-item">
                <span className="sys-mobile-kv-label">Bergabung</span>
                <span className="sys-mobile-kv-val font-mono-nb">
                  {formatIndonesianDate(customer.createdAt)}
                </span>
              </div>
              <div className="sys-mobile-kv-item">
                <span className="sys-mobile-kv-label">Total Belanja</span>
                <span className="sys-mobile-kv-val font-mono-nb">
                  {formatRupiah(customer.totalSpent)}
                </span>
              </div>
              <div className="sys-mobile-kv-item">
                <span className="sys-mobile-kv-label">Pesanan &amp; Akses</span>
                <span className="sys-mobile-kv-val">
                  {customer.ordersCount} pesanan · {customer.activeAccessCount} akses
                </span>
              </div>
            </div>

            <div className="sys-mobile-card-actions">
              <button
                type="button"
                className="sys-btn sys-btn-sm nb-btn"
                onClick={() => onViewDetail(customer)}
              >
                Lihat Detail
              </button>
              <button
                type="button"
                className={`sys-btn sys-btn-sm nb-btn ${
                  customer.isActive ? 'sys-btn-danger' : 'sys-btn-success'
                }`}
                disabled={isMutating}
                onClick={() => onRequestToggleStatus(customer)}
              >
                {customer.isActive ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
              </button>
            </div>
          </article>
        ))}
      </div>

      <Pagination
        currentPage={filters.page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={filters.limit}
        onPageChange={onPageChange}
        labelItemName="akun"
      />
    </section>
  )
}
