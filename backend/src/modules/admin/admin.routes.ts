import { Router } from 'express'
import { authenticate, authorize } from '../../middlewares/auth.middleware.js'
import {
  parseOptionalCoverUpload,
  parseOptionalPdfUpload,
} from '../../middlewares/upload.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import {
  archiveEbook,
  createCategory,
  createEbook,
  deleteCategory,
  getAdminCategories,
  getAdminCustomerById,
  getAdminCustomers,
  getAdminEbooks,
  getAdminOrderById,
  getAdminOrders,
  getAdminPayments,
  getAdminSalesReport,
  getAdminTransactions,
  getDashboard,
  getSawWeights,
  toggleAccessById,
  toggleCategoryStatus,
  toggleCustomerStatus,
  toggleEbookStatus,
  toggleOrderAccess,
  updateCategory,
  updateEbook,
  updateSawWeights,
  uploadEbookCover,
  uploadEbookPdf,
} from './admin.controller.js'
import {
  adminAccessIdParamSchema,
  adminCategoryIdParamSchema,
  adminCustomerIdParamSchema,
  adminEbookIdParamSchema,
  adminOrderIdParamSchema,
  createCategorySchema,
  createEbookSchema,
  getAdminCategoriesQuerySchema,
  getAdminCustomersQuerySchema,
  getAdminEbooksQuerySchema,
  getAdminOrdersQuerySchema,
  getAdminPaymentsQuerySchema,
  getAdminSalesReportQuerySchema,
  getAdminTransactionsQuerySchema,
  toggleAccessByIdSchema,
  toggleCategoryStatusSchema,
  toggleCustomerStatusSchema,
  toggleEbookStatusSchema,
  toggleOrderAccessSchema,
  updateCategorySchema,
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
adminRouter.post('/ebooks/upload-cover', parseOptionalCoverUpload, uploadEbookCover)
adminRouter.post('/ebooks/upload-pdf', parseOptionalPdfUpload, uploadEbookPdf)
adminRouter.post(
  '/ebooks',
  parseOptionalPdfUpload,
  validate({ body: createEbookSchema }),
  createEbook,
)
adminRouter.patch(
  '/ebooks/:id',
  validate({ params: adminEbookIdParamSchema, body: updateEbookSchema }),
  updateEbook,
)
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
adminRouter.delete(
  '/ebooks/:id',
  validate({ params: adminEbookIdParamSchema }),
  archiveEbook,
)

// Admin Categories CRUD Management
adminRouter.get(
  '/categories',
  validate({ query: getAdminCategoriesQuerySchema }),
  getAdminCategories,
)
adminRouter.post(
  '/categories',
  validate({ body: createCategorySchema }),
  createCategory,
)
adminRouter.patch(
  '/categories/:id',
  validate({ params: adminCategoryIdParamSchema, body: updateCategorySchema }),
  updateCategory,
)
adminRouter.put(
  '/categories/:id',
  validate({ params: adminCategoryIdParamSchema, body: updateCategorySchema }),
  updateCategory,
)
adminRouter.patch(
  '/categories/:id/status',
  validate({ params: adminCategoryIdParamSchema, body: toggleCategoryStatusSchema }),
  toggleCategoryStatus,
)
adminRouter.delete(
  '/categories/:id',
  validate({ params: adminCategoryIdParamSchema }),
  deleteCategory,
)

// Admin Customers / Users Management
adminRouter.get(
  '/customers',
  validate({ query: getAdminCustomersQuerySchema }),
  getAdminCustomers,
)
adminRouter.get(
  '/customers/:id',
  validate({ params: adminCustomerIdParamSchema }),
  getAdminCustomerById,
)
adminRouter.patch(
  '/customers/:id/status',
  validate({ params: adminCustomerIdParamSchema, body: toggleCustomerStatusSchema }),
  toggleCustomerStatus,
)

// Admin Orders, Payments, Transactions, Reports & E-Book Access Management
adminRouter.get(
  '/orders',
  validate({ query: getAdminOrdersQuerySchema }),
  getAdminOrders,
)
adminRouter.get(
  '/orders/:id',
  validate({ params: adminOrderIdParamSchema }),
  getAdminOrderById,
)
adminRouter.get(
  '/payments',
  validate({ query: getAdminPaymentsQuerySchema }),
  getAdminPayments,
)
adminRouter.get(
  '/transactions',
  validate({ query: getAdminTransactionsQuerySchema }),
  getAdminTransactions,
)
adminRouter.get(
  '/reports/sales',
  validate({ query: getAdminSalesReportQuerySchema }),
  getAdminSalesReport,
)
adminRouter.patch(
  '/orders/:id/access',
  validate({ params: adminOrderIdParamSchema, body: toggleOrderAccessSchema }),
  toggleOrderAccess,
)
adminRouter.patch(
  '/accesses/:id',
  validate({ params: adminAccessIdParamSchema, body: toggleAccessByIdSchema }),
  toggleAccessById,
)

