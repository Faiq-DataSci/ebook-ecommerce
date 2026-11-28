import { env } from '../../config/env.js'
import { AppError } from '../../utils/app-error.js'

export interface CreateXenditQrisInput {
  referenceId: string
  amount: number
  expiresAt?: Date
}

export interface XenditQrisResult {
  qrId: string
  referenceId: string
  qrString: string
  status: string
  amount: number
  currency: string
  channelCode: string
  expiresAt: string | null
}

const XENDIT_DEFAULT_BASE_URL = 'https://api.xendit.co'
const XENDIT_QR_API_VERSION = '2022-07-31'

function getXenditConfig() {
  const serverKey = process.env.PAYMENT_GATEWAY_SERVER_KEY || env.PAYMENT_GATEWAY_SERVER_KEY
  const rawBaseUrl =
    process.env.PAYMENT_GATEWAY_BASE_URL || env.PAYMENT_GATEWAY_BASE_URL || XENDIT_DEFAULT_BASE_URL

  if (!serverKey) {
    throw new AppError(
      500,
      'PAYMENT_GATEWAY_NOT_CONFIGURED',
      'PAYMENT_GATEWAY_SERVER_KEY belum dikonfigurasi untuk Xendit',
    )
  }

  return {
    serverKey,
    baseUrl: rawBaseUrl.replace(/\/+$/, ''),
    authHeader: `Basic ${Buffer.from(`${serverKey}:`).toString('base64')}`,
  }
}

export async function createXenditDynamicQris(
  input: CreateXenditQrisInput,
): Promise<XenditQrisResult> {
  const { baseUrl, authHeader } = getXenditConfig()

  const payload: Record<string, unknown> = {
    reference_id: input.referenceId,
    type: 'DYNAMIC',
    currency: 'IDR',
    amount: Math.round(input.amount),
  }

  if (input.expiresAt) {
    payload.expires_at = input.expiresAt.toISOString()
  }

  const response = await fetch(`${baseUrl}/qr_codes`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: authHeader,
      'api-version': XENDIT_QR_API_VERSION,
    },
    body: JSON.stringify(payload),
  })

  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>

  if (!response.ok) {
    const message =
      (typeof data.message === 'string' && data.message) ||
      (typeof data.error_code === 'string' && data.error_code) ||
      `HTTP ${response.status}`
    throw new AppError(
      502,
      'PAYMENT_GATEWAY_ERROR',
      `Gagal membuat QRIS Xendit [${response.status}]: ${message}`,
    )
  }

  const qrId = typeof data.id === 'string' ? data.id : ''
  const qrString = typeof data.qr_string === 'string' ? data.qr_string : ''

  if (!qrId || !qrString) {
    throw new AppError(
      502,
      'PAYMENT_GATEWAY_INVALID_RESPONSE',
      'Respons Xendit QRIS tidak menyertakan id atau qr_string',
    )
  }

  return {
    qrId,
    referenceId: typeof data.reference_id === 'string' ? data.reference_id : input.referenceId,
    qrString,
    status: typeof data.status === 'string' ? data.status : 'ACTIVE',
    amount: typeof data.amount === 'number' ? data.amount : Math.round(input.amount),
    currency: typeof data.currency === 'string' ? data.currency : 'IDR',
    channelCode: typeof data.channel_code === 'string' ? data.channel_code : 'ID_QRIS',
    expiresAt: typeof data.expires_at === 'string' ? data.expires_at : null,
  }
}

export async function simulateXenditQrisPayment(
  qrId: string,
  amount: number,
): Promise<Record<string, unknown>> {
  const { baseUrl, authHeader } = getXenditConfig()

  const response = await fetch(`${baseUrl}/qr_codes/${encodeURIComponent(qrId)}/payments/simulate`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: authHeader,
      'api-version': XENDIT_QR_API_VERSION,
    },
    body: JSON.stringify({ amount: Math.round(amount) }),
  })

  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>

  if (!response.ok) {
    const message =
      (typeof data.message === 'string' && data.message) ||
      (typeof data.error_code === 'string' && data.error_code) ||
      `HTTP ${response.status}`
    throw new AppError(
      502,
      'PAYMENT_GATEWAY_ERROR',
      `Gagal simulasi pembayaran QRIS Xendit [${response.status}]: ${message}`,
    )
  }

  return data
}
