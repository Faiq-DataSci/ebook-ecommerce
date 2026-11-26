import { FilterChipGroup, SearchInput } from '../../../shared/components/ui'
import { CATEGORY_STATUS_OPTIONS } from '../constants/category.constants'
import type { CategoryStatus, CategoryTableFilters } from '../types/category'

interface CategoryToolbarProps {
  filters: CategoryTableFilters
  statusCounts: Record<'ALL' | CategoryStatus, number>
  filteredTotal: number
  onSearchChange: (search: string) => void
  onStatusChange: (status: 'ALL' | CategoryStatus) => void
  onResetFilters: () => void
  onRefresh: () => void
}

export function CategoryToolbar({
  filters,
  statusCounts,
  filteredTotal,
  onSearchChange,
  onStatusChange,
  onResetFilters,
  onRefresh,
}: CategoryToolbarProps) {
  const hasActiveFilters = Boolean(filters.search.trim()) || filters.status !== 'ALL'

  return (
    <section
      className="catalog-toolbar"
      aria-label="Pencarian dan filter kategori"
    >
      <div className="catalog-filter-bar">
        <div className="catalog-filter-left">
          <SearchInput
            value={filters.search}
            onChange={onSearchChange}
            onClear={() => onSearchChange('')}
            placeholder="Cari nama, slug, atau deskripsi..."
            ariaLabel="Cari kategori"
          />

          <FilterChipGroup
            label="Status:"
            icon="tune"
            value={filters.status}
            onChange={(val) => onStatusChange(val as 'ALL' | CategoryStatus)}
            options={CATEGORY_STATUS_OPTIONS.map((option) => ({
              ...option,
              count: statusCounts[option.value],
            }))}
          />
        </div>

        <div className="catalog-filter-right">
          <button
            type="button"
            className="nb-btn catalog-toolbar-icon-btn"
            onClick={onRefresh}
            title="Segarkan data tabel"
            aria-label="Segarkan data kategori"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              refresh
            </span>
          </button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="nb-active-filter-strip">
          <div className="nb-active-tags">
            <span className="nb-active-filter-label">Filter aktif:</span>
            {filters.search.trim() && (
              <span className="nb-active-tag-badge">
                <span>Cari: &ldquo;{filters.search}&rdquo;</span>
                <button
                  type="button"
                  className="nb-active-tag-remove"
                  onClick={() => onSearchChange('')}
                  aria-label="Hapus filter pencarian"
                >
                  ×
                </button>
              </span>
            )}
            {filters.status !== 'ALL' && (
              <span className="nb-active-tag-badge">
                <span>
                  Status: {filters.status === 'AKTIF' ? 'Aktif' : 'Nonaktif'}
                </span>
                <button
                  type="button"
                  className="nb-active-tag-remove"
                  onClick={() => onStatusChange('ALL')}
                  aria-label="Hapus filter status"
                >
                  ×
                </button>
              </span>
            )}
            <span className="nb-active-filter-count">
              (Ditemukan {filteredTotal} kategori)
            </span>
          </div>

          <button
            type="button"
            className="nb-btn nb-reset-filters-btn"
            onClick={onResetFilters}
          >
            <span
              className="material-symbols-outlined nb-reset-filters-icon"
              aria-hidden="true"
            >
              close
            </span>
            <span>Reset Filter</span>
          </button>
        </div>
      )}
    </section>
  )
}
