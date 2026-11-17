import type { NextFunction, Request, Response } from 'express'
import type { RequestWithRawBody } from '../../app.js'
import { AppError } from '../../utils/app-error.js'
import { sendSuccess } from '../../utils/response.js'
import type { PaymentWebhookInput } from './payment.schema.js'
import { paymentService } from './payment.service.js'

export async function paymentWebhookController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const rawSignature = req.headers['x-webhook-signature']
    const signature = Array.isArray(rawSignature) ? rawSignature[0] : rawSignature

    const rawBody = (req as RequestWithRawBody).rawBody || JSON.stringify(req.body)

    const isValid = paymentService.verifyWebhookSignature(signature, rawBody)
    if (!isValid) {
      throw new AppError(401, 'WEBHOOK_SIGNATURE_INVALID', 'Tanda tangan webhook tidak valid')
    }

    const result = await paymentService.processWebhook(req.body as PaymentWebhookInput)
    sendSuccess(res, result, 200, undefined, result.message)
  } catch (err) {
    next(err)
  }
}
