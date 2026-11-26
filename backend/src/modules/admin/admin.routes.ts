import { Router } from 'express'
import { authenticate, authorize } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import {
  createEbook,
  getAdminEbooks,
  getDashboard,
  getSawWeights,
  toggleEbookStatus,
  updateEbook,
  updateSawWeights,
} from './admin.controller.js'
import {
  adminEbookIdParamSchema,
  createEbookSchema,
  getAdminEbooksQuerySchema,
  toggleEbookStatusSchema,
  updateEbookSchema,
  updateSawWeightsSchema,
} from './admin.schema.js'

export const adminRouter = Router()

// Otorisasi ketat: Seluruh rute admin wajib autentikasi dan role ADMIN
adminRouter.use(authenticate, authorize('ADMIN'))

adminRouter.get('/ping', (_req, res) => {
  res.status(200).json({ success: true, statusCode: 200, data: { pong: true } })
})

adminRouter.get('/dashboard', getDashboard)
adminRouter.get('/saw/weights', getSawWeights)
adminRouter.put('/saw/weights', validate({ body: updateSawWeightsSchema }), updateSawWeights)

// Admin E-Books CRUD Management
adminRouter.get('/ebooks', validate({ query: getAdminEbooksQuerySchema }), getAdminEbooks)
adminRouter.post('/ebooks', validate({ body: createEbookSchema }), createEbook)
adminRouter.put(
  '/ebooks/:id',
  validate({ params: adminEbookIdParamSchema, body: updateEbookSchema }),
  updateEbook,
)
adminRouter.patch(
  '/ebooks/:id/status',
  validate({ params: adminEbookIdParamSchema, body: toggleEbookStatusSchema }),
  toggleEbookStatus,
)

