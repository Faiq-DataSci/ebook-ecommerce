import { useState } from 'react';
import {
  CheckCircle2,
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import type {
  CatalogFilterState,
  Category,
  PricePreset,
} from '../../../types/book.types';
import { CatalogQualityGuaranteeCard } from './filters/CatalogQualityGuaranteeCard';
import { CategoryFilterGroup } from './filters/CategoryFilterGroup';
import { PriceFilterGroup } from './filters/PriceFilterGroup';
import { RatingFilterGroup } from './filters/RatingFilterGroup';

interface CatalogFiltersProps {
  categories: Category[];
  categoryCounts: Record<string, number>;
  totalBooksCount: number;
  filteredCount: number;
  filters: CatalogFilterState;
  onChangeFilter: <K extends keyof CatalogFilterState>(
    key: K,
    value: CatalogFilterState[K],
  ) => void;
  onSetPricePreset: (preset: PricePreset) => void;
  onReset: () => void;
  onApplyFeedback?: () => void;
}

export function CatalogFilters({
  categories,
  categoryCounts,
  totalBooksCount,
  filteredCount,
  filters,
  onChangeFilter,
  onSetPricePreset,
  onReset,
  onApplyFeedback,
}: CatalogFiltersProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    (filters.categoryId ? 1 : 0) +
    (filters.minPrice ||
    filters.maxPrice ||
    (filters.pricePreset && filters.pricePreset !== 'all')
      ? 1
      : 0) +
    (filters.minRating && filters.minRating > 0 ? 1 : 0);

  const isPriceInvalid =
    Boolean(filters.minPrice && filters.maxPrice) &&
    Number(filters.minPrice) > Number(filters.maxPrice);

  const filterContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid var(--nb-black)',
          paddingBottom: '0.875rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              backgroundColor: 'var(--nb-yellow)',
              border: '2px solid var(--nb-black)',
              boxShadow: '2px 2px 0 0 var(--nb-black)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Filter size={18} strokeWidth={2.5} color="var(--nb-black)" />
          </div>
          <div>
            <h2
              className="nb-h3"
              style={{
                textTransform: 'uppercase',
                margin: 0,
                fontSize: '1.0625rem',
                letterSpacing: '-0.01em',
              }}
            >
              Filter &amp; Cari
            </h2>
            {activeFilterCount > 0 && (
              <span
                className="nb-mono"
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: 'var(--nb-text-muted)',
                }}
              >
                {activeFilterCount} kriteria aktif
              </span>
            )}
          </div>
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="nb-mono"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--nb-pink)',
              textDecoration: 'underline',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '2px 4px',
            }}
          >
            Reset Semua
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label
          htmlFor="nb-sidebar-search"
          className="nb-label"
          style={{
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.04em',
            color: 'var(--nb-black)',
          }}
        >
          Kata Kunci
        </label>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            id="nb-sidebar-search"
            type="text"
            value={filters.search}
            onChange={(e) => onChangeFilter('search', e.target.value)}
            placeholder="Cari judul, penulis, ISBN..."
            style={{
              width: '100%',
              height: '42px',
              paddingLeft: '12px',
              paddingRight: '36px',
              backgroundColor: 'var(--nb-paper)',
              border: '2px solid var(--nb-black)',
              boxShadow: '3px 3px 0 0 var(--nb-black)',
              fontSize: '0.8125rem',
              color: 'var(--nb-black)',
              outline: 'none',
            }}
          />
          {filters.search ? (
            <button
              type="button"
              onClick={() => onChangeFilter('search', '')}
              aria-label="Hapus kata kunci pencarian"
              style={{
                position: 'absolute',
                right: '8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                color: 'var(--nb-black)',
              }}
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          ) : (
            <span
              style={{
                position: 'absolute',
                right: '10px',
                pointerEvents: 'none',
                color: 'var(--nb-black)',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <Search size={18} strokeWidth={2.25} />
            </span>
          )}
        </div>
      </div>

      <CategoryFilterGroup
        categories={categories}
        categoryCounts={categoryCounts}
        totalBooksCount={totalBooksCount}
        selectedCategoryId={filters.categoryId}
        onSelectCategory={(categoryId) => onChangeFilter('categoryId', categoryId)}
      />

      <PriceFilterGroup
        pricePreset={filters.pricePreset}
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        isPriceInvalid={isPriceInvalid}
        onSetPricePreset={onSetPricePreset}
        onChangeMinPrice={(val) => onChangeFilter('minPrice', val)}
        onChangeMaxPrice={(val) => onChangeFilter('maxPrice', val)}
      />

      <RatingFilterGroup
        minRating={filters.minRating}
        totalBooksCount={totalBooksCount}
        onSelectMinRating={(rating) => onChangeFilter('minRating', rating)}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          borderTop: '2px solid var(--nb-black)',
          paddingTop: '1rem',
        }}
      >
        <button
          type="button"
          onClick={() => {
            onApplyFeedback?.();
            setMobileDrawerOpen(false);
          }}
          className="nb-pressable"
          style={{
            width: '100%',
            height: '46px',
            backgroundColor: 'var(--nb-yellow)',
            color: 'var(--nb-black)',
            border: '3px solid var(--nb-black)',
            boxShadow: '4px 4px 0 0 var(--nb-black)',
            fontFamily: 'var(--nb-font-heading)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <CheckCircle2 size={18} strokeWidth={2.5} />
          Terapkan Filter ({filteredCount})
        </button>

        <button
          type="button"
          onClick={() => {
            onReset();
            setMobileDrawerOpen(false);
          }}
          className="nb-pressable"
          style={{
            width: '100%',
            height: '38px',
            backgroundColor: 'var(--nb-white)',
            color: 'var(--nb-black)',
            border: '2px solid var(--nb-black)',
            boxShadow: '3px 3px 0 0 var(--nb-black)',
            fontFamily: 'var(--nb-font-heading)',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={15} strokeWidth={2.25} />
          Reset Semua Filter
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="nb-filter-mobile-toggle">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            backgroundColor: 'var(--nb-white)',
            border: '3px solid var(--nb-black)',
            boxShadow: '4px 4px 0 0 var(--nb-black)',
            padding: '10px 14px',
          }}
        >
          <button
            type="button"
            onClick={() => setMobileDrawerOpen((prev) => !prev)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent',
              border: 'none',
              fontFamily: 'var(--nb-font-heading)',
              fontWeight: 700,
              fontSize: '0.9375rem',
              color: 'var(--nb-black)',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <SlidersHorizontal size={18} strokeWidth={2.5} />
            <span>
              {mobileDrawerOpen ? 'Tutup Panel Filter' : 'Buka Filter & Cari'}
            </span>
            {activeFilterCount > 0 && (
              <span
                className="nb-mono"
                style={{
                  backgroundColor: 'var(--nb-yellow)',
                  border: '1px solid var(--nb-black)',
                  padding: '1px 6px',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                }}
              >
                {activeFilterCount} Aktif
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="nb-mono"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--nb-pink)',
                textDecoration: 'underline',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
          )}
        </div>

        {mobileDrawerOpen && (
          <div
            className="nb-catalog-sidebar"
            style={{
              marginTop: '10px',
              border: '3px solid var(--nb-black)',
              boxShadow: '4px 4px 0 0 var(--nb-black)',
            }}
          >
            {filterContent}
          </div>
        )}
      </div>

      <aside className="nb-filter-sidebar-desktop">
        <div
          className="nb-catalog-sidebar"
          style={{
            border: '3px solid var(--nb-black)',
            boxShadow: '5px 5px 0 0 var(--nb-black)',
            padding: '1.25rem',
            backgroundColor: 'var(--nb-white)',
          }}
        >
          {filterContent}
        </div>

        <CatalogQualityGuaranteeCard />
      </aside>
    </>
  );
}
