import { useEffect } from 'react'

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  text: string
}

interface ToastProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

export function Toast({ toasts, onDismiss }: ToastProps) {
  useEffect(() => {
    // Auto-dismiss non-error toasts after 5 seconds
    const timers = toasts
      .filter((t) => t.type !== 'error')
      .map((t) =>
        setTimeout(() => {
          onDismiss(t.id)
        }, 5000),
      )

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [toasts, onDismiss])

  if (toasts.length === 0) return null

  return (
    <div
      className="nb-toast-container"
      role="region"
      aria-label="Pemberitahuan Sistem"
    >
      {toasts.map((toast) => {
        const icon =
          toast.type === 'success'
            ? 'check_circle'
            : toast.type === 'error'
              ? 'error'
              : toast.type === 'warning'
                ? 'warning'
                : 'info'

        return (
          <div
            key={toast.id}
            className={`nb-toast-item nb-toast-${toast.type}`}
            role="status"
            aria-live="polite"
          >
            <span
              className="material-symbols-outlined nb-toast-icon"
              aria-hidden="true"
            >
              {icon}
            </span>
            <div className="nb-toast-message">{toast.text}</div>
            <button
              type="button"
              className="nb-toast-close-btn"
              onClick={() => onDismiss(toast.id)}
              aria-label="Tutup pemberitahuan"
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                close
              </span>
            </button>
          </div>
        )
      })}
    </div>
  )
}
