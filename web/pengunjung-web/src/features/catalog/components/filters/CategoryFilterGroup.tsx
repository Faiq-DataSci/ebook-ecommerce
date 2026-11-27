import { Check } from 'lucide-react';
import type { Category } from '../../../../types/book.types';

interface CategoryFilterGroupProps {
  categories: Category[];
  categoryCounts: Record<string, number>;
  totalBooksCount: number;
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryFilterGroup({
  categories,
  categoryCounts,
  totalBooksCount,
  selectedCategoryId,
  onSelectCategory,
}: CategoryFilterGroupProps) {
  return (
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
        {selectedCategoryId && (
          <button
            type="button"
            onClick={() => onSelectCategory('')}
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
        <button
          type="button"
          role="radio"
          aria-checked={selectedCategoryId === ''}
          onClick={() => onSelectCategory('')}
          className={`nb-category-item-row ${selectedCategoryId === '' ? 'is-active' : ''}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                border: '2px solid var(--nb-black)',
                backgroundColor:
                  selectedCategoryId === '' ? 'var(--nb-black)' : 'var(--nb-white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {selectedCategoryId === '' && (
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
                selectedCategoryId === ''
                  ? 'var(--nb-black)'
                  : 'var(--nb-text-muted)',
            }}
          >
            ({totalBooksCount})
          </span>
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const count = categoryCounts[cat.id] ?? cat.bookCount ?? 0;
          return (
            <button
              key={cat.id}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => onSelectCategory(isSelected ? '' : cat.id)}
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
  );
}
