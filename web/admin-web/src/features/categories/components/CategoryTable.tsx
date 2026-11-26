import {
  EmptyState,
  Pagination,
  StatusBadge,
  TableSkeleton,
} from '../../../shared/components/ui'
import type {
  CategoryListItem,
  CategorySortColumn,
  CategoryTableFilters,
} from '../types/category'

interface CategoryTableProps {
  categories: CategoryListItem[]
  isLoading: boolean
  hasActiveFilters: boolean
  filters: CategoryTableFilters
  currentPage: number
  totalPages: number
  totalItems: number
  onSort: (column: CategorySortColumn) => void
  onPageChange: (page: number) => void
  onEdit: (category: CategoryListItem) => void
  onDelete: (category: CategoryListItem) => void
  onAddFirst: () => void
}

function getAriaSort(
  column: CategorySortColumn,
  sortBy: CategorySortColumn,
  sortOrder: 'asc' | 'desc',
): 'ascending' | 'descending' | 'none' {
  if (sortBy !== column) return 'none'
  return sortOrder === 'asc' ? 'ascending' : 'descending'
}

function getSortIcon(
  column: CategorySortColumn,
  sortBy: CategorySortColumn,
  sortOrder: 'asc' | 'desc',
): string {
  if (sortBy !== column) return 'unfold_more'
  return sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'
}

export function CategoryTable({
  categories,
  isLoading,
  hasActiveFilters,
  filters,
  currentPage,
  totalPages,
  totalItems,
  onSort,
  onPageChange,
  onEdit,
  onDelete,
  onAddFirst,
}: CategoryTableProps) {
  if (isLoading) {
    return <TableSkeleton rows={5} cols={6} />
  }

  if (totalItems === 0) {
    return (
      <EmptyState
        title="Tidak Ada Kategori Ditemukan"
        description={
          hasActiveFilters
            ? 'Tidak ada kategori yang cocok dengan filter pencarian saat ini. Ubah kata kunci atau hapus filter.'
            : 'Belum ada kategori e-book yang tersimpan. Tambahkan kategori baru sekarang.'
        }
        icon="category"
        actionLabel="+ Tambah Kategori Pertama"
        onAction={onAddFirst}
      />
    )
  }

  return (
    <div className="nb-table-container">
      <table className="nb-table">
        <caption className="visually-hidden">Daftar Kategori E-Book</caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="is-sortable"
              aria-sort={getAriaSort('name', filters.sortBy, filters.sortOrder)}
            >
              <button
                type="button"
                className="nb-th-sort-btn"
                onClick={() => onSort('name')}
              >
                <span>Nama Kategori</span>
                <span
                  className="material-symbols-outlined nb-sort-icon"
                  aria-hidden="true"
                >
                  {getSortIcon('name', filters.sortBy, filters.sortOrder)}
                </span>
              </button>
            </th>
            <th
              scope="col"
              className="is-sortable"
              aria-sort={getAriaSort('slug', filters.sortBy, filters.sortOrder)}
            >
              <button
                type="button"
                className="nb-th-sort-btn"
                onClick={() => onSort('slug')}
              >
                <span>Slug</span>
                <span
                  className="material-symbols-outlined nb-sort-icon"
                  aria-hidden="true"
                >
                  {getSortIcon('slug', filters.sortBy, filters.sortOrder)}
                </span>
              </button>
            </th>
            <th scope="col">Deskripsi</th>
            <th
              scope="col"
              className="is-sortable"
              aria-sort={getAriaSort(
                'ebookCount',
                filters.sortBy,
                filters.sortOrder,
              )}
            >
              <button
                type="button"
                className="nb-th-sort-btn"
                onClick={() => onSort('ebookCount')}
              >
                <span>Jumlah E-Book</span>
                <span
                  className="material-symbols-outlined nb-sort-icon"
                  aria-hidden="true"
                >
                  {getSortIcon('ebookCount', filters.sortBy, filters.sortOrder)}
                </span>
              </button>
            </th>
            <th scope="col">Status</th>
            <th scope="col" className="nb-th-actions">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td data-label="Nama Kategori">
                <span className="font-heading nb-td-strong">
                  {category.name}
                </span>
              </td>
              <td data-label="Slug" className="nb-td-mono">
                {category.slug}
              </td>
              <td data-label="Deskripsi">
                {category.description ? (
                  <span className="nb-td-clamp-2">{category.description}</span>
                ) : (
                  <span className="nb-td-muted-italic">—</span>
                )}
              </td>
              <td
                data-label="Jumlah E-Book"
                className="nb-td-mono nb-td-right nb-td-count"
              >
                {category.ebookCount}
              </td>
              <td data-label="Status">
                {category.isActive ? (
                  <StatusBadge
                    status="Aktif"
                    fill="var(--nb-green)"
                    icon="check_circle"
                  />
                ) : (
                  <StatusBadge
                    status="Nonaktif"
                    fill="var(--nb-muted)"
                    icon="do_not_disturb_on"
                  />
                )}
              </td>
              <td data-label="Aksi">
                <div className="nb-action-btn-group">
                  <button
                    type="button"
                    className="nb-btn nb-table-action-btn"
                    onClick={() => onEdit(category)}
                    aria-label={`Ubah kategori ${category.name}`}
                    title="Ubah kategori"
                  >
                    <span
                      className="material-symbols-outlined nb-action-icon"
                      aria-hidden="true"
                    >
                      edit
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nb-btn nb-table-action-btn is-danger"
                    onClick={() => onDelete(category)}
                    aria-label={`Hapus kategori ${category.name}`}
                    title="Hapus kategori"
                  >
                    <span
                      className="material-symbols-outlined nb-action-icon"
                      aria-hidden="true"
                    >
                      delete
                    </span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={filters.limit}
        onPageChange={onPageChange}
        labelItemName="kategori"
      />
    </div>
  )
}
