import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import type { SidebarNavEntryDropdown } from '../../types/admin'

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
  const submenuRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const [measuredHeight, setMeasuredHeight] = useState<number>(0)

  const hasActiveChild = dropdown.children.some(
    (child) => child.path === activePath,
  )

  useEffect(() => {
    if (submenuRef.current) {
      setMeasuredHeight(submenuRef.current.scrollHeight)
    }
  }, [dropdown.children.length, isOpen, isSidebarCollapsed])

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
        <div className="sidebar-item-left">
          <span className="material-symbols-outlined sidebar-item-icon">
            {dropdown.icon}
          </span>
          <span className="sidebar-label sidebar-item-label">
            {dropdown.label}
          </span>
        </div>
        <span
          className="sidebar-label material-symbols-outlined menu-chevron"
          aria-hidden="true"
        >
          expand_more
        </span>
      </button>

      <div
        ref={submenuRef}
        id={dropdown.id}
        role="region"
        aria-label={`Submenu ${dropdown.label}`}
        className={`submenu-container ${effectiveOpen ? 'open' : ''}`}
        style={{
          maxHeight: effectiveOpen ? `${measuredHeight + 8}px` : '0px',
        }}
      >
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
                <span className="submenu-bullet" aria-hidden="true" />
                <span>{child.label}</span>
              </span>
              {child.badge && (
                <span
                  className="submenu-badge"
                  style={{ backgroundColor: child.badge.bgColor }}
                >
                  {child.badge.text}
                </span>
              )}
            </a>
          )
        })}
      </div>
    </div>
  )
}
