export interface FilterChipOption<T extends string = string> {
  value: T
  label: string
  count?: number
  icon?: string
  activeBg?: string
  activeColor?: string
}

interface FilterChipGroupProps<T extends string = string> {
  label?: string
  icon?: string
  options: FilterChipOption<T>[]
  value: T
  onChange: (value: T) => void
  size?: 'sm' | 'md'
  ariaLabel?: string
}

export function FilterChipGroup<T extends string = string>({
  label,
  icon,
  options,
  value,
  onChange,
  size = 'md',
  ariaLabel,
}: FilterChipGroupProps<T>) {
  return (
    <div
      className={`nb-filter-chip-group size-${size}`}
      role="group"
      aria-label={ariaLabel || label || 'Pilihan Filter'}
    >
      {label && (
        <div className="nb-filter-group-label">
          {icon && (
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 16 }}
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
          <span>{label}</span>
        </div>
      )}

      <div className="nb-filter-chip-list">
        {options.map((opt) => {
          const isSelected = opt.value === value
          const bg = isSelected ? opt.activeBg || 'var(--nb-yellow)' : 'var(--nb-white)'
          const fg = isSelected ? opt.activeColor || 'var(--nb-black)' : 'var(--nb-black)'

          return (
            <button
              key={opt.value}
              type="button"
              className={`nb-btn nb-filter-chip ${isSelected ? 'is-selected' : ''}`}
              style={{
                backgroundColor: bg,
                color: fg,
              }}
              onClick={() => onChange(opt.value)}
              aria-pressed={isSelected}
            >
              {opt.icon && (
                <span
                  className="material-symbols-outlined nb-chip-icon"
                  aria-hidden="true"
                >
                  {opt.icon}
                </span>
              )}
              <span className="nb-chip-text">{opt.label}</span>
              {typeof opt.count === 'number' && (
                <span
                  className="nb-chip-count font-mono-nb"
                  aria-label={`${opt.count} item`}
                >
                  {opt.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
