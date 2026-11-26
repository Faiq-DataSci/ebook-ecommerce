interface StatusBadgeProps {
  status: string
  fill: string
  icon?: string
  textColor?: string
}

export function StatusBadge({
  status,
  fill,
  textColor = 'var(--nb-black)',
}: StatusBadgeProps) {
  return (
    <span
      className="nb-status-badge"
      style={{
        backgroundColor: fill,
        color: textColor,
      }}
    >
      <span>{status}</span>
    </span>
  )
}
