import type { CatalogSortOption } from '../../../types/book.types';

interface SortSelectorProps {
  value: CatalogSortOption;
  onChange: (value: CatalogSortOption) => void;
}

export function SortSelector({ value, onChange }: SortSelectorProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 'var(--nb-space-2)',
      }}
    >
      <label htmlFor="nb-catalog-sort" className="nb-label">
        Urutkan:
      </label>
      <select
        id="nb-catalog-sort"
        value={value}
        onChange={(e) => onChange(e.target.value as CatalogSortOption)}
        style={{
          minHeight: '44px',
          paddingInline: '14px',
          backgroundColor: 'var(--nb-white)',
          border: 'var(--nb-border-thin)',
          boxShadow: 'var(--nb-shadow-sm)',
          fontFamily: 'var(--nb-font-heading)',
          fontWeight: 700,
        }}
      >
        <option value="newest">Terbaru Ditambahkan</option>
        <option value="price_asc">Harga: Rendah ke Tinggi</option>
        <option value="price_desc">Harga: Tinggi ke Rendah</option>
        <option value="alphabetical">Alfabetis (A - Z)</option>
      </select>
    </div>
  );
}
