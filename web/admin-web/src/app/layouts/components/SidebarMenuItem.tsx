import type { MouseEvent } from 'react'
import type { SidebarNavEntrySingle } from '../../../shared/types/navigation'

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
      <span className="sidebar-item-left">
        <span
          className="material-symbols-outlined sidebar-item-icon"
          aria-hidden="true"
        >
          {item.icon}
        </span>
        <span className="sidebar-label sidebar-item-label">{item.label}</span>
      </span>
    </a>
  )
}
