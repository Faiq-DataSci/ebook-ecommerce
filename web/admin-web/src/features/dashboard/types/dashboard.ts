export type DashboardPeriod = 'Hari Ini' | '7 Hari' | '30 Hari' | 'Kustom'

export interface KpiStatItem {
  id: string
  title: string
  headerBg: string
  icon?: string
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
  date?: string
  totalLabel: string
  totalNumeric?: number
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

export interface CustomerActivityItem {
  name: string
  time: string
  action: string
  avatarBg: string
  initials: string
}

export interface QuickActionItem {
  id: string
  label: string
  description?: string
  icon: string
  bgColor: string
  badgeText?: string
  targetPath: string
}

export interface SystemNotificationItem {
  id: string
  title: string
  meta: string
  unread?: boolean
  category: 'admin' | 'system'
  icon: string
  timeAgo: string
  description?: string
}
