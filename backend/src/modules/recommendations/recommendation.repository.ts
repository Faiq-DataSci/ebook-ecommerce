import { prisma } from '../../config/prisma.js'

export const recommendationEbookSelect = {
  id: true,
  categoryId: true,
  title: true,
  author: true,
  price: true,
  coverUrl: true,
  pageCount: true,
  publishedYear: true,
  ratingAvg: true,
  salesCount: true,
  isActive: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
} as const

export class RecommendationRepository {
  async findActiveEbooksForSaw(categoryId?: string) {
    const where: Record<string, unknown> = {
      isActive: true,
      category: {
        isActive: true,
      },
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    return prisma.ebook.findMany({
      where,
      select: recommendationEbookSelect,
    })
  }
}

export const recommendationRepository = new RecommendationRepository()
