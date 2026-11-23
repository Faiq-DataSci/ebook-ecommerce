import { Router } from 'express'
import { authenticate, authorize } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { getDashboard, getSawWeights, updateSawWeights } from './admin.controller.js'
import { updateSawWeightsSchema } from './admin.schema.js'

export const adminRouter = Router()

// Otorisasi ketat: Seluruh rute admin wajib autentikasi dan role ADMIN
adminRouter.use(authenticate, authorize('ADMIN'))

adminRouter.get('/ping', (_req, res) => {
  res.status(200).json({ success: true, statusCode: 200, data: { pong: true } })
})

adminRouter.get('/dashboard', getDashboard)
adminRouter.get('/saw/weights', getSawWeights)
adminRouter.put('/saw/weights', validate({ body: updateSawWeightsSchema }), updateSawWeights)
