import { Filter, RotateCcw, Sparkles } from 'lucide-react';
import type { Category } from '../../../types/book.types';
import type { SawRecommendationFilter } from '../types/recommendation.types';

interface RecommendationFilterBarProps {
  categories: Category[];
  filter: SawRecommendationFilter;
  onFilterChange: (next: SawRecommendationFilter) => void;
  onApplyCalculation: () => void;
  isLoading: boolean;
}

export function RecommendationFilterBar({
  categories,
  filter,
  onFilterChange,
  onApplyCalculation,
  isLoading,
}: RecommendationFilterBarProps) {
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filter,
      categoryId: e.target.value || undefined,
    });
  };

  const handleLimitChange = (limitVal: number) => {
    onFilterChange({
      ...filter,
      limit: limitVal,
    });
  };

  const handleReset = () => {
    onFilterChange({
      categoryId: undefined,
      limit: 5,
    });
  };

  return (
    <div
      className="nb-card"
      style={{
        backgroundColor: 'var(--nb-white)',
        border: '3px solid var(--nb-black)',
        boxShadow: '4px 4px 0 var(--nb-black)',
        padding: '18px 22px',
        marginBottom: '28px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '14px',
          borderBottom: '2px solid var(--nb-black)',
          paddingBottom: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} aria-hidden="true" />
          <h2
            style={{
              fontFamily: 'var(--nb-font-heading)',
              fontSize: '1rem',
              fontWeight: 800,
              margin: 0,
            }}
          >
            Filter Alternatif E-Book
          </h2>
        </div>

        <span
          style={{
            fontFamily: 'var(--nb-font-mono)',
            fontSize: '0.75rem',
            color: 'var(--nb-text-muted)',
            fontWeight: 700,
          }}
        >
          Kriteria dihitung terpusat di Server
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {/* Kategori E-Book */}
        <div style={{ flex: '1 1 240px', minWidth: '200px' }}>
          <label
            htmlFor="filter-saw-category"
            style={{
              display: 'block',
              fontFamily: 'var(--nb-font-heading)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              marginBottom: '6px',
            }}
          >
            Pilih Kategori:
          </label>
          <select
            id="filter-saw-category"
            value={filter.categoryId || ''}
            onChange={handleCategoryChange}
            style={{
              width: '100%',
              height: '42px',
              padding: '0 12px',
              backgroundColor: 'var(--nb-paper)',
              border: '2px solid var(--nb-black)',
              boxShadow: '2px 2px 0 var(--nb-black)',
              fontFamily: 'var(--nb-font-heading)',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: 'var(--nb-black)',
              cursor: 'pointer',
            }}
          >
            <option value="">Semua Kategori (Koleksi Penuh)</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Batas Peringkat (Limit) */}
        <div>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--nb-font-heading)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              marginBottom: '6px',
            }}
          >
            Batas Peringkat:
          </label>
          <div style={{ display: 'flex', gap: '6px' }} role="group" aria-label="Batas Peringkat">
            {[3, 5, 10].map((num) => {
              const active = filter.limit === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleLimitChange(num)}
                  style={{
                    height: '42px',
                    padding: '0 14px',
                    backgroundColor: active ? 'var(--nb-yellow)' : 'var(--nb-paper)',
                    border: '2px solid var(--nb-black)',
                    boxShadow: active ? '3px 3px 0 var(--nb-black)' : '2px 2px 0 var(--nb-black)',
                    transform: active ? 'translate(-1px, -1px)' : 'none',
                    fontFamily: 'var(--nb-font-mono)',
                    fontSize: '0.875rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                  aria-pressed={active}
                >
                  Top {num}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onApplyCalculation}
            disabled={isLoading}
            style={{
              height: '42px',
              padding: '0 20px',
              backgroundColor: 'var(--nb-lavender)',
              border: '2px solid var(--nb-black)',
              boxShadow: '3px 3px 0 var(--nb-black)',
              fontFamily: 'var(--nb-font-heading)',
              fontSize: '0.875rem',
              fontWeight: 800,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--nb-black)',
            }}
          >
            <Sparkles size={16} aria-hidden="true" />
            <span>{isLoading ? 'Menghitung...' : 'Hitung Rekomendasi'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            style={{
              height: '42px',
              padding: '0 14px',
              backgroundColor: 'var(--nb-white)',
              border: '2px solid var(--nb-black)',
              boxShadow: '2px 2px 0 var(--nb-black)',
              fontFamily: 'var(--nb-font-heading)',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Reset ke pengaturan default"
          >
            <RotateCcw size={15} aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
