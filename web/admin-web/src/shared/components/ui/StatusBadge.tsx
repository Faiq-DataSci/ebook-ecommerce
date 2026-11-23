interface StatusBadgeProps {
  status: string
  fill: string
  icon: string
  textColor?: string
}

export function StatusBadge({
  status,
  fill,
  icon,
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
      <span
        className="material-symbols-outlined"
        style={{ fontSize: 16 }}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span>{status}</span>
    </span>
  )
}
