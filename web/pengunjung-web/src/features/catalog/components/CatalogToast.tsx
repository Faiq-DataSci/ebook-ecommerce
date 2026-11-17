import { Check, Info, X } from 'lucide-react';
import type { ToastItem } from '../hooks/useCatalog';

interface CatalogToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function CatalogToast({ toasts, onDismiss }: CatalogToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="nb-toast-container"
      role="region"
      aria-live="polite"
      aria-label="Pemberitahuan Interaksi Katalog"
    >
      {toasts.map((toast) => {
        let toneClass = 'nb-toast--yellow';
        if (toast.tone === 'pink') toneClass = 'nb-toast--pink';
        if (toast.tone === 'lavender') toneClass = 'nb-toast--lavender';
        if (toast.tone === 'green') toneClass = 'nb-toast--green';

        return (
          <div
            key={toast.id}
            className={`nb-toast ${toneClass}`}
            role="status"
          >
            {toast.tone === 'pink' ? (
              <Info size={18} strokeWidth={2.5} aria-hidden="true" />
            ) : (
              <Check size={18} strokeWidth={2.5} aria-hidden="true" />
            )}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Tutup notifikasi"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                padding: '2px',
                color: 'var(--nb-black)',
              }}
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
