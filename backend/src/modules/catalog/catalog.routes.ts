import { Router } from 'express'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { getSignedAccessUrlController } from '../ebook-access/ebook-access.controller.js'
import { ebookAccessParamSchema } from '../ebook-access/ebook-access.schema.js'
import {
  getCategoriesController,
  getEbookDetailController,
  getEbooksController,
} from './catalog.controller.js'
import { ebookIdParamSchema, getEbooksQuerySchema } from './catalog.schema.js'

export const categoriesRouter = Router()
categoriesRouter.get('/', getCategoriesController)

export const ebooksRouter = Router()
ebooksRouter.get('/', validate({ query: getEbooksQuerySchema }), getEbooksController)
ebooksRouter.get('/:id', validate({ params: ebookIdParamSchema }), getEbookDetailController)
ebooksRouter.get(
  '/:id/access-url',
  authenticate,
  validate({ params: ebookAccessParamSchema }),
  getSignedAccessUrlController,
)
