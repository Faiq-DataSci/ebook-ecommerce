interface FilterSelectOption {
  value: string
  label: string
}

interface FilterSelectProps {
  value: string
  onChange: (val: string) => void
  options: FilterSelectOption[]
  label?: string
  id?: string
  icon?: string
}

export function FilterSelect({
  value,
  onChange,
  options,
  label,
  id,
  icon,
}: FilterSelectProps) {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)

  return (
    <div className="nb-filter-select-wrap">
      {label && selectId && (
        <label htmlFor={selectId} className="nb-filter-label">
          {label}
        </label>
      )}
      <div className="nb-filter-select-inner">
        {icon && (
          <span
            className="material-symbols-outlined nb-filter-icon"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        <select
          id={selectId}
          className="nb-filter-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span
          className="material-symbols-outlined nb-filter-arrow"
          aria-hidden="true"
        >
          expand_more
        </span>
      </div>
    </div>
  )
}
