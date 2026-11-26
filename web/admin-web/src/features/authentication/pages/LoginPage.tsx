import { useEffect, useState, type FC } from 'react'
import { NeubrutalismLoaderCard } from '../../../shared/components/ui'
import { LoginForm } from '../components/LoginForm'
import { LoginHeader } from '../components/LoginHeader'
import { useAuth } from '../hooks/useAuth'
import '../../../styles/login.css'

interface LoginPageProps {
  onLoginSuccess?: () => void
}

export const LoginPage: FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { login, isLoading, error, clearError } = useAuth()
  const [loginProgress, setLoginProgress] = useState<number>(35)

  useEffect(() => {
    if (!isLoading) return

    const step1 = window.setTimeout(() => setLoginProgress(68), 160)
    const step2 = window.setTimeout(() => setLoginProgress(90), 380)

    return () => {
      window.clearTimeout(step1)
      window.clearTimeout(step2)
    }
  }, [isLoading])

  const handleLogin = async (credentials: { email: string; password: string }) => {
    setLoginProgress(35)
    try {
      await login(credentials)
      setLoginProgress(100)
      if (onLoginSuccess) {
        onLoginSuccess()
      }
    } catch {
      // Error handled by AuthContext state
    }
  }

  return (
    <main className="login-page-container">
      {isLoading && (
        <NeubrutalismLoaderCard
          title="Memproses Login Admin"
          statusText={
            loginProgress < 70
              ? 'Memverifikasi kredensial administrator...'
              : 'Memeriksa hak akses peran ADMIN...'
          }
          progressPercent={loginProgress}
          showBackdrop
          showTopBar
        />
      )}

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
