import { useRef, type KeyboardEvent, type MouseEvent } from 'react'
import type { SidebarNavEntryDropdown } from '../../../shared/types/navigation'

interface SidebarDropdownProps {
  dropdown: SidebarNavEntryDropdown
  isOpen: boolean
  isSidebarCollapsed: boolean
  activePath: string
  onToggle: (dropdownId: string) => void
  onClose: (dropdownId: string) => void
  onNavigate: (path: string) => void
}

export function SidebarDropdown({
  dropdown,
  isOpen,
  isSidebarCollapsed,
  activePath,
  onToggle,
  onClose,
  onNavigate,
}: SidebarDropdownProps) {
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const hasActiveChild = dropdown.children.some(
    (child) => child.path === activePath,
  )

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && isOpen) {
      e.stopPropagation()
      onClose(dropdown.id)
      triggerRef.current?.focus()
    }
  }

  const handleSubmenuClick = (
    e: MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => {
    e.preventDefault()
    onNavigate(path)
  }

  const effectiveOpen = isOpen && !isSidebarCollapsed

  return (
    <div className="accordion-group" onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        className={`accordion-trigger nb-btn ${effectiveOpen ? 'is-open' : ''} ${
          hasActiveChild && !effectiveOpen ? 'has-active-child' : ''
        }`}
        data-target={dropdown.id}
        title={dropdown.label}
        aria-expanded={effectiveOpen}
        aria-controls={dropdown.id}
        onClick={() => onToggle(dropdown.id)}
      >
        <span className="sidebar-item-left">
          <span
            className="material-symbols-outlined sidebar-item-icon"
            aria-hidden="true"
          >
            {dropdown.icon}
          </span>
          <span className="sidebar-label sidebar-item-label">
            {dropdown.label}
          </span>
        </span>
        <span
          className="sidebar-label material-symbols-outlined menu-chevron"
          aria-hidden="true"
        >
          expand_more
        </span>
      </button>

      <div
        id={dropdown.id}
        role="region"
        aria-label={`Submenu ${dropdown.label}`}
        aria-hidden={!effectiveOpen}
        className={`submenu-container ${effectiveOpen ? 'open' : ''}`}
      >
        <div className="submenu-inner">
          {dropdown.children.map((child) => {
            const isChildActive = child.path === activePath
            return (
              <a
                key={child.id}
                href={child.path}
                onClick={(e) => handleSubmenuClick(e, child.path)}
                className={`submenu-link ${dropdown.hoverVariant} ${
                  isChildActive ? 'is-active' : ''
                }`}
                aria-current={isChildActive ? 'page' : undefined}
                tabIndex={effectiveOpen ? 0 : -1}
              >
                <span className="sidebar-label submenu-link-label">
                  <span className="submenu-link-text">{child.label}</span>
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
