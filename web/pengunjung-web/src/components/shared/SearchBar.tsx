import type { FormEvent } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface SearchBarProps {
  value: string;
  onChange: (nextValue: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  label?: string;
  submitLabel?: string;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Cari judul e-book atau nama penulis...',
  label = 'Pencarian katalog e-book',
  submitLabel = 'Cari Buku',
}: SearchBarProps) {
  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.();
  };

  return (
    <form
      role="search"
      onSubmit={handleFormSubmit}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--nb-space-3)',
        width: '100%',
      }}
    >
      <div
        style={{
          flex: '1 1 260px',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--nb-white)',
          border: 'var(--nb-border)',
          boxShadow: 'var(--nb-shadow-sm)',
          paddingLeft: 'var(--nb-space-3)',
        }}
      >
        <Search size={20} strokeWidth={2.5} aria-hidden="true" />
        <label htmlFor="nb-catalog-search" className="nb-label" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
          {label}
        </label>
        <input
          id="nb-catalog-search"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            minHeight: '48px',
            paddingInline: 'var(--nb-space-3)',
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '1rem',
          }}
        />
        {value.length > 0 && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Bersihkan kata kunci pencarian"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '44px',
              minHeight: '44px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <X size={18} strokeWidth={2.5} aria-hidden="true" />
          </button>
        )}
      </div>
      {onSubmit && (
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
      )}
    </form>
  );
}
