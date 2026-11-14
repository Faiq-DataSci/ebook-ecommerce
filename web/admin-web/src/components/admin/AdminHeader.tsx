import { useEffect, useRef, useState } from 'react'
import { SYSTEM_NOTIFICATIONS } from '../../data/dashboardData'

interface AdminHeaderProps {
  isSidebarCollapsed: boolean
  breadcrumbText: string
  searchQuery: string
  onSearchChange: (value: string) => void
  onToggleMobileMenu: () => void
}

export function AdminHeader({
  isSidebarCollapsed,
  breadcrumbText,
  searchQuery,
  onSearchChange,
  onToggleMobileMenu,
}: AdminHeaderProps) {
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false)
  const notifContainerRef = useRef<HTMLDivElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

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
          <span
            className="material-symbols-outlined breadcrumb-folder-icon"
            aria-hidden="true"
          >
            folder_open
          </span>
          <span>ADMIN</span>
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
        <div className="system-online-pill">
          <span className="status-square-dot" aria-hidden="true" />
          <span>SISTEM ONLINE</span>
        </div>

        <div
          id="notification-container"
          ref={notifContainerRef}
          className="notification-container"
        >
          <button
            type="button"
            aria-label="Notifikasi"
            aria-expanded={isNotifOpen}
            aria-haspopup="true"
            className="notification-btn nb-btn"
            title="Notifikasi Sistem"
            onClick={() => setIsNotifOpen((prev) => !prev)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              notifications
            </span>
            <span className="notification-badge">
              {SYSTEM_NOTIFICATIONS.length}
            </span>
          </button>

          {isNotifOpen && (
            <div
              className="notification-dropdown"
              role="region"
              aria-label="Notifikasi Sistem"
            >
              <div className="notification-dropdown-header">
                <div className="notification-dropdown-title">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16 }}
                  >
                    notifications_active
                  </span>
                  <span>Notifikasi Sistem</span>
                </div>
                <span className="notification-new-tag">
                  {SYSTEM_NOTIFICATIONS.length} BARU
                </span>
              </div>

              <div className="notification-list">
                {SYSTEM_NOTIFICATIONS.map((item) => (
                  <div key={item.id} className="notification-item">
                    <span className="notification-item-title">
                      {item.title}
                    </span>
                    <span className="notification-item-meta">{item.meta}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="header-profile-card">
          <div className="header-avatar">BS</div>
          <div className="header-profile-info">
            <span className="header-profile-name">Budi Santoso</span>
            <span className="header-profile-role">SUPER ADMIN</span>
          </div>
        </div>
      </div>
    </header>
  )
}
