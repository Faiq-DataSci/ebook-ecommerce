import type { FC } from 'react'
import { LoginForm } from '../components/LoginForm'
import { LoginHeader } from '../components/LoginHeader'
import { useAuth } from '../hooks/useAuth'
import '../../../styles/login.css'

interface LoginPageProps {
  onLoginSuccess?: () => void
}

export const LoginPage: FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { login, isLoading, error, clearError } = useAuth()

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      await login(credentials)
      if (onLoginSuccess) {
        onLoginSuccess()
      }
    } catch {
      // Error handled by AuthContext state
    }
  }

  return (
    <main className="login-page-container">
      <div className="login-card-wrapper">
        <LoginHeader />
        <LoginForm
          onSubmit={handleLogin}
          isSubmitting={isLoading}
          errorMessage={error}
          onClearError={clearError}
        />
      </div>
    </main>
  )
}
