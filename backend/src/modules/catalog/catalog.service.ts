import { env } from '../../config/env.js'
import { AppError } from '../../utils/app-error.js'
import { catalogCache } from '../../utils/ttl-cache.js'
import { catalogRepository, type CatalogRepository } from './catalog.repository.js'
import type { GetEbooksQuery } from './catalog.schema.js'

export class CatalogService {
  constructor(private catalogRepo: CatalogRepository = catalogRepository) {}

  async getCategories() {
    if (env.NODE_ENV !== 'test') {
      const cached = catalogCache.get('categories')
      if (cached) return cached as Awaited<ReturnType<CatalogRepository['findActiveCategories']>>
    }

    const categories = await this.catalogRepo.findActiveCategories()
    if (env.NODE_ENV !== 'test') {
      catalogCache.set('categories', categories)
    }
    return categories
  }

  async getEbooks(query: GetEbooksQuery) {
    const cacheKey = `ebooks:${JSON.stringify(query)}`
    if (env.NODE_ENV !== 'test') {
      const cached = catalogCache.get(cacheKey)
      if (cached) {
        return cached as {
          items: Awaited<ReturnType<CatalogRepository['findActiveEbooks']>>['items']
          meta: { page: number; limit: number; total: number; totalPages: number }
        }
      }
    }

    const { items, total } = await this.catalogRepo.findActiveEbooks(query)
    const totalPages = Math.ceil(total / query.limit) || 1

    const result = {
      items,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
      },
    }

    if (env.NODE_ENV !== 'test') {
      catalogCache.set(cacheKey, result)
    }
    return result
  }

  async getEbookDetail(id: string) {
    const cacheKey = `ebook:${id}`
    if (env.NODE_ENV !== 'test') {
      const cached = catalogCache.get(cacheKey)
      if (cached) {
        return cached as NonNullable<
          Awaited<ReturnType<CatalogRepository['findActiveEbookById']>>
        >
      }
    }

    const ebook = await this.catalogRepo.findActiveEbookById(id)
    if (!ebook) {
      throw new AppError(404, 'NOT_FOUND', 'E-book tidak ditemukan atau sedang tidak aktif')
    }

    if (env.NODE_ENV !== 'test') {
      catalogCache.set(cacheKey, ebook)
    }
    return ebook
  }
}

export const catalogService = new CatalogService()
