import { apiClient, ApiError } from '../../../services/api/apiClient'
import { formatRupiah } from '../../../shared/utils/formatters'
import type {
  OrderRecord,
  PaymentAuditRecord,
  WebhookTimelineNode,
} from '../types/transactionFinance'

interface RawAdminOrder {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone?: string | null
  totalAmount: number | string
  status: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'CANCELLED'
  paymentMethod: string
  paymentGatewayRef?: string | null
  paymentExpiresAt?: string | null
  paidAt?: string | null
  createdAt: string
  updatedAt: string
  transactionCode?: string | null
  ebookAccessGranted: boolean
  ebookAccessRevoked: boolean
  accessCount?: number
  rawWebhookPayload?: Record<string, unknown> | null
  items: Array<{
    ebookId: string
    title: string
    author: string
    coverUrl?: string | null
    price: number | string
  }>
}

interface RawAdminPayment {
  id: string
  paymentCode: string
  orderNumber: string
  customerName: string
  customerEmail: string
  provider: 'midtrans' | 'simulator'
  paymentMethod: string
  amount: number | string
  status: 'PENDING' | 'VERIFIED' | 'FAILED' | 'EXPIRED'
  externalRef: string
  signatureVerified: boolean
  receivedAt: string
  rawWebhookPayload: Record<string, unknown>
}

function formatDateTimeId(iso?: string | null): string {
  if (!iso) return '-'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return (
    date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) +
    ', ' +
    date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    }) +
    ' WIB'
  )
}

function buildOrderTimeline(raw: RawAdminOrder): WebhookTimelineNode[] {
  const nodes: WebhookTimelineNode[] = [
    {
      stage: 'Pesanan Dibuat',
      timestamp: formatDateTimeId(raw.createdAt),
      description: `Pesanan ${raw.orderNumber} dibuat oleh ${raw.customerName} (${raw.items.length} item e-book).`,
      status: 'completed',
    },
  ]

  if (raw.status === 'PAID') {
    nodes.push({
      stage: 'Pembayaran Terverifikasi',
      timestamp: formatDateTimeId(raw.paidAt ?? raw.updatedAt),
      description: `Pembayaran via ${raw.paymentMethod} berhasil diverifikasi backend.`,
      status: 'completed',
      meta: raw.paymentGatewayRef ?? raw.transactionCode ?? undefined,
    })

    if (raw.ebookAccessGranted) {
      nodes.push({
        stage: raw.ebookAccessRevoked
          ? 'Hak Akses E-Book Dicabut Admin'
          : 'Hak Akses E-Book Aktif',
        timestamp: formatDateTimeId(raw.updatedAt),
        description: raw.ebookAccessRevoked
          ? 'Hak akses membaca PDF untuk pesanan ini sedang dicabut oleh administrator.'
          : 'EbookAccess aktif di database. Pelanggan dapat mengakses PDF via signed URL.',
        status: raw.ebookAccessRevoked ? 'failed' : 'completed',
      })
    }
  } else if (raw.status === 'PENDING') {
    nodes.push({
      stage: 'Menunggu Pembayaran',
      timestamp: formatDateTimeId(raw.paymentExpiresAt),
      description: `Menunggu penyelesaian pembayaran melalui ${raw.paymentMethod}.`,
      status: 'current',
      meta: raw.paymentGatewayRef ?? undefined,
    })
  } else {
    nodes.push({
      stage: `Status Pesanan: ${raw.status}`,
      timestamp: formatDateTimeId(raw.updatedAt),
      description:
        raw.status === 'EXPIRED'
          ? 'Batas waktu pembayaran habis sebelum transaksi diselesaikan.'
          : 'Pesanan gagal atau dibatalkan.',
      status: 'failed',
      meta: raw.paymentGatewayRef ?? undefined,
    })
  }

  return nodes
}

function mapRawOrderToRecord(raw: RawAdminOrder): OrderRecord {
  const totalAmount = Number(raw.totalAmount ?? 0)
  return {
    id: raw.id,
    orderNumber: raw.orderNumber,
    customerName: raw.customerName,
    customerEmail: raw.customerEmail,
    customerPhone: raw.customerPhone ?? undefined,
    items: (raw.items ?? []).map((item) => {
      const price = Number(item.price ?? 0)
      return {
        ebookId: item.ebookId,
        title: item.title,
        author: item.author,
        coverUrl: item.coverUrl ?? undefined,
        price,
        priceFormatted: formatRupiah(price),
      }
    }),
    totalAmount,
    totalAmountFormatted: formatRupiah(totalAmount),
    status: raw.status,
    paymentMethod: raw.paymentMethod,
    paymentGatewayRef: raw.paymentGatewayRef ?? undefined,
    paymentExpiresAt: raw.paymentExpiresAt
      ? formatDateTimeId(raw.paymentExpiresAt)
      : undefined,
    paidAt: raw.paidAt ? formatDateTimeId(raw.paidAt) : undefined,
    createdAt: formatDateTimeId(raw.createdAt),
    ebookAccessGranted: Boolean(raw.ebookAccessGranted),
    ebookAccessRevoked: Boolean(raw.ebookAccessRevoked),
    timeline: buildOrderTimeline(raw),
    rawWebhookPayload: raw.rawWebhookPayload ?? undefined,
  }
}

