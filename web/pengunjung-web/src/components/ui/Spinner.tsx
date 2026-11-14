interface SpinnerProps {
  label?: string;
}

export function Spinner({ label = 'Memuat data katalog e-book...' }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--nb-space-4)',
        padding: 'var(--nb-space-8)',
        backgroundColor: 'var(--nb-white)',
        border: 'var(--nb-border)',
        boxShadow: 'var(--nb-shadow)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 18px)',
          gap: '6px',
        }}
      >
        <span
          style={{
            width: '18px',
            height: '18px',
            backgroundColor: 'var(--nb-yellow)',
            border: 'var(--nb-border-thin)',
          }}
        />
        <span
          style={{
            width: '18px',
            height: '18px',
            backgroundColor: 'var(--nb-blue)',
            border: 'var(--nb-border-thin)',
          }}
        />
        <span
          style={{
            width: '18px',
            height: '18px',
            backgroundColor: 'var(--nb-orange)',
            border: 'var(--nb-border-thin)',
          }}
        />
      </div>
      <p className="nb-label">{label}</p>
    </div>
  );
}
