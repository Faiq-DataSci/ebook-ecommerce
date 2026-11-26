import type { ChangeEvent, FC } from 'react'

interface EmailFieldProps {
  value: string
  error?: string
  disabled?: boolean
  onChange: (value: string) => void
  onBlur: () => void
}

export const EmailField: FC<EmailFieldProps> = ({
  value,
  error,
  disabled = false,
  onChange,
  onBlur,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleBlur = () => {
    onBlur()
  }

  return (
    <div className="login-field-group">
      <label htmlFor="admin-email" className="login-field-label">
        Email
      </label>
      <div className="login-input-wrapper">
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={disabled}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="admin@bukukita.com"
          className={`login-input ${error ? 'is-invalid' : ''}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'admin-email-error' : undefined}
        />
      </div>
      {error && (
        <div id="admin-email-error" className="login-field-error" role="alert">
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
