import { LayoutGrid, List, X } from 'lucide-react';
import type {
  CatalogFilterState,
  CatalogSortOption,
  CatalogViewMode,
  Category,
} from '../../../types/book.types';
import { formatCurrency } from '../../../utils/formatCurrency';

interface CatalogControlBarProps {
  filteredCount: number;
  totalCount: number;
  categories: Category[];
  filters: CatalogFilterState;
  viewMode: CatalogViewMode;
  onViewModeChange: (mode: CatalogViewMode) => void;
  onSortChange: (sortBy: CatalogSortOption) => void;
  onClearSearch: () => void;
  onClearCategory: () => void;
  onClearPrice: () => void;
  onClearRating: () => void;
  onClearAuthor: () => void;
  onResetAll: () => void;
}

export function CatalogControlBar({
  filteredCount,
  totalCount,
  categories,
  filters,
  viewMode,
  onViewModeChange,
  onSortChange,
  onClearSearch,
  onClearCategory,
  onClearPrice,
  onClearRating,
  onClearAuthor,
  onResetAll,
}: CatalogControlBarProps) {
  const activeCategory = categories.find((c) => c.id === filters.categoryId);

  const hasAnyActiveFilter = Boolean(
    filters.search ||
      filters.categoryId ||
      filters.author ||
      filters.minPrice ||
      filters.maxPrice ||
      (filters.pricePreset && filters.pricePreset !== 'all') ||
      (filters.minRating && filters.minRating > 0),
  );

  let priceLabel = '';
  if (filters.pricePreset === 'under50') {
    priceLabel = '< Rp 50.000';
  } else if (filters.pricePreset === '50to100') {
    priceLabel = 'Rp 50rb - 100rb';
  } else if (filters.pricePreset === 'above100') {
    priceLabel = '> Rp 100.000';
  } else if (filters.minPrice || filters.maxPrice) {
    const minStr = filters.minPrice ? formatCurrency(Number(filters.minPrice)) : 'Rp 0';
    const maxStr = filters.maxPrice ? formatCurrency(Number(filters.maxPrice)) : 'Tak Terbatas';
    priceLabel = `Harga: ${minStr} - ${maxStr}`;
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--nb-white)',
        border: '3px solid var(--nb-black)',
        boxShadow: '5px 5px 0 0 var(--nb-black)',
        padding: 'var(--nb-space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--nb-space-3)',
      }}
    >
      {/* Top Row: Counter & View Switcher */}
      <div
        className="nb-control-bar-header"
        style={{
          borderBottom: hasAnyActiveFilter
            ? '2px solid var(--nb-black)'
            : 'none',
          paddingBottom: hasAnyActiveFilter ? 'var(--nb-space-3)' : '0',
        }}
      >
        <div>
          <div
            className="nb-mono"
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--nb-black)',
            }}
          >
            {filteredCount} dari {totalCount} E-Book ditemukan
          </div>
          <p
            className="nb-body-sm"
            style={{
              fontSize: '0.8125rem',
              color: 'var(--nb-text-muted)',
              marginTop: '2px',
            }}
          >
            {hasAnyActiveFilter
              ? 'Menampilkan parameter filter aktif untuk kriteria terpilih'
              : 'Menampilkan seluruh koleksi e-book terdaftar dalam sistem katalog'}
          </p>
        </div>

        {/* Sort & View Mode Switcher */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          {/* Sort Selector */}
          <div style={{ position: 'relative' }}>
            <select
              id="sort-select"
              value={filters.sortBy}
              onChange={(e) => onSortChange(e.target.value as CatalogSortOption)}
              aria-label="Urutkan katalog"
              style={{
                height: '40px',
                paddingInline: '12px',
                backgroundColor: 'var(--nb-paper)',
                border: '2px solid var(--nb-black)',
                boxShadow: '3px 3px 0 0 var(--nb-black)',
                fontFamily: 'var(--nb-font-heading)',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--nb-black)',
                cursor: 'pointer',
              }}
            >
              <option value="saw_desc">Urutkan: Rekomendasi Terbaik</option>
              <option value="newest">Terbaru & Rilis Terkini</option>
              <option value="price_asc">Harga: Terendah ke Tertinggi</option>
              <option value="price_desc">Harga: Tertinggi ke Terendah</option>
              <option value="rating_desc">Rating Pembaca Tertinggi</option>
              <option value="alphabetical">Judul: A ke Z</option>
            </select>
          </div>

          {/* Grid / List Switcher */}
          <div
            style={{
              display: 'flex',
              border: '2px solid var(--nb-black)',
              boxShadow: '3px 3px 0 0 var(--nb-black)',
              backgroundColor: '#f5f4ec',
            }}
          >
            <button
              id="view-grid-btn"
              type="button"
              onClick={() => onViewModeChange('grid')}
              title="Tampilan Grid"
              aria-label="Tampilan Grid"
              aria-pressed={viewMode === 'grid'}
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:
                  viewMode === 'grid' ? 'var(--nb-yellow)' : 'var(--nb-white)',
                color: 'var(--nb-black)',
                border: 'none',
                borderRight: '2px solid var(--nb-black)',
                cursor: 'pointer',
              }}
            >
              <LayoutGrid size={18} strokeWidth={viewMode === 'grid' ? 2.5 : 2} />
            </button>
            <button
              id="view-list-btn"
              type="button"
              onClick={() => onViewModeChange('list')}
              title="Tampilan List"
              aria-label="Tampilan List"
              aria-pressed={viewMode === 'list'}
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:
                  viewMode === 'list' ? 'var(--nb-yellow)' : 'var(--nb-white)',
                color: 'var(--nb-black)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <List size={18} strokeWidth={viewMode === 'list' ? 2.5 : 2} />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {hasAnyActiveFilter && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '8px',
            paddingTop: '2px',
          }}
        >
          <span
            className="nb-mono"
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--nb-text-muted)',
              marginRight: '2px',
            }}
          >
            Filter Aktif:
          </span>

          {/* Category Chip */}
          {activeCategory && (
            <span className="nb-filter-chip nb-filter-chip--active">
              <span>{activeCategory.name}</span>
              <button
                type="button"
                onClick={onClearCategory}
                className="nb-filter-chip-remove"
                aria-label={`Hapus filter kategori ${activeCategory.name}`}
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            </span>
          )}

          {/* Price Range Chip */}
          {priceLabel && (
            <span className="nb-filter-chip">
              <span>{priceLabel}</span>
              <button
                type="button"
                onClick={onClearPrice}
                className="nb-filter-chip-remove"
                aria-label="Hapus filter harga"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            </span>
          )}

          {/* Rating Chip */}
          {filters.minRating && filters.minRating > 0 ? (
            <span className="nb-filter-chip">
              <span>Rating ≥ {filters.minRating.toFixed(1)}</span>
              <button
                type="button"
                onClick={onClearRating}
                className="nb-filter-chip-remove"
                aria-label="Hapus filter rating"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            </span>
          ) : null}

          {/* Search Query Chip */}
          {filters.search && (
            <span className="nb-filter-chip nb-filter-chip--active">
              <span>Cari: &ldquo;{filters.search}&rdquo;</span>
              <button
                type="button"
                onClick={onClearSearch}
                className="nb-filter-chip-remove"
                aria-label="Hapus filter pencarian"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            </span>
          )}

          {/* Author Chip */}
          {filters.author && (
            <span className="nb-filter-chip">
              <span>Penulis: {filters.author}</span>
              <button
                type="button"
                onClick={onClearAuthor}
                className="nb-filter-chip-remove"
                aria-label="Hapus filter penulis"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            </span>
          )}

          {/* Clear All Button */}
          <button
            id="clear-all-chips"
            type="button"
            onClick={onResetAll}
            className="nb-mono"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--nb-pink)',
              textDecoration: 'underline',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              marginLeft: '4px',
              padding: 0,
            }}
          >
            Hapus Semua
          </button>
        </div>
      )}
    </div>
  );
}
