export type SubmenuHoverVariant =
  | 'hover-amber'
  | 'hover-sky'
  | 'hover-purple'
  | 'hover-emerald'

export interface SidebarBadge {
  text: string
  bgColor: string
}

export interface SidebarSubmenuItem {
  id: string
  label: string
  path: string
  breadcrumb: string
  badge?: SidebarBadge
  implemented: boolean
}

export interface SidebarNavEntrySingle {
  type: 'single'
  id: string
  label: string
  path: string
  icon: string
  breadcrumb: string
  implemented: boolean
}

export interface SidebarNavEntryDropdown {
  type: 'dropdown'
  id: string
  label: string
  icon: string
  hoverVariant: SubmenuHoverVariant
  children: SidebarSubmenuItem[]
}

export type SidebarNavEntry = SidebarNavEntrySingle | SidebarNavEntryDropdown

export interface SidebarNavGroup {
  id: string
  heading: string
  entries: SidebarNavEntry[]
}

export interface ResolvedRouteMeta {
  id: string
  label: string
  path: string
  breadcrumb: string
  parentDropdownId?: string
  parentLabel?: string
  implemented: boolean
}
