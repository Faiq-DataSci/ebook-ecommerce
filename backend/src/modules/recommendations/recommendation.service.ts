import { env } from '../../config/env.js'
import {
  calculateSawScores,
  type SawAlternative,
  type SawCriterion,
} from '../../services/saw.service.js'
import { sawCache } from '../../utils/ttl-cache.js'
import { adminRepository } from '../admin/admin.repository.js'
import {
  recommendationRepository,
  type RecommendationRepository,
} from './recommendation.repository.js'
import type { GetSawRecommendationsQuery } from './recommendation.schema.js'

export class RecommendationService {
  constructor(private repo: RecommendationRepository = recommendationRepository) {}

  async getSawRecommendationsWithCriteria(query: GetSawRecommendationsQuery): Promise<{
    items: Array<{
      rank: number
      ebookId: string
      title: string
      sawScore: number
      displayScore: string
      author?: string
      price?: string
      coverUrl?: string | null
      category?: { id: string; name: string; slug: string }
      rawValues: Record<string, number>
      normalizedValues: Record<string, number>
    }>
    activeCriteria: SawCriterion[]
  }> {
    const cacheKey = `saw:${query.categoryId ?? 'all'}:${query.limit}`
    if (env.NODE_ENV !== 'test') {
      const cached = sawCache.get(cacheKey)
      if (cached) {
        return cached as {
          items: Array<{
            rank: number
            ebookId: string
            title: string
            sawScore: number
            displayScore: string
            author?: string
            price?: string
            coverUrl?: string | null
            category?: { id: string; name: string; slug: string }
            rawValues: Record<string, number>
            normalizedValues: Record<string, number>
          }>
          activeCriteria: SawCriterion[]
        }
      }
    }

    const [ebooks, criteriaStore] = await Promise.all([
      this.repo.findActiveEbooksForSaw(query.categoryId),
      adminRepository.getActiveSawCriteria(),
    ])

    const activeCriteria = criteriaStore.criteria.filter((c) => c.isActive !== false)

    if (!ebooks || ebooks.length === 0) {
      return { items: [], activeCriteria }
    }

    const alternatives: SawAlternative[] = ebooks.map((book) => ({
      id: book.id,
      title: book.title,
      values: {
        price: Number(book.price),
        ratingAvg: Number(book.ratingAvg),
        salesCount: Number(book.salesCount),
        pageCount: Number(book.pageCount ?? 0),
        publishedYear: Number(book.publishedYear ?? 0),
      },
      author: book.author,
      price: book.price.toString(),
      coverUrl: book.coverUrl,
      category: book.category,
    }))

    const rankedResults = calculateSawScores(alternatives, activeCriteria)
    const ebooksMap = new Map(ebooks.map((b) => [b.id, b]))

    const items = rankedResults.slice(0, query.limit).map((res) => {
      const original = ebooksMap.get(res.ebookId)
      return {
        rank: res.rank,
        ebookId: res.ebookId,
        title: res.title,
        sawScore: res.sawScore,
        displayScore: res.displayScore,
        author: original?.author,
        price: original?.price ? original.price.toString() : undefined,
        coverUrl: original?.coverUrl,
        category: original?.category,
        rawValues: res.rawValues,
        normalizedValues: res.normalizedValues,
      }
    })

    const result = { items, activeCriteria }
    if (env.NODE_ENV !== 'test') {
      sawCache.set(cacheKey, result)
    }
    return result
  }

  async getSawRecommendations(query: GetSawRecommendationsQuery) {
    const { items } = await this.getSawRecommendationsWithCriteria(query)
    return items
  }
}

export const recommendationService = new RecommendationService()
