import type { ReactNode } from 'react';
import { BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  customAction?: ReactNode;
  tone?: 'paper' | 'white' | 'pink';
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  customAction,
  tone = 'white',
}: EmptyStateProps) {
  const bgMap = {
    paper: 'var(--nb-paper)',
    white: 'var(--nb-white)',
    pink: 'var(--nb-pink)',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 'var(--nb-space-4)',
        padding: 'var(--nb-space-8)',
        backgroundColor: bgMap[tone],
        border: 'var(--nb-border)',
        boxShadow: 'var(--nb-shadow)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '56px',
          height: '56px',
          backgroundColor: 'var(--nb-yellow)',
          border: 'var(--nb-border)',
          boxShadow: 'var(--nb-shadow-sm)',
        }}
      >
        <BookOpen size={28} strokeWidth={2.25} />
      </div>

      <div>
        <h2 className="nb-h2" style={{ marginBottom: '8px' }}>
          {title}
        </h2>
        <p className="nb-body">{description}</p>
      </div>

      {customAction ? (
        customAction
      ) : actionLabel && onAction ? (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
