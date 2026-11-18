import { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import type {
  CatalogFilterState,
  Category,
  PricePreset,
} from '../../../types/book.types';

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
    (filters.minPrice || filters.maxPrice || (filters.pricePreset && filters.pricePreset !== 'all')
      ? 1
      : 0) +
    (filters.minRating && filters.minRating > 0 ? 1 : 0);

  const isPriceInvalid =
    Boolean(filters.minPrice && filters.maxPrice) &&
    Number(filters.minPrice) > Number(filters.maxPrice);

  const filterContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      {/* 1. Header Filter & Cari */}
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
              Filter & Cari
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

      {/* 2. Kata Kunci Search Input */}
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
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
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

      {/* 3. Kategori Spesifik */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          borderTop: '2px solid var(--nb-black)',
          paddingTop: '0.875rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            className="nb-label"
            style={{
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              letterSpacing: '0.04em',
              color: 'var(--nb-black)',
            }}
          >
            Kategori Spesifik
          </span>
          {filters.categoryId && (
            <button
              type="button"
              onClick={() => onChangeFilter('categoryId', '')}
              className="nb-mono"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--nb-text-muted)',
                textDecoration: 'underline',
                fontSize: '0.6875rem',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Semua
            </button>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            maxHeight: '260px',
            overflowY: 'auto',
            paddingRight: '2px',
          }}
        >
          {/* Opsi: Semua Kategori */}
          <button
            type="button"
            role="radio"
            aria-checked={filters.categoryId === ''}
            onClick={() => onChangeFilter('categoryId', '')}
            className={`nb-category-item-row ${filters.categoryId === '' ? 'is-active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid var(--nb-black)',
                  backgroundColor:
                    filters.categoryId === '' ? 'var(--nb-black)' : 'var(--nb-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {filters.categoryId === '' && (
                  <Check size={12} strokeWidth={3} color="var(--nb-yellow)" />
                )}
              </div>
              <span>Semua Kategori</span>
            </div>
            <span
              className="nb-mono"
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                color:
                  filters.categoryId === ''
                    ? 'var(--nb-black)'
                    : 'var(--nb-text-muted)',
              }}
            >
              ({totalBooksCount})
            </span>
          </button>

          {/* Opsi: Daftar Kategori */}
          {categories.map((cat) => {
            const isSelected = filters.categoryId === cat.id;
            const count = categoryCounts[cat.id] ?? cat.bookCount ?? 0;
            return (
              <button
                key={cat.id}
                type="button"
                role="checkbox"
                aria-checked={isSelected}
                onClick={() =>
                  onChangeFilter('categoryId', isSelected ? '' : cat.id)
                }
                className={`nb-category-item-row ${isSelected ? 'is-active' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid var(--nb-black)',
                      backgroundColor: isSelected
                        ? 'var(--nb-black)'
                        : 'var(--nb-white)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {isSelected && (
                      <Check size={12} strokeWidth={3} color="var(--nb-yellow)" />
                    )}
                  </div>
                  <span>{cat.name}</span>
                </div>
                <span
                  className="nb-mono"
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: isSelected ? 700 : 400,
                    color: isSelected
                      ? 'var(--nb-black)'
                      : 'var(--nb-text-muted)',
                  }}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Rentang Harga (IDR) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          borderTop: '2px solid var(--nb-black)',
          paddingTop: '0.875rem',
        }}
      >
        <span
          className="nb-label"
          style={{
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.04em',
            color: 'var(--nb-black)',
          }}
        >
          Rentang Harga (IDR)
        </span>

        {/* Radio Presets Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { id: 'all', label: 'Semua Harga' },
            { id: 'under50', label: '< Rp 50.000' },
            { id: '50to100', label: 'Rp 50.000 - Rp 100.000' },
            { id: 'above100', label: '> Rp 100.000' },
          ].map((preset) => {
            const isChecked =
              preset.id === 'all'
                ? filters.pricePreset === 'all' && !filters.minPrice && !filters.maxPrice
                : filters.pricePreset === preset.id;

            return (
              <label
                key={preset.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  padding: '5px 8px',
                  backgroundColor: isChecked ? 'rgba(255, 210, 63, 0.35)' : 'transparent',
                  border: isChecked ? '1px solid var(--nb-black)' : '1px solid transparent',
                  fontWeight: isChecked ? 700 : 400,
                  userSelect: 'none',
                }}
              >
                <input
                  type="radio"
                  name="catalog-price-preset"
                  checked={isChecked}
                  onChange={() => onSetPricePreset(preset.id as PricePreset)}
                  style={{
                    accentColor: 'var(--nb-black)',
                    cursor: 'pointer',
                    width: '15px',
                    height: '15px',
                  }}
                />
                <span>{preset.label}</span>
              </label>
            );
          })}
        </div>

        {/* Input Min - Max Kustom */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            marginTop: '4px',
          }}
        >
          <div>
            <span
              className="nb-mono"
              style={{
                display: 'block',
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                color: 'var(--nb-text-muted)',
                marginBottom: '2px',
                fontWeight: 700,
              }}
            >
              Min (Rp)
            </span>
            <input
              id="nb-price-min-input"
              type="number"
              min={0}
              step={5000}
              value={filters.minPrice}
              onChange={(e) => onChangeFilter('minPrice', e.target.value)}
              placeholder="0"
              style={{
                width: '100%',
                height: '36px',
                paddingInline: '8px',
                backgroundColor: 'var(--nb-paper)',
                border: '2px solid var(--nb-black)',
                fontFamily: 'var(--nb-font-mono)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--nb-black)',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <span
              className="nb-mono"
              style={{
                display: 'block',
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                color: 'var(--nb-text-muted)',
                marginBottom: '2px',
                fontWeight: 700,
              }}
            >
              Maks (Rp)
            </span>
            <input
              id="nb-price-max-input"
              type="number"
              min={0}
              step={5000}
              value={filters.maxPrice}
              onChange={(e) => onChangeFilter('maxPrice', e.target.value)}
              placeholder="150000"
              style={{
                width: '100%',
                height: '36px',
                paddingInline: '8px',
                backgroundColor: 'var(--nb-paper)',
                border: '2px solid var(--nb-black)',
                fontFamily: 'var(--nb-font-mono)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--nb-black)',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {isPriceInvalid && (
          <p
            className="nb-mono"
            style={{
              fontSize: '0.6875rem',
              color: 'var(--nb-pink)',
              fontWeight: 700,
            }}
          >
            ⚠️ Nilai minimum tidak boleh melebihi maksimum.
          </p>
        )}
      </div>

      {/* 5. Rating Pembaca */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          borderTop: '2px solid var(--nb-black)',
          paddingTop: '0.875rem',
        }}
      >
        <span
          className="nb-label"
          style={{
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.04em',
            color: 'var(--nb-black)',
          }}
        >
          Rating Pembaca
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {[
            {
              rating: 4.0,
              stars: '★★★★☆',
              label: '≥ 4.0',
              count: 280,
            },
            {
              rating: 4.5,
              stars: '★★★★★',
              label: '≥ 4.5',
              count: 140,
            },
            {
              rating: 0,
              stars: '',
              label: 'Semua Nilai Ulasan',
              count: totalBooksCount,
            },
          ].map((rItem) => {
            const isChecked =
              rItem.rating === 0
                ? !filters.minRating || filters.minRating === 0
                : filters.minRating === rItem.rating;

            return (
              <label
                key={rItem.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontSize: '0.8125rem',
                  padding: '5px 8px',
                  backgroundColor: isChecked ? 'rgba(255, 210, 63, 0.35)' : 'transparent',
                  border: isChecked ? '1px solid var(--nb-black)' : '1px solid transparent',
                  fontWeight: isChecked ? 700 : 400,
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="radio"
                    name="rating-filter"
                    checked={isChecked}
                    onChange={() => onChangeFilter('minRating', rItem.rating)}
                    style={{
                      accentColor: 'var(--nb-black)',
                      cursor: 'pointer',
                      width: '15px',
                      height: '15px',
                    }}
                  />
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {rItem.stars && (
                      <span
                        style={{
                          color: 'var(--nb-orange)',
                          fontWeight: 700,
                          marginRight: '5px',
                          fontSize: '0.875rem',
                        }}
                      >
                        {rItem.stars}
                      </span>
                    )}
                    {rItem.label}
                  </span>
                </div>
                <span
                  className="nb-mono"
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: isChecked ? 700 : 400,
                    color: isChecked ? 'var(--nb-black)' : 'var(--nb-text-muted)',
                  }}
                >
                  ({rItem.count})
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 6. Action Buttons */}
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
      {/* Mobile Filter Toggle (Visible only on screens < 980px) */}
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

      {/* Desktop Sticky Sidebar (Visible only on screens >= 980px) */}
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

        {/* Quality Guarantee Card (Visitor-Friendly & Trust-Building) */}
        <div
          style={{
            backgroundColor: '#f5f4ec',
            border: '2px solid var(--nb-black)',
            boxShadow: '4px 4px 0 0 var(--nb-black)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--nb-font-heading)',
              fontWeight: 700,
              fontSize: '0.8125rem',
              textTransform: 'uppercase',
              color: 'var(--nb-black)',
            }}
          >
            <Sparkles size={16} strokeWidth={2.5} color="var(--nb-black)" />
            JAMINAN KURASI OBJEKTIF
          </div>
          <p
            className="nb-body-sm"
            style={{
              fontSize: '0.8125rem',
              lineHeight: 1.45,
              color: 'var(--nb-black)',
              margin: 0,
            }}
          >
            Setiap e-book dinilai secara objektif berdasarkan kepuasan pembaca asli,
            keterjangkauan harga, dan kedalaman materi bebas dari ulasan palsu atau
            promosi berbayar.
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              paddingTop: '2px',
            }}
          >
            <span
              className="nb-mono"
              style={{
                fontSize: '0.625rem',
                fontWeight: 700,
                backgroundColor: 'var(--nb-yellow)',
                border: '1px solid var(--nb-black)',
                boxShadow: '1px 1px 0 0 var(--nb-black)',
                padding: '2px 6px',
              }}
            >
              100% PRODUK ASLI
            </span>
            <span
              className="nb-mono"
              style={{
                fontSize: '0.625rem',
                fontWeight: 700,
                backgroundColor: 'var(--nb-green)',
                border: '1px solid var(--nb-black)',
                boxShadow: '1px 1px 0 0 var(--nb-black)',
                padding: '2px 6px',
              }}
            >
              VERIFIED RATING
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
