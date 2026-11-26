import { FilterChipGroup, SearchInput } from '../../../shared/components/ui'
import type { CategoryListItem } from '../../categories/types/category'
import type { EbookStatus, EbookTableFilters } from '../types/catalog'
import { getCategoryMeta } from '../utils/catalog.utils'

interface EbookToolbarProps {
  filters: EbookTableFilters
  categories: CategoryListItem[]
  totalCount: number
  activeCount: number
  archiveCount: number
  categoryCounts: Record<string, number>
  selectedCategoryObj: CategoryListItem | null | undefined
  displayMode: 'TABLE' | 'GRID'
  setDisplayMode: (mode: 'TABLE' | 'GRID') => void
  setFilters: React.Dispatch<React.SetStateAction<EbookTableFilters>>
  onRefresh: () => void
}

export function EbookToolbar({
  filters,
  categories,
  totalCount,
  activeCount,
  archiveCount,
  categoryCounts,
  selectedCategoryObj,
  displayMode,
  setDisplayMode,
  setFilters,
  onRefresh,
}: EbookToolbarProps) {
  return (
    <>
      {/* Filter Bar (Pencarian & Status) */}
      <div className="catalog-filter-bar">
        <div className="catalog-filter-left">
          <SearchInput
            value={filters.search}
            onChange={(search) =>
              setFilters((prev) => ({ ...prev, search, page: 1 }))
            }
            onClear={() =>
              setFilters((prev) => ({ ...prev, search: '', page: 1 }))
            }
            placeholder="Cari judul atau penulis..."
            ariaLabel="Cari e-book"
          />

          <FilterChipGroup
            label="Status:"
            value={filters.status}
            onChange={(val) =>
              setFilters((prev) => ({
                ...prev,
                status: val as 'ALL' | EbookStatus,
                page: 1,
              }))
            }
            options={[
              {
                value: 'ALL',
                label: 'Semua Status',
                count: totalCount,
                activeBg: 'var(--nb-yellow)',
              },
              {
                value: 'AKTIF',
                label: 'Aktif',
                count: activeCount,
                activeBg: 'var(--nb-green)',
              },
              {
                value: 'ARSIP',
                label: 'Arsip',
                count: archiveCount,
                activeBg: 'var(--nb-muted)',
              },
            ]}
          />
        </div>

        <div className="catalog-filter-right">
          <div
            className="catalog-view-toggle"
            role="group"
            aria-label="Pilihan tampilan katalog"
          >
            <button
              type="button"
              className={`catalog-view-btn ${
                displayMode === 'TABLE' ? 'is-active' : ''
              }`}
              onClick={() => setDisplayMode('TABLE')}
              title="Tampilan Tabel Detail"
            >
              <span>Tabel</span>
            </button>
            <button
              type="button"
              className={`catalog-view-btn ${
                displayMode === 'GRID' ? 'is-active' : ''
              }`}
              onClick={() => setDisplayMode('GRID')}
              title="Tampilan Grid Kartu"
            >
              <span>Kartu</span>
            </button>
          </div>

          <button
            type="button"
            className="nb-btn nb-page-btn"
            style={{ width: 'auto', padding: '0 14px', fontSize: 13 }}
            onClick={onRefresh}
            title="Segarkan data koleksi"
          >
            Segarkan
          </button>
        </div>
      </div>

      {/* Interactive Category Filter Shelf */}
      <div className="catalog-category-shelf">
        <FilterChipGroup
          label="Kategori:"
          value={filters.categoryId}
          onChange={(categoryId) =>
            setFilters((prev) => ({ ...prev, categoryId, page: 1 }))
          }
          options={[
            {
              value: '',
              label: 'Semua Kategori',
              count: totalCount,
              activeBg: 'var(--nb-yellow)',
            },
            ...categories.map((c) => {
              const meta = getCategoryMeta(c.slug)
              return {
                value: c.id,
                label: c.name.replace('DATA SIMULASI — ', ''),
                count: categoryCounts[c.id] || c.ebookCount || 0,
                activeBg: meta.activeBg,
              }
            }),
          ]}
        />
      </div>

      {/* Active Filter Strip */}
      {(filters.search || filters.categoryId || filters.status !== 'ALL') && (
        <div className="nb-active-filter-strip">
          <div className="nb-active-tags">
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
              Filter Aktif:
            </span>

            {filters.search && (
              <span className="nb-active-tag-badge">
                <span>Cari: &ldquo;{filters.search}&rdquo;</span>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onClick={() => setFilters((prev) => ({ ...prev, search: '', page: 1 }))}
                  aria-label="Hapus filter pencarian"
                >
                  ×
                </button>
              </span>
            )}

            {selectedCategoryObj && (
              <span className="nb-active-tag-badge">
                <span>
                  Kategori: {selectedCategoryObj.name.replace('DATA SIMULASI — ', '')}
                </span>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onClick={() => setFilters((prev) => ({ ...prev, categoryId: '', page: 1 }))}
                  aria-label="Hapus filter kategori"
                >
                  ×
                </button>
              </span>
            )}

            {filters.status !== 'ALL' && (
              <span className="nb-active-tag-badge">
                <span>Status: {filters.status === 'AKTIF' ? 'Aktif' : 'Arsip'}</span>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onClick={() => setFilters((prev) => ({ ...prev, status: 'ALL', page: 1 }))}
                  aria-label="Hapus filter status"
                >
                  ×
                </button>
              </span>
            )}

            <span style={{ color: 'var(--nb-text-muted)', fontSize: 12 }}>
              (Ditemukan {totalCount} e-book)
            </span>
          </div>

          <button
            type="button"
            className="nb-btn nb-reset-filters-btn"
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                search: '',
                categoryId: '',
                status: 'ALL',
                page: 1,
              }))
            }
          >
            <span>Reset Filter</span>
          </button>
        </div>
      )}
    </>
  )
}
