export type OrderStatus = 'ALL' | 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'CANCELLED'

export type PaymentStatus = 'ALL' | 'PENDING' | 'VERIFIED' | 'FAILED' | 'EXPIRED'

export type TransactionTab = 'pesanan' | 'verifikasi' | 'laporan'

export type FinanceTab = 'omzet' | 'settlement'

export interface SettlementRecord {
  id: string
  batchReference: string
  date: string
  totalGross: number
  totalGrossFormatted: string
  gatewayMdrFee: number
  gatewayMdrFeeFormatted: string
  netPayout: number
  netPayoutFormatted: string
  orderCount: number
  destinationBank: string
  bankAccountNumber: string
  status: 'SETTLED' | 'PROCESSING' | 'SCHEDULED'
}

export interface OrderItemSnapshot {
  ebookId: string
  title: string
  author: string
  coverUrl?: string
  price: number
  priceFormatted: string
}

export interface WebhookTimelineNode {
  stage: string
  timestamp: string
  description: string
  status: 'completed' | 'current' | 'pending' | 'failed'
  meta?: string
}

export interface OrderRecord {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  items: OrderItemSnapshot[]
  totalAmount: number
  totalAmountFormatted: string
  status: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'CANCELLED'
  paymentMethod: string
  paymentGatewayRef?: string
  paymentExpiresAt?: string
  paidAt?: string
  createdAt: string
  ebookAccessGranted: boolean
  ebookAccessRevoked?: boolean
  timeline: WebhookTimelineNode[]
  rawWebhookPayload?: Record<string, unknown>
}

export interface PaymentAuditRecord {
  id: string
  paymentCode: string
  orderNumber: string
  customerName: string
  customerEmail: string
  provider: 'xendit' | 'simulator'
  paymentMethod: string
  amount: number
  amountFormatted: string
  status: 'PENDING' | 'VERIFIED' | 'FAILED' | 'EXPIRED'
  externalRef: string
  signatureVerified: boolean
  receivedAt: string
  rawWebhookPayload: Record<string, unknown>
  qrPayload?: {
    qrId?: string
    qrString?: string
    referenceId?: string
    channelCode?: string
    status?: string
    expiresAt?: string | null
  } | null
}

export interface PaymentMethodShare {
  name: string
  sharePercent: number
  orderCount: number
  totalAmount: string
  color: string
  icon: string
}

export interface RevenueMetricPeriod {
  period: string
  grossRevenue: string
  netRevenue: string
  successfulOrders: number
  averageOrderValue: string
  successRate: string
}
