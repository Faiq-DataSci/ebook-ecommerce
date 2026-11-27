import { useCallback, useEffect, useRef, useState } from 'react'
import { resolveRouteMeta } from '../navigation/adminNavigation'

const ROUTE_SKELETON_MS = 240

export interface UseSidebarReturn {
  isCollapsed: boolean
  isMobileOpen: boolean
  isRouteTransitioning: boolean
  expandedDropdowns: Record<string, boolean>
  activePath: string
  toggleSidebarCollapse: () => void
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
  toggleDropdown: (dropdownId: string) => void
  closeDropdown: (dropdownId: string) => void
  navigateTo: (path: string) => void
}

function normalizeAdminPath(rawPath: string): string {
  return rawPath === '/' || rawPath === '/admin' ? '/admin/dashboard' : rawPath
}

export function useSidebar(): UseSidebarReturn {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('admin_sidebar_collapsed') === 'true'
  })
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false)
  const [isRouteTransitioning, setIsRouteTransitioning] = useState<boolean>(false)
  const [activePath, setActivePath] = useState<string>(() =>
    normalizeAdminPath(window.location.pathname),
  )

  const activePathRef = useRef<string>(activePath)
  const transitionTimerRef = useRef<number | null>(null)

  const triggerRouteSkeleton = useCallback((nextPath: string) => {
    if (nextPath === activePathRef.current) {
      return
    }
    activePathRef.current = nextPath

    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current)
      transitionTimerRef.current = null
    }

    if (nextPath === '/login') {
      setIsRouteTransitioning(false)
      return
    }

    setIsRouteTransitioning(true)
    transitionTimerRef.current = window.setTimeout(() => {
      transitionTimerRef.current = null
      setIsRouteTransitioning(false)
    }, ROUTE_SKELETON_MS)
  }, [])

  // Cleanup route transition timer on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current)
      }
    }
  }, [])

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
      const nextPath = normalizeAdminPath(window.location.pathname)
      triggerRouteSkeleton(nextPath)
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
  }, [triggerRouteSkeleton])

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

  const navigateTo = useCallback(
    (path: string) => {
      const normalizedPath = normalizeAdminPath(path)
      if (window.location.pathname !== normalizedPath) {
        window.history.pushState({}, '', normalizedPath)
      }
      triggerRouteSkeleton(normalizedPath)
      window.dispatchEvent(new PopStateEvent('popstate'))
      setActivePath(normalizedPath)
      const meta = resolveRouteMeta(normalizedPath)
      if (meta.parentDropdownId) {
        setExpandedDropdowns((prev) => ({
          ...prev,
          [meta.parentDropdownId!]: true,
        }))
      }
      setIsMobileOpen(false)
    },
    [triggerRouteSkeleton],
  )

  return {
    isCollapsed,
    isMobileOpen,
    isRouteTransitioning,
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
