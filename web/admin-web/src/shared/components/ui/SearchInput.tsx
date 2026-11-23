interface SearchInputProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  onClear?: () => void
  ariaLabel?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Cari data...',
  onClear,
  ariaLabel = 'Kolom pencarian',
}: SearchInputProps) {
  return (
    <div className="nb-search-wrap">
      <span
        className="material-symbols-outlined nb-search-icon"
        aria-hidden="true"
      >
        search
      </span>
      <input
        type="text"
        className="nb-search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
      {value && onClear && (
        <button
          type="button"
          className="nb-search-clear-btn"
          onClick={onClear}
          aria-label="Hapus kata kunci pencarian"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            close
          </span>
        </button>
      )}
    </div>
  )
}
