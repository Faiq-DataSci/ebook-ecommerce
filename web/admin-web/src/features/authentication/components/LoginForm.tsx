import { useState, type FC, type FormEvent } from 'react'
import { isSupabaseConfigured } from '../../../services/supabase/client'
import {
  validateEmail,
  validateLoginForm,
  validatePassword,
} from '../schemas/login.schema'
import type { LoginCredentials, LoginValidationErrors } from '../types/auth.types'
import { EmailField } from './EmailField'
import { PasswordField } from './PasswordField'

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>
  isSubmitting: boolean
  errorMessage?: string | null
  onClearError?: () => void
}

export const LoginForm: FC<LoginFormProps> = ({
  onSubmit,
  isSubmitting,
  errorMessage,
  onClearError,
}) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<LoginValidationErrors>({})
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({})

  const handleEmailChange = (val: string) => {
    setCredentials((prev) => ({ ...prev, email: val }))
    if (errorMessage && onClearError) {
      onClearError()
    }
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(val) ?? undefined }))
    }
  }

  const handlePasswordChange = (val: string) => {
    setCredentials((prev) => ({ ...prev, password: val }))
    if (errorMessage && onClearError) {
      onClearError()
    }
    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: validatePassword(val) ?? undefined }))
    }
  }

  const handleEmailBlur = () => {
    setTouched((prev) => ({ ...prev, email: true }))
    setErrors((prev) => ({ ...prev, email: validateEmail(credentials.email) ?? undefined }))
  }

  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, password: true }))
    setErrors((prev) => ({ ...prev, password: validatePassword(credentials.password) ?? undefined }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setTouched({ email: true, password: true })

    const validationErrors = validateLoginForm(credentials)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    await onSubmit(credentials)
  }

  return (
    <div className="login-form-panel">
      <div className="login-form-header">
        <h2 className="login-form-heading">Masuk ke Dashboard</h2>
        <p className="login-form-subtext">
          Silakan masukkan kredensial administrator terdaftar.
        </p>
      </div>

      {errorMessage && (
        <div className="login-alert-danger" role="alert">
          <span className="material-symbols-outlined login-alert-icon" aria-hidden="true">
            warning
          </span>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <EmailField
          value={credentials.email}
          error={errors.email}
          disabled={isSubmitting}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
        />

        <PasswordField
          value={credentials.password}
          error={errors.password}
          disabled={isSubmitting}
          onChange={handlePasswordChange}
          onBlur={handlePasswordBlur}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="login-submit-btn"
        >
          {isSubmitting ? (
            <>
              <span className="login-spinner-cube" aria-hidden="true" />
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <span>Masuk ke Dashboard</span>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden="true">
                arrow_forward
              </span>
            </>
          )}
        </button>
      </form>

      {!isSupabaseConfigured && (
        <div className="login-simulation-hint">
          <strong>Mode Simulasi Aktif:</strong> Kredensial Supabase belum terkonfigurasi pada file <code>.env</code>.
          Gunakan akun seeder: <code>admin.simulasi@example.com</code> dengan kata sandi bebas untuk pengujian.
        </div>
      )}

      <div className="login-footer-info">
        <span>VERSI SISTEM v1.0</span>
        <span>NEUBRUTALISM v2.0</span>
      </div>
    </div>
  )
}
