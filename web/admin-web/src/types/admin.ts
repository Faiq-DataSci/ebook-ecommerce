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

export type DashboardPeriod = 'Hari Ini' | '7 Hari' | '30 Hari' | 'Kustom'

export interface KpiStatItem {
  id: string
  title: string
  headerBg: string
  icon: string
  value: string
  deltaBadgeText: string
  deltaBadgeBg: string
  deltaBadgeColor: string
  deltaLabel: string
  footerLeftText: string
  footerRightText: string
  segments: Array<{
    widthPercent: number
    bgColor: string
  }>
}

export interface DailySalesPoint {
  day: string
  totalLabel: string
  heightPercent: number
  regulerPercent: number
  bundlingPercent: number
  regulerTooltip: string
  bundlingTooltip: string
  isPeak?: boolean
  peakBadge?: string
}

export type TransactionStatus = 'LUNAS' | 'MENUNGGU' | 'KEDALUWARSA'

export interface TransactionRecord {
  code: string
  bookTitle: string
  customerName: string
  customerEmail: string
  paymentMethod: string
  amount: string
  status: TransactionStatus
}

export interface BestsellingBookItem {
  rank: string
  rankBg: string
  soldText: string
  title: string
  progressPercent: number
  barBg: string
}

export interface SystemNotificationItem {
  id: string
  title: string
  meta: string
}

export interface QuickActionItem {
  id: string
  label: string
  icon: string
  bgColor: string
  targetPath: string
}
