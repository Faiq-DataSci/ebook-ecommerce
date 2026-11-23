import { Router } from 'express'
import { validate } from '../../middlewares/validate.middleware.js'
import { getSawRecommendationsController } from './recommendation.controller.js'
import { getSawRecommendationsQuerySchema } from './recommendation.schema.js'

export const recommendationRouter = Router()

// GET /api/v1/recommendations/saw
recommendationRouter.get(
  '/saw',
  validate({ query: getSawRecommendationsQuerySchema }),
  getSawRecommendationsController,
)
