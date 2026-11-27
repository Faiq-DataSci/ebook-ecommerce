import type { NextFunction, Request, Response } from 'express'
import { sendSuccess } from '../../utils/response.js'
import type { GetSawRecommendationsQuery } from './recommendation.schema.js'
import { recommendationService } from './recommendation.service.js'

export async function getSawRecommendationsController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const query = req.query as unknown as GetSawRecommendationsQuery
    const { items: recommendations, activeCriteria } =
      await recommendationService.getSawRecommendationsWithCriteria(query)
    sendSuccess(
      res,
      recommendations,
      200,
      {
        total: recommendations.length,
        limit: query.limit,
        activeCriteria,
      },
      'Rekomendasi e-book berbasis SPK SAW berhasil dihitung',
    )
  } catch (err) {
    next(err)
  }
}
