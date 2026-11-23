interface EmptyStateProps {
  title: string
  description: string
  icon?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  title,
  description,
  icon = 'inbox',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="nb-empty-state-panel" role="region" aria-label="Status Kosong">
      <div className="nb-empty-icon-box" aria-hidden="true">
        <span className="material-symbols-outlined" style={{ fontSize: 36 }}>
          {icon}
        </span>
      </div>
      <h3 className="nb-empty-title">{title}</h3>
      <p className="nb-empty-desc">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          className="nb-btn nb-empty-action-btn"
          onClick={onAction}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            add
          </span>
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  )
}
