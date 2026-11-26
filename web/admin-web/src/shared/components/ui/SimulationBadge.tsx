interface SimulationBadgeProps {
  compact?: boolean
}

export function SimulationBadge({ compact = false }: SimulationBadgeProps) {
  return (
    <span
      className={`nb-simulation-badge ${compact ? 'is-compact' : ''}`}
      role="note"
      aria-label="Penanda Data Simulasi"
      title="Data ini merupakan data simulasi untuk keperluan demo/testing"
    >
      <span>DATA SIMULASI</span>
    </span>
  )
}
