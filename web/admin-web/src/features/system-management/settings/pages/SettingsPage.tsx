import { Toast } from '../../../../shared/components/ui'
import { AdminAccountSection } from '../components/AdminAccountSection'
import { GeneralSettingsSection } from '../components/GeneralSettingsSection'
import { SecuritySettingsSection } from '../components/SecuritySettingsSection'
import { SystemConfigSection } from '../components/SystemConfigSection'
import { useSettings } from '../hooks/useSettings'
import type { SettingsTabId } from '../types/settings.types'

interface SettingsPageProps {
  onNavigate?: (path: string) => void
}

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const {
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
  } = useSettings()

  const tabs: Array<{
    id: SettingsTabId
    label: string
    badge?: string
    badgeBg?: string
    badgeColor?: string
  }> = [
    {
      id: 'general',
      label: 'Umum',
    },
    {
      id: 'account',
      label: 'Akun Admin',
      badge: profile?.source === 'BACKEND' ? 'Live' : 'Sesi',
      badgeBg:
        profile?.source === 'BACKEND' ? 'var(--nb-green)' : 'var(--nb-orange)',
      badgeColor: 'var(--nb-black)',
    },
    {
      id: 'system',
      label: 'Sistem',
      badge:
        isCheckingHealth && !health
          ? 'Cek...'
          : health?.backendReachable
            ? 'Aktif'
            : 'Offline',
      badgeBg:
        isCheckingHealth && !health
          ? 'var(--nb-muted)'
          : health?.backendReachable
            ? 'var(--nb-green)'
            : 'var(--nb-pink)',
      badgeColor: 'var(--nb-black)',
    },
    {
      id: 'security',
      label: 'Keamanan',
      badge: session ? 'JWT' : 'Lokal',
      badgeBg: session ? 'var(--nb-blue)' : 'var(--nb-muted)',
      badgeColor: 'var(--nb-black)',
    },
  ]

  return (
    <div className="tf-page-container">
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Page Header — konsisten dengan halaman admin lain */}
      <div className="tf-page-header">
        <div className="tf-title-group">
          <div className="tf-header-title-row">
            <span
              className="tf-badge"
              style={{
                backgroundColor: 'var(--nb-green)',
                color: 'var(--nb-black)',
              }}
            >
              MANAJEMEN SISTEM
            </span>
            <span className="tf-badge-zone">ZONA C: KONFIGURASI</span>
          </div>
          <h1 className="tf-page-title">Pengaturan Sistem</h1>
          <p className="tf-page-subtitle">
            Konfigurasi profil akun administrator, pemantauan konektivitas
            backend, dan kebijakan keamanan akses.
          </p>
        </div>
      </div>

      {/* Sub-Navigation Tabs Strip — identik dengan Transaksi, Keuangan, & SPK */}
      <div
        className="tf-nav-tabs"
        role="tablist"
        aria-label="Navigasi Submenu Pengaturan"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`settings-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`settings-panel-${tab.id}`}
              className={`tf-tab-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className="tf-tab-badge"
                  style={{
                    backgroundColor: tab.badgeBg,
                    color: tab.badgeColor,
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Panel Konten Tab */}
      <div
        id={`settings-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`settings-tab-${activeTab}`}
      >
        {activeTab === 'general' && <GeneralSettingsSection />}

        {activeTab === 'account' && (
          <AdminAccountSection
            profile={profile}
            profileWarning={profileWarning}
            isLoadingProfile={isLoadingProfile}
            isSavingProfile={isSavingProfile}
            isSavingPassword={isSavingPassword}
            hasLiveSupabaseSession={Boolean(session)}
            onRefreshProfile={() => void loadProfile()}
            onSaveProfile={saveProfile}
            onChangePassword={changePassword}
          />
        )}

        {activeTab === 'system' && (
          <SystemConfigSection
            health={health}
            isCheckingHealth={isCheckingHealth}
            onRefreshHealth={() => void refreshSystemHealth()}
            onNavigate={onNavigate}
          />
        )}

        {activeTab === 'security' && (
          <SecuritySettingsSection
            user={user}
            session={session}
            onLogout={logout}
            onNavigate={onNavigate}
          />
        )}
      </div>
    </div>
  )
}
