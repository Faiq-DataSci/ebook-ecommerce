import { useState, useMemo } from 'react'
import { SYSTEM_NOTIFICATIONS } from '../data/dashboardData'

export function DashboardActivityLog() {
  const [activityFilter, setActivityFilter] =
    useState<'all' | 'admin' | 'system' | 'saw'>('all')

  const adminActivitiesCount = useMemo(
    () => SYSTEM_NOTIFICATIONS.filter((n) => n.category === 'admin').length,
    [],
  )
  const systemActivitiesCount = useMemo(
    () => SYSTEM_NOTIFICATIONS.filter((n) => n.category === 'system').length,
    [],
  )
  const sawActivitiesCount = useMemo(
    () =>
      SYSTEM_NOTIFICATIONS.filter(
        (n) => n.id.includes('saw') || n.title.includes('SAW'),
      ).length,
    [],
  )

  const dashboardActivities = useMemo(() => {
    return SYSTEM_NOTIFICATIONS.filter((item) => {
      if (activityFilter === 'saw')
        return item.id.includes('saw') || item.title.includes('SAW')
      if (activityFilter === 'admin') return item.category === 'admin'
      if (activityFilter === 'system') return item.category === 'system'
      return true
    })
  }, [activityFilter])

  return (
    <div className="activity-feed-card">
      <div className="widget-header">
        <div className="widget-title-row">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 20 }}
            aria-hidden="true"
          >
            notifications_active
          </span>
          <h2 className="widget-heading">Aktivitas &amp; Notifikasi</h2>
        </div>
        <div className="activity-header-badges">
          <span className="badge-simulation-tag">DATA SIMULASI</span>
          <span className="widget-tag">LIVE FEED</span>
        </div>
      </div>

      <div className="activity-tabs-row" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activityFilter === 'all'}
          className={`activity-tab-btn ${activityFilter === 'all' ? 'is-active' : ''}`}
          onClick={() => setActivityFilter('all')}
        >
          Semua ({SYSTEM_NOTIFICATIONS.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activityFilter === 'admin'}
          className={`activity-tab-btn ${activityFilter === 'admin' ? 'is-active' : ''}`}
          onClick={() => setActivityFilter('admin')}
        >
          Admin ({adminActivitiesCount})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activityFilter === 'system'}
          className={`activity-tab-btn ${activityFilter === 'system' ? 'is-active' : ''}`}
          onClick={() => setActivityFilter('system')}
        >
          Sistem ({systemActivitiesCount})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activityFilter === 'saw'}
          className={`activity-tab-btn ${activityFilter === 'saw' ? 'is-active' : ''}`}
          onClick={() => setActivityFilter('saw')}
        >
          SAW ({sawActivitiesCount})
        </button>
      </div>

      <div className="activity-feed-list">
        {dashboardActivities.length === 0 ? (
          <div className="notification-empty">
            Tidak ada aktivitas pada kategori ini.
          </div>
        ) : (
          dashboardActivities.slice(0, 4).map((item) => {
            const isSaw = item.id.includes('saw') || item.title.includes('SAW')
            let badgeClass = 'activity-badge-system'
            let badgeLabel = 'SISTEM'
            if (isSaw) {
              badgeClass = 'activity-badge-saw'
              badgeLabel = 'SPK SAW'
            } else if (item.category === 'admin') {
              badgeClass = 'activity-badge-admin'
              badgeLabel = 'AKSI ADMIN'
            }

            return (
              <div key={item.id} className="activity-feed-item">
                <div className="activity-item-top">
                  <div className="activity-item-badges">
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
                  <span className="activity-item-time">{item.timeAgo}</span>
                </div>
                <h3 className="activity-item-title">{item.title}</h3>
                {item.description && (
                  <p className="activity-item-desc">{item.description}</p>
                )}
                <span className="activity-item-meta">{item.meta}</span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
