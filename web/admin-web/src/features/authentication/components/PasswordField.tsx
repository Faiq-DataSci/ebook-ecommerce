import { useState, type ChangeEvent, type FC } from 'react'

interface PasswordFieldProps {
  value: string
  error?: string
  disabled?: boolean
  onChange: (value: string) => void
  onBlur: () => void
}

export const PasswordField: FC<PasswordFieldProps> = ({
  value,
  error,
  disabled = false,
  onChange,
  onBlur,
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleBlur = () => {
    onBlur()
  }

  return (
    <div className="login-field-group">
      <label htmlFor="admin-password" className="login-field-label">
        Kata Sandi
      </label>
      <div className="login-input-wrapper">
        <input
          id="admin-password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          required
          disabled={disabled}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="••••••••"
          className={`login-input ${error ? 'is-invalid' : ''}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'admin-password-error' : undefined}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => setShowPassword((prev) => !prev)}
          className="login-toggle-password-btn"
          aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden="true">
            {showPassword ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>
      {error && (
        <div id="admin-password-error" className="login-field-error" role="alert">
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
