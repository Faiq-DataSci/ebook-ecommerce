import type { HTMLAttributes, ReactNode } from 'react';

export type CardTone =
  | 'white'
  | 'paper'
  | 'yellow'
  | 'blue'
  | 'orange'
  | 'green'
  | 'pink'
  | 'muted';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: CardTone;
  zone?: 'A' | 'B' | 'C';
  interactive?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const toneColorMap: Record<CardTone, string> = {
  white: 'var(--nb-white)',
  paper: 'var(--nb-paper)',
  yellow: 'var(--nb-yellow)',
  blue: 'var(--nb-blue)',
  orange: 'var(--nb-orange)',
  green: 'var(--nb-green)',
  pink: 'var(--nb-pink)',
  muted: 'var(--nb-muted)',
};

const paddingMap = {
  sm: 'var(--nb-space-4)',
  md: 'var(--nb-space-5)',
  lg: 'var(--nb-space-6)',
};

export function Card({
  tone = 'white',
  zone = 'B',
  interactive = false,
  padding = 'md',
  children,
  className = '',
  style,
  ...rest
}: CardProps) {
  const shadowByZone =
    zone === 'A'
      ? 'var(--nb-shadow-lg)'
      : zone === 'C'
        ? 'var(--nb-shadow-sm)'
        : 'var(--nb-shadow)';

  return (
    <div
      className={`${interactive ? 'nb-pressable' : ''} ${className}`.trim()}
      style={{
        backgroundColor: toneColorMap[tone],
        border: zone === 'C' ? 'var(--nb-border-thin)' : 'var(--nb-border)',
        boxShadow: interactive ? undefined : shadowByZone,
        padding: paddingMap[padding],
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
