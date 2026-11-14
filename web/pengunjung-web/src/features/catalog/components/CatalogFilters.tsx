import { RotateCcw } from 'lucide-react';
import type {
  CatalogFilterState,
  Category,
} from '../../../types/book.types';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface CatalogFiltersProps {
  categories: Category[];
  authors: string[];
  filters: CatalogFilterState;
  onChangeFilter: <K extends keyof CatalogFilterState>(
    key: K,
    value: CatalogFilterState[K],
  ) => void;
  onReset: () => void;
}

export function CatalogFilters({
  categories,
  authors,
  filters,
  onChangeFilter,
  onReset,
}: CatalogFiltersProps) {
  return (
    <Card tone="white" zone="B" padding="md">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--nb-space-4)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: 'var(--nb-border-thin)',
            paddingBottom: 'var(--nb-space-3)',
          }}
        >
          <h2 className="nb-h3">Filter Katalog</h2>
          <Button
            variant="secondary"
            onClick={onReset}
            leftIcon={<RotateCcw size={16} strokeWidth={2.25} aria-hidden="true" />}
          >
            Reset
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="nb-filter-category" className="nb-label">
            Kategori Buku
          </label>
          <select
            id="nb-filter-category"
            value={filters.categoryId}
            onChange={(e) => onChangeFilter('categoryId', e.target.value)}
            style={{
              minHeight: '48px',
              paddingInline: '12px',
              backgroundColor: 'var(--nb-paper)',
              border: 'var(--nb-border-thin)',
              boxShadow: 'var(--nb-shadow-sm)',
            }}
          >
            <option value="">Semua Kategori ({categories.length})</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="nb-filter-author" className="nb-label">
            Penulis E-Book
          </label>
          <select
            id="nb-filter-author"
            value={filters.author}
            onChange={(e) => onChangeFilter('author', e.target.value)}
            style={{
              minHeight: '48px',
              paddingInline: '12px',
              backgroundColor: 'var(--nb-paper)',
              border: 'var(--nb-border-thin)',
              boxShadow: 'var(--nb-shadow-sm)',
            }}
          >
            <option value="">Semua Penulis ({authors.length})</option>
            {authors.map((authorName) => (
              <option key={authorName} value={authorName}>
                {authorName}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span className="nb-label">Rentang Harga (Rp)</span>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--nb-space-2)',
            }}
          >
            <div>
              <label htmlFor="nb-filter-min-price" className="nb-body-sm">
                Minimum
              </label>
              <input
                id="nb-filter-min-price"
                type="number"
                min={0}
                step={5000}
                value={filters.minPrice}
                onChange={(e) => onChangeFilter('minPrice', e.target.value)}
                placeholder="0"
                style={{
                  width: '100%',
                  minHeight: '44px',
                  paddingInline: '10px',
                  backgroundColor: 'var(--nb-paper)',
                  border: 'var(--nb-border-thin)',
                }}
              />
            </div>

            <div>
              <label htmlFor="nb-filter-max-price" className="nb-body-sm">
                Maksimum
              </label>
              <input
                id="nb-filter-max-price"
                type="number"
                min={0}
                step={5000}
                value={filters.maxPrice}
                onChange={(e) => onChangeFilter('maxPrice', e.target.value)}
                placeholder="100000"
                style={{
                  width: '100%',
                  minHeight: '44px',
                  paddingInline: '10px',
                  backgroundColor: 'var(--nb-paper)',
                  border: 'var(--nb-border-thin)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
