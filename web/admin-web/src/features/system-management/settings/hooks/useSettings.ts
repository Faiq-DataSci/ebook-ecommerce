import { useCallback, useEffect, useState } from 'react'
import type { ToastMessage } from '../../../../shared/components/ui'
import { useAuth } from '../../../authentication/hooks/useAuth'
import {
  checkSystemHealth,
  fetchAdminProfile,
  updateAdminProfile,
  updateOwnAdminPassword,
} from '../services/settings.service'
import type {
  AdminProfileData,
  SettingsTabId,
  SystemHealthSnapshot,
  UpdateAdminProfilePayload,
} from '../types/settings.types'

export function useSettings() {
  const { user, session, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<SettingsTabId>('general')

  // Admin Profile state
  const [profile, setProfile] = useState<AdminProfileData | null>(null)
  const [profileWarning, setProfileWarning] = useState<string | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true)
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false)
  const [isSavingPassword, setIsSavingPassword] = useState<boolean>(false)

  // System Health state
  const [health, setHealth] = useState<SystemHealthSnapshot | null>(null)
  const [isCheckingHealth, setIsCheckingHealth] = useState<boolean>(true)

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const pushToast = useCallback((type: ToastMessage['type'], text: string) => {
    setToasts((prev) => [
      ...prev,
      { id: `set-toast-${Date.now()}-${Math.random()}`, type, text },
    ])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const loadProfile = useCallback(async () => {
    setIsLoadingProfile(true)
    const result = await fetchAdminProfile(user)
    setProfile(result.profile)
    setProfileWarning(result.warning ?? null)
    setIsLoadingProfile(false)
  }, [user])

  const refreshSystemHealth = useCallback(async () => {
    setIsCheckingHealth(true)
    const snapshot = await checkSystemHealth()
    setHealth(snapshot)
    setIsCheckingHealth(false)
  }, [])

  useEffect(() => {
    let active = true

    fetchAdminProfile(user).then((result) => {
      if (!active) return
      setProfile(result.profile)
      setProfileWarning(result.warning ?? null)
      setIsLoadingProfile(false)
    })

    checkSystemHealth().then((snapshot) => {
      if (!active) return
      setHealth(snapshot)
      setIsCheckingHealth(false)
    })

    return () => {
      active = false
    }
  }, [user])

  const saveProfile = useCallback(
    async (payload: UpdateAdminProfilePayload): Promise<boolean> => {
      setIsSavingProfile(true)
      try {
        const updated = await updateAdminProfile(payload)
        setProfile(updated)
        setProfileWarning(null)
        pushToast('success', 'Profil akun admin berhasil diperbarui di backend.')
        return true
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Gagal menyimpan perubahan profil admin.'
        pushToast('error', msg)
        return false
      } finally {
        setIsSavingProfile(false)
      }
    },
    [pushToast],
  )

  const changePassword = useCallback(
    async (newPassword: string): Promise<boolean> => {
      setIsSavingPassword(true)
      try {
        await updateOwnAdminPassword(newPassword)
        pushToast(
          'success',
          'Kata sandi akun admin berhasil diperbarui melalui Supabase Auth.',
        )
        return true
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Gagal memperbarui kata sandi akun admin.'
        pushToast('error', msg)
        return false
      } finally {
        setIsSavingPassword(false)
      }
    },
    [pushToast],
  )

  return {
    activeTab,
    setActiveTab,
    user,
    session,
    logout,
    profile,
    profileWarning,
    isLoadingProfile,
    isSavingProfile,
    isSavingPassword,
    health,
    isCheckingHealth,
    toasts,
    loadProfile,
    refreshSystemHealth,
    saveProfile,
    changePassword,
    dismissToast,
  }
}
