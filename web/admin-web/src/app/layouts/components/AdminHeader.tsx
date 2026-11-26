import { useEffect, useRef, useState } from 'react'
import { SYSTEM_NOTIFICATIONS } from '../../../features/dashboard/data/dashboardData'

interface AdminHeaderProps {
  isSidebarCollapsed: boolean
  breadcrumbText: string
  searchQuery: string
  onSearchChange: (value: string) => void
  onToggleMobileMenu: () => void
  onNavigate?: (path: string) => void
}

export function AdminHeader({
  isSidebarCollapsed,
  breadcrumbText,
  searchQuery,
  onSearchChange,
  onToggleMobileMenu,
  onNavigate,
}: AdminHeaderProps) {
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false)
  const [notifFilter, setNotifFilter] = useState<'all' | 'admin' | 'system' | 'saw'>('all')
  const notifContainerRef = useRef<HTMLDivElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  const sawCount = SYSTEM_NOTIFICATIONS.filter(
    (n) => n.id.includes('saw') || n.title.includes('SAW'),
  ).length
  const adminCount = SYSTEM_NOTIFICATIONS.filter((item) => item.category === 'admin').length
  const systemCount = SYSTEM_NOTIFICATIONS.filter((item) => item.category === 'system').length
  const unreadCount = SYSTEM_NOTIFICATIONS.filter((item) => item.unread).length

  const filteredNotifications = SYSTEM_NOTIFICATIONS.filter((item) => {
    if (notifFilter === 'saw') return item.id.includes('saw') || item.title.includes('SAW')
    if (notifFilter === 'admin') return item.category === 'admin'
    if (notifFilter === 'system') return item.category === 'system'
    return true
  })

  // Support Ctrl+K / Cmd+K shortcut to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      } else if (e.key === 'Escape' && isNotifOpen) {
        setIsNotifOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isNotifOpen])

  // Close notification panel on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notifContainerRef.current &&
        !notifContainerRef.current.contains(e.target as Node)
      ) {
        setIsNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      id="top-header"
      className={`top-header ${
        isSidebarCollapsed ? 'is-sidebar-collapsed' : ''
      }`}
    >
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-trigger nb-btn"
          aria-label="Buka menu navigasi"
          onClick={onToggleMobileMenu}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="breadcrumb-box" aria-label="Breadcrumb">
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              cursor: onNavigate ? 'pointer' : 'default',
              font: 'inherit',
              color: 'inherit',
            }}
            onClick={() => onNavigate && onNavigate('/admin/dashboard')}
            title="Ke Dashboard Utama"
          >
            <span
              className="material-symbols-outlined breadcrumb-folder-icon"
              aria-hidden="true"
            >
              folder_open
            </span>
            <span>ADMIN</span>
          </button>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{breadcrumbText}</span>
        </div>
      </div>

      <div className="header-search-wrap">
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="header-search-input"
          placeholder="Cari e-book, invoice, pelanggan..."
          aria-label="Cari e-book, invoice, pelanggan"
        />
        <span
          className="material-symbols-outlined header-search-icon"
          aria-hidden="true"
        >
          search
        </span>
        <span className="header-search-kbd" aria-hidden="true">
          ⌘K
        </span>
      </div>

      <div className="header-right">
        <div
          id="notification-container"
          ref={notifContainerRef}
          className="notification-container"
        >
          <button
            type="button"
            aria-label="Notifikasi dan Aktivitas"
            aria-expanded={isNotifOpen}
            aria-haspopup="true"
            className="notification-btn nb-btn"
            title="Notifikasi & Aktivitas Sistem"
            onClick={() => setIsNotifOpen((prev) => !prev)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              notifications
            </span>
            <span className="notification-badge">
              {unreadCount}
            </span>
          </button>

          {isNotifOpen && (
            <div
              className="notification-dropdown"
              role="region"
              aria-label="Notifikasi dan Aktivitas Sistem"
            >
              <div className="notification-dropdown-header">
                <div className="notification-dropdown-title">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 18 }}
                  >
                    notifications_active
                  </span>
                  <span>Notifikasi Aktivitas</span>
                </div>
                <div className="notification-header-badges">
                  <span className="badge-simulation-tag">DATA SIMULASI</span>
                  <span className="notification-new-tag">
                    {unreadCount} BARU
                  </span>
                </div>
              </div>

              <div className="notification-tabs" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={notifFilter === 'all'}
                  className={`notification-tab-btn ${notifFilter === 'all' ? 'is-active' : ''}`}
                  onClick={() => setNotifFilter('all')}
                >
                  Semua ({SYSTEM_NOTIFICATIONS.length})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={notifFilter === 'admin'}
                  className={`notification-tab-btn ${notifFilter === 'admin' ? 'is-active' : ''}`}
                  onClick={() => setNotifFilter('admin')}
                >
                  Admin ({adminCount})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={notifFilter === 'system'}
                  className={`notification-tab-btn ${notifFilter === 'system' ? 'is-active' : ''}`}
                  onClick={() => setNotifFilter('system')}
                >
                  Sistem ({systemCount})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={notifFilter === 'saw'}
                  className={`notification-tab-btn ${notifFilter === 'saw' ? 'is-active' : ''}`}
                  onClick={() => setNotifFilter('saw')}
                >
                  SAW ({sawCount})
                </button>
              </div>

              <div className="notification-list">
                {filteredNotifications.length === 0 ? (
                  <div className="notification-empty">
                    Tidak ada notifikasi pada kategori ini.
                  </div>
                ) : (
                  filteredNotifications.map((item) => {
                    const isSaw =
                      item.id.includes('saw') || item.title.includes('SAW')
                    let badgeClass = 'notification-badge-system'
                    let badgeLabel = 'SISTEM'
                    if (isSaw) {
                      badgeClass = 'notification-badge-saw'
                      badgeLabel = 'SPK SAW'
                    } else if (item.category === 'admin') {
                      badgeClass = 'notification-badge-admin'
                      badgeLabel = 'AKSI ADMIN'
                    }

                    return (
                      <div
                        key={item.id}
                        className={`notification-item ${item.unread ? 'is-unread' : ''}`}
                      >
                        <div className="notification-item-top">
                          <div className="notification-item-badges">
                            <span className={badgeClass}>
                              <span
                                className="material-symbols-outlined"
                                style={{ fontSize: 11 }}
                                aria-hidden="true"
                              >
                                {item.icon}
                              </span>
                              <span>{badgeLabel}</span>
                            </span>
                            {item.unread && (
                              <span className="notification-unread-chip">
                                BARU
                              </span>
                            )}
                          </div>
                          <span className="notification-item-time">
                            {item.timeAgo}
                          </span>
                        </div>
                        <span className="notification-item-title">
                          {item.title}
                        </span>
                        {item.description && (
                          <p className="notification-item-desc">
                            {item.description}
                          </p>
                        )}
                        <span className="notification-item-meta">{item.meta}</span>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
