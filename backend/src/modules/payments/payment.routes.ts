import { Router } from 'express'
import { validate } from '../../middlewares/validate.middleware.js'
import { paymentWebhookController } from './payment.controller.js'
import { paymentWebhookSchema } from './payment.schema.js'

export const paymentRouter = Router()

paymentRouter.post('/webhook', validate({ body: paymentWebhookSchema }), paymentWebhookController)
