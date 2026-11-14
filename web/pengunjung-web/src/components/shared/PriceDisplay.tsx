import { formatCurrency } from '../../utils/formatCurrency';

interface PriceDisplayProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
}

const fontSizeMap = {
  sm: '0.875rem',
  md: '1rem',
  lg: '1.375rem',
};

export function PriceDisplay({ amount, size = 'md' }: PriceDisplayProps) {
  return (
    <span
      className="nb-mono"
      style={{
        display: 'inline-block',
        backgroundColor: 'var(--nb-yellow)',
        color: 'var(--nb-black)',
        border: 'var(--nb-border-thin)',
        boxShadow: 'var(--nb-shadow-sm)',
        padding: size === 'lg' ? '6px 14px' : '4px 10px',
        fontSize: fontSizeMap[size],
        fontWeight: 700,
      }}
    >
      {formatCurrency(amount)}
    </span>
  );
}
