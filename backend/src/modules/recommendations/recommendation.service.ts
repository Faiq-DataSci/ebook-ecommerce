import {
  calculateSawScores,
  type SawAlternative,
} from '../../services/saw.service.js'
import { getActiveCriteriaStore } from '../admin/admin.repository.js'
import {
  recommendationRepository,
  type RecommendationRepository,
} from './recommendation.repository.js'
import type { GetSawRecommendationsQuery } from './recommendation.schema.js'

export class RecommendationService {
  constructor(private repo: RecommendationRepository = recommendationRepository) {}

  async getSawRecommendations(query: GetSawRecommendationsQuery) {
    const ebooks = await this.repo.findActiveEbooksForSaw(query.categoryId)

    if (!ebooks || ebooks.length === 0) {
      return []
    }

    const alternatives: SawAlternative[] = ebooks.map((book) => ({
      id: book.id,
      title: book.title,
      values: {
        C1: Number(book.price),
        C2: Number(book.ratingAvg),
        C3: Number(book.salesCount),
        price: Number(book.price),
        ratingAvg: Number(book.ratingAvg),
        salesCount: Number(book.salesCount),
      },
      author: book.author,
      price: book.price.toString(),
      coverUrl: book.coverUrl,
      category: book.category,
    }))

    // Mengambil konfigurasi kriteria & bobot SAW aktif dari store backend (dikelola oleh Admin)
    const activeCriteria = getActiveCriteriaStore().criteria
    const rankedResults = calculateSawScores(alternatives, activeCriteria)
    const ebooksMap = new Map(ebooks.map((b) => [b.id, b]))

    return rankedResults.slice(0, query.limit).map((res) => {
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
  }
}

export const recommendationService = new RecommendationService()
