import { useContext } from 'react'
import { AuthContext } from '../../../app/providers/AuthContext'
import type { AuthContextValue } from '../types/auth.types'

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam <AuthProvider>')
  }
  return context
}
