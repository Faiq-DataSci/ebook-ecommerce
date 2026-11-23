interface TableSkeletonProps {
  rows?: number
  cols?: number
}

export function TableSkeleton({ rows = 5, cols = 6 }: TableSkeletonProps) {
  const rowList = Array.from({ length: rows }, (_, i) => i)
  const colList = Array.from({ length: cols }, (_, i) => i)

  return (
    <div
      className="nb-table-skeleton-wrap"
      role="status"
      aria-label="Memuat data tabel..."
    >
      <div className="nb-skeleton-header" />
      {rowList.map((r) => (
        <div key={r} className="nb-skeleton-row">
          {colList.map((c) => (
            <div
              key={c}
              className="nb-skeleton-cell"
              style={{
                width: c === 1 ? '40%' : c === 0 ? '60px' : '15%',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
