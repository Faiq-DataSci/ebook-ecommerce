import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { XSquare } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string | null;
  rightElement?: ReactNode;
  zone?: 'B' | 'C';
}

export function Input({
  label,
  hint,
  error,
  rightElement,
  zone = 'C',
  id,
  style,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      <label htmlFor={inputId} className="nb-label">
        {label}
      </label>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--nb-white)',
          border: zone === 'C' ? 'var(--nb-border-thin)' : 'var(--nb-border)',
          boxShadow: 'var(--nb-shadow-sm)',
        }}
      >
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? errorId : hint ? hintId : undefined
          }
          style={{
            width: '100%',
            minHeight: '48px',
            paddingInline: 'var(--nb-space-4)',
            paddingRight: rightElement ? '56px' : 'var(--nb-space-4)',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--nb-black)',
            fontSize: '1rem',
            ...style,
          }}
          {...rest}
        />
        {rightElement && (
          <div
            style={{
              position: 'absolute',
              right: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {rightElement}
          </div>
        )}
      </div>

      {hint && !error && (
        <p id={hintId} className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
          {hint}
        </p>
      )}

      {error && (
        <div
          id={errorId}
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--nb-space-2)',
            backgroundColor: 'var(--nb-pink)',
            border: 'var(--nb-border-thin)',
            padding: 'var(--nb-space-2) var(--nb-space-3)',
          }}
        >
          <XSquare size={18} strokeWidth={2.25} aria-hidden="true" />
          <span className="nb-body-sm" style={{ fontWeight: 600 }}>
            {error}
          </span>
        </div>
      )}
    </div>
  );
}
