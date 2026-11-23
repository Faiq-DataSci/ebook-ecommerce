interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  activeLabel?: string
  inactiveLabel?: string
  id?: string
  disabled?: boolean
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
  activeLabel = 'Aktif',
  inactiveLabel = 'Mati',
  id,
  disabled = false,
}: ToggleSwitchProps) {
  const switchId = id || (label ? `switch-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)

  return (
    <div className="nb-switch-wrapper">
      {label && switchId && (
        <label htmlFor={switchId} className="nb-form-label">
          {label}
        </label>
      )}
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label || 'Status pengalihan'}
        disabled={disabled}
        className={`nb-switch-track ${checked ? 'is-active' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="nb-switch-thumb" />
      </button>
      <span className="nb-switch-text-label" aria-hidden="true">
        {checked ? activeLabel : inactiveLabel}
      </span>
    </div>
  )
}