function mapRawPaymentToRecord(raw: RawAdminPayment): PaymentAuditRecord {
  const amount = Number(raw.amount ?? 0)
  return {
    id: raw.id,
    paymentCode: raw.paymentCode,
    orderNumber: raw.orderNumber,
    customerName: raw.customerName,
    customerEmail: raw.customerEmail,
    provider: raw.provider === 'simulator' ? 'simulator' : 'midtrans',
    paymentMethod: raw.paymentMethod,
    amount,
    amountFormatted: formatRupiah(amount),
    status: raw.status,
    externalRef: raw.externalRef,
    signatureVerified: Boolean(raw.signatureVerified),
    receivedAt: formatDateTimeId(raw.receivedAt),
    rawWebhookPayload: raw.rawWebhookPayload ?? {},
  }
}

export async function fetchAdminTransactionsData(): Promise<{
  orders: OrderRecord[]
  payments: PaymentAuditRecord[]
}> {
  const [ordersRes, paymentsRes] = await Promise.all([
    apiClient.get<RawAdminOrder[]>('/admin/orders?page=1&limit=100'),
    apiClient.get<RawAdminPayment[]>('/admin/payments?page=1&limit=100'),
  ])

  const orders = Array.isArray(ordersRes.data)
    ? ordersRes.data.map(mapRawOrderToRecord)
    : []
  const payments = Array.isArray(paymentsRes.data)
    ? paymentsRes.data.map(mapRawPaymentToRecord)
    : []

  return { orders, payments }
}

export interface AdminOfficialTransactionRecord {
  id: string
  transactionCode: string
  orderId: string
  orderNumber: string
  orderStatus: string
  paymentId: string
  paymentProvider: string
  paymentMethod: string
  paymentRef: string | null
  customerId: string
  customerName: string
  customerEmail: string
  amount: number
  amountFormatted: string
  recordedAt: string
  paidAt: string
  items: Array<{
    ebookId: string
    title: string
    unitPrice: number
  }>
}

export interface AdminSalesReportResponse {
  period: {
    startDate: string | null
    endDate: string | null
    groupBy: 'day' | 'month'
  }
  summary: {
    totalRevenue: number
    totalTransactions: number
    averageOrderValue: number
  }
  series: Array<{
    period: string
    revenue: number
    transactionsCount: number
  }>
  topEbooks: Array<{
    ebookId: string
    title: string
    categoryName: string
    unitsSold: number
    revenue: number
  }>
}

export async function fetchAdminOfficialTransactions(params?: {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  search?: string
}): Promise<AdminOfficialTransactionRecord[]> {
  const qs = new URLSearchParams()
  if (params?.page) qs.set('page', String(params.page))
  if (params?.limit) qs.set('limit', String(params.limit))
  if (params?.startDate) qs.set('startDate', params.startDate)
  if (params?.endDate) qs.set('endDate', params.endDate)
  if (params?.search) qs.set('search', params.search)
  const suffix = qs.toString() ? `?${qs.toString()}` : ''

  const res = await apiClient.get<
    Array<{
      id: string
      transactionCode: string
      orderId: string
      orderNumber: string
      orderStatus: string
      paymentId: string
      paymentProvider: string
      paymentMethod: string
      paymentRef: string | null
      customerId: string
      customerName: string
      customerEmail: string
      amount: number | string
      recordedAt: string
      paidAt: string | null
      items: Array<{ ebookId: string; title: string; unitPrice: number | string }>
    }>
  >(`/admin/transactions${suffix}`)

  if (!Array.isArray(res.data)) return []

  return res.data.map((trx) => {
    const amount = Number(trx.amount ?? 0)
    return {
      ...trx,
      amount,
      amountFormatted: formatRupiah(amount),
      recordedAt: formatDateTimeId(trx.recordedAt),
      paidAt: formatDateTimeId(trx.paidAt ?? trx.recordedAt),
      items: (trx.items ?? []).map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice ?? 0),
      })),
    }
  })
}

export async function fetchAdminSalesReport(params?: {
  startDate?: string
  endDate?: string
  groupBy?: 'day' | 'month'
}): Promise<AdminSalesReportResponse> {
  const qs = new URLSearchParams()
  if (params?.startDate) qs.set('startDate', params.startDate)
  if (params?.endDate) qs.set('endDate', params.endDate)
  if (params?.groupBy) qs.set('groupBy', params.groupBy)
  const suffix = qs.toString() ? `?${qs.toString()}` : ''

  const res = await apiClient.get<AdminSalesReportResponse>(
    `/admin/reports/sales${suffix}`,
  )
  return res.data
}

export async function toggleAdminOrderAccess(
  orderId: string,
  isRevoked: boolean,
): Promise<{ order: OrderRecord; message: string }> {
  try {
    const res = await apiClient.patch<RawAdminOrder>(
      `/admin/orders/${orderId}/access`,
      { isRevoked },
    )
    return {
      order: mapRawOrderToRecord(res.data),
      message:
        res.message ||
        (isRevoked
          ? 'Hak akses e-book berhasil dicabut di database.'
          : 'Hak akses e-book berhasil dipulihkan di database.'),
    }
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw new Error(err.message, { cause: err })
    }
    throw err instanceof Error
      ? err
      : new Error('Gagal mengubah status hak akses e-book pada server.', {
          cause: err,
        })
  }
}
