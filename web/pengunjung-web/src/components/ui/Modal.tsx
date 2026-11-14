import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="nb-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 900,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--nb-space-4)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90dvh',
          overflowY: 'auto',
          backgroundColor: 'var(--nb-white)',
          border: 'var(--nb-border-thick)',
          boxShadow: 'var(--nb-shadow-xl)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--nb-space-4)',
            padding: 'var(--nb-space-4) var(--nb-space-6)',
            backgroundColor: 'var(--nb-yellow)',
            borderBottom: 'var(--nb-border)',
          }}
        >
          <h2 id="nb-modal-title" className="nb-h3">
            {title}
          </h2>
          <Button
            variant="secondary"
            onClick={onClose}
            aria-label="Tutup dialog"
            style={{ paddingInline: '12px' }}
          >
            <X size={20} strokeWidth={2.5} aria-hidden="true" />
          </Button>
        </div>

        <div style={{ padding: 'var(--nb-space-6)' }}>{children}</div>

        {footer && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              gap: 'var(--nb-space-3)',
              padding: 'var(--nb-space-4) var(--nb-space-6)',
              backgroundColor: 'var(--nb-paper)',
              borderTop: 'var(--nb-border-thin)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
