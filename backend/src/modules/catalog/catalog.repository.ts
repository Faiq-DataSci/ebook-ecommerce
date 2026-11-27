import { prisma } from '../../config/prisma.js'
import type { GetEbooksQuery } from './catalog.schema.js'

export const publicEbookSelect = {
  id: true,
  categoryId: true,
  title: true,
  author: true,
  description: true,
  price: true,
  coverUrl: true,
  pageCount: true,
  publishedYear: true,
  ratingAvg: true,
  salesCount: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
} as const

export class CatalogRepository {
  async findActiveCategories() {
    return prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            ebooks: {
              where: { isActive: true },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    })
  }

  async findActiveEbooks(query: GetEbooksQuery) {
    const skip = (query.page - 1) * query.limit
    const take = query.limit

    const where: Record<string, unknown> = {
      isActive: true,
      category: {
        isActive: true,
      },
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { author: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    let orderBy: Record<string, 'asc' | 'desc'> = { createdAt: 'desc' }
    if (query.sortBy === 'price_asc') {
      orderBy = { price: 'asc' }
    } else if (query.sortBy === 'price_desc') {
      orderBy = { price: 'desc' }
    } else if (query.sortBy === 'popular') {
      orderBy = { salesCount: 'desc' }
    } else if (query.sortBy === 'rating') {
      orderBy = { ratingAvg: 'desc' }
    }

    const [items, total] = await Promise.all([
      prisma.ebook.findMany({
        where,
        select: publicEbookSelect,
        skip,
        take,
        orderBy,
      }),
      prisma.ebook.count({ where }),
    ])

    return { items, total }
  }

  async findActiveEbookById(id: string) {
    return prisma.ebook.findFirst({
      where: {
        id,
        isActive: true,
        category: {
          isActive: true,
        },
      },
      select: publicEbookSelect,
    })
  }
}

export const catalogRepository = new CatalogRepository()
