import type { MouseEvent } from 'react'
import type { SidebarNavEntrySingle } from '../../types/admin'

interface SidebarMenuItemProps {
  item: SidebarNavEntrySingle
  isActive: boolean
  onNavigate: (path: string) => void
}

export function SidebarMenuItem({
  item,
  isActive,
  onNavigate,
}: SidebarMenuItemProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    onNavigate(item.path)
  }

  return (
    <a
      href={item.path}
      onClick={handleClick}
      className={`sidebar-menu-item nb-btn ${isActive ? 'is-active' : ''}`}
      title={item.label}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className="sidebar-item-left">
        <span className="material-symbols-outlined sidebar-item-icon">
          {item.icon}
        </span>
        <span className="sidebar-label sidebar-item-label">{item.label}</span>
      </div>
      {isActive && (
        <span
          className="sidebar-label sidebar-active-square"
          aria-hidden="true"
        />
      )}
    </a>
  )
}
