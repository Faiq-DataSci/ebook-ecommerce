import { useState, type FC, type FormEvent } from 'react'
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

      <div className="login-simulation-hint">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <strong>KREDENSIAL AKSES ADMIN:</strong>
          <button
            type="button"
            onClick={async () => {
              const creds = {
                email: 'admin.simulasi@example.com',
                password: 'AdminPassword123!',
              }
              setCredentials(creds)
              setErrors({})
              await onSubmit(creds)
            }}
            disabled={isSubmitting}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 900,
              padding: '3px 8px',
              backgroundColor: 'var(--nb-yellow)',
              border: '2px solid #000',
              boxShadow: '2px 2px 0 #000',
              cursor: 'pointer',
            }}
          >
            MASUK CEPAT (1-KLIK)
          </button>
        </div>
        <div>
          Email: <code>admin.simulasi@example.com</code>
        </div>
        <div>
          Kata Sandi: <code>AdminPassword123!</code>
        </div>
      </div>

      <div className="login-footer-info">
        <span>VERSI SISTEM v1.0</span>
        <span>NEUBRUTALISM v2.0</span>
      </div>
    </div>
  )
}
