import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'blue'
  | 'ghost';

export type ButtonSize = 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantBgMap: Record<ButtonVariant, string> = {
  primary: 'var(--nb-yellow)',
  secondary: 'var(--nb-white)',
  destructive: 'var(--nb-pink)',
  blue: 'var(--nb-blue)',
  ghost: 'transparent',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = '',
  style,
  type = 'button',
  ...rest
}: ButtonProps) {
  const isGhost = variant === 'ghost';
  const isDisabled = Boolean(disabled || isLoading);

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`${isGhost ? '' : 'nb-pressable'} ${className}`.trim()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--nb-space-2)',
        minHeight: size === 'lg' ? '52px' : '44px',
        minWidth: '44px',
        paddingInline: size === 'lg' ? 'var(--nb-space-6)' : 'var(--nb-space-5)',
        paddingBlock: 'var(--nb-space-2)',
        width: fullWidth ? '100%' : undefined,
        backgroundColor: isDisabled
          ? isGhost
            ? 'transparent'
            : 'var(--nb-muted)'
          : variantBgMap[variant],
        color: isDisabled ? 'var(--nb-disabled-text)' : 'var(--nb-black)',
        border: isGhost ? 'none' : 'var(--nb-border)',
        boxShadow: isGhost || isDisabled ? 'none' : undefined,
        fontFamily: 'var(--nb-font-heading)',
        fontWeight: 700,
        fontSize: size === 'lg' ? '1rem' : '0.9375rem',
        textDecoration: isGhost ? 'underline' : 'none',
        textUnderlineOffset: isGhost ? '4px' : undefined,
        textDecorationThickness: isGhost ? '2px' : undefined,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
      {...rest}
    >
      {isLoading ? (
        <span
          aria-hidden="true"
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid var(--nb-black)',
            backgroundColor: 'var(--nb-yellow)',
            display: 'inline-block',
          }}
        />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
}
