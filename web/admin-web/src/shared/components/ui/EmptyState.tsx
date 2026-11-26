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
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="nb-empty-state-panel" role="region" aria-label="Status Kosong">
      <h3 className="nb-empty-title">{title}</h3>
      <p className="nb-empty-desc">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          className="nb-btn nb-empty-action-btn"
          onClick={onAction}
        >
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  )
}
