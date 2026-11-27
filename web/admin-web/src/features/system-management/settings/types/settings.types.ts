export type SettingsTabId = 'general' | 'account' | 'system' | 'security'

export interface AdminProfileData {
  id: string
  email: string
  fullName: string
  phone: string | null
  role: 'ADMIN' | 'CUSTOMER'
  isActive: boolean
  createdAt: string | null
  updatedAt: string | null
  source: 'BACKEND' | 'AUTH_SESSION'
}

export interface UpdateAdminProfilePayload {
  fullName: string
  phone: string | null
}

export interface SystemHealthSnapshot {
  backendReachable: boolean
  backendStatusText: string
  backendEnvironment: string | null
  adminAuthorized: boolean
  adminAuthStatusText: string
  supabaseConfigured: boolean
  apiBaseUrl: string
  checkedAt: string
}
