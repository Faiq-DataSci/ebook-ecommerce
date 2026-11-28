import type { NextFunction, Request, Response } from 'express'
import type { RequestWithRawBody } from '../../app.js'
import { AppError } from '../../utils/app-error.js'
import { sendSuccess } from '../../utils/response.js'
import {
  isXenditWebhookPayload,
  normalizeWebhookPayload,
  type PaymentWebhookPayload,
} from './payment.schema.js'
import { paymentService } from './payment.service.js'

export async function paymentWebhookController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const payload = req.body as PaymentWebhookPayload
    const rawCallbackToken = req.headers['x-callback-token']
    const callbackToken = Array.isArray(rawCallbackToken)
      ? rawCallbackToken[0]
      : rawCallbackToken

    if (callbackToken !== undefined || isXenditWebhookPayload(payload)) {
      const isValidToken = paymentService.verifyXenditCallbackToken(callbackToken)
      if (!isValidToken) {
        throw new AppError(401, 'WEBHOOK_SIGNATURE_INVALID', 'Token callback Xendit tidak valid')
      }
    } else {
      const rawSignature = req.headers['x-webhook-signature']
      const signature = Array.isArray(rawSignature) ? rawSignature[0] : rawSignature
      const rawBody = (req as RequestWithRawBody).rawBody || JSON.stringify(req.body)

      const isValid = paymentService.verifyWebhookSignature(signature, rawBody)
      if (!isValid) {
        throw new AppError(401, 'WEBHOOK_SIGNATURE_INVALID', 'Tanda tangan webhook tidak valid')
      }
    }

    const normalized = normalizeWebhookPayload(payload)
    const result = await paymentService.processWebhook(normalized)
    sendSuccess(res, result, 200, undefined, result.message)
  } catch (err) {
    next(err)
  }
}
