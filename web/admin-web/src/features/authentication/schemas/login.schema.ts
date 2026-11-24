import type { LoginCredentials, LoginValidationErrors } from '../types/auth.types'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validates email field according to project business rules.
 */
export function validateEmail(email: string): string | null {
  const trimmed = email.trim()
  if (!trimmed) {
    return 'Email wajib diisi.'
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Format email tidak valid.'
  }
  return null
}

/**
 * Validates password field.
 */
export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Kata sandi wajib diisi.'
  }
  return null
}

/**
 * Performs full validation on login form.
 */
export function validateLoginForm(credentials: LoginCredentials): LoginValidationErrors {
  const errors: LoginValidationErrors = {}
  const emailError = validateEmail(credentials.email)
  const passwordError = validatePassword(credentials.password)

  if (emailError) {
    errors.email = emailError
  }
  if (passwordError) {
    errors.password = passwordError
  }

  return errors
}
