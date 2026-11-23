import { useCallback, useEffect, useState } from 'react'
import { resolveRouteMeta } from '../navigation/adminNavigation'

export interface UseSidebarReturn {
  isCollapsed: boolean
  isMobileOpen: boolean
  expandedDropdowns: Record<string, boolean>
  activePath: string
  toggleSidebarCollapse: () => void
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
  toggleDropdown: (dropdownId: string) => void
  closeDropdown: (dropdownId: string) => void
  navigateTo: (path: string) => void
}

export function useSidebar(): UseSidebarReturn {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('admin_sidebar_collapsed') === 'true'
  })
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false)
  const [activePath, setActivePath] = useState<string>(() => {
    const initial = window.location.pathname
    return initial === '/' || initial === '/admin'
      ? '/admin/dashboard'
      : initial
  })

  // Normalize root URL to /admin/dashboard in history without reloading
  useEffect(() => {
    if (window.location.pathname === '/' || window.location.pathname === '/admin') {
      window.history.replaceState({}, '', '/admin/dashboard')
    }
  }, [])

  // Multiple dropdowns can remain expanded simultaneously
  const [expandedDropdowns, setExpandedDropdowns] = useState<
    Record<string, boolean>
  >(() => {
    const meta = resolveRouteMeta(window.location.pathname)
    return meta.parentDropdownId ? { [meta.parentDropdownId]: true } : {}
  })

  // Synchronize with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const nextPath =
        window.location.pathname === '/' ||
        window.location.pathname === '/admin'
          ? '/admin/dashboard'
          : window.location.pathname
      setActivePath(nextPath)
      const meta = resolveRouteMeta(nextPath)
      if (meta.parentDropdownId) {
        setExpandedDropdowns((prev) => ({
          ...prev,
          [meta.parentDropdownId!]: true,
        }))
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const toggleSidebarCollapse = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('admin_sidebar_collapsed', String(next))
      return next
    })
  }, [])

  const toggleMobileSidebar = useCallback(() => {
    setIsMobileOpen((prev) => !prev)
  }, [])

  const closeMobileSidebar = useCallback(() => {
    setIsMobileOpen(false)
  }, [])

  const toggleDropdown = useCallback(
    (dropdownId: string) => {
      if (isCollapsed) {
        setIsCollapsed(false)
        localStorage.setItem('admin_sidebar_collapsed', 'false')
        setExpandedDropdowns((prev) => ({
          ...prev,
          [dropdownId]: true,
        }))
        return
      }

      setExpandedDropdowns((prev) => ({
        ...prev,
        [dropdownId]: !prev[dropdownId],
      }))
    },
    [isCollapsed],
  )

  const closeDropdown = useCallback((dropdownId: string) => {
    setExpandedDropdowns((prev) => ({
      ...prev,
      [dropdownId]: false,
    }))
  }, [])

  const navigateTo = useCallback((path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path)
    }
    window.dispatchEvent(new PopStateEvent('popstate'))
    setActivePath(path)
    const meta = resolveRouteMeta(path)
    if (meta.parentDropdownId) {
      setExpandedDropdowns((prev) => ({
        ...prev,
        [meta.parentDropdownId!]: true,
      }))
    }
    setIsMobileOpen(false)
  }, [])

  return {
    isCollapsed,
    isMobileOpen,
    expandedDropdowns,
    activePath,
    toggleSidebarCollapse,
    toggleMobileSidebar,
    closeMobileSidebar,
    toggleDropdown,
    closeDropdown,
    navigateTo,
  }
}
