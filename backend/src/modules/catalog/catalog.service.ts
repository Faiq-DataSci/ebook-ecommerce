import { AppError } from '../../utils/app-error.js'
import { catalogRepository, type CatalogRepository } from './catalog.repository.js'
import type { GetEbooksQuery } from './catalog.schema.js'

export class CatalogService {
  constructor(private catalogRepo: CatalogRepository = catalogRepository) {}

  async getCategories() {
    return this.catalogRepo.findActiveCategories()
  }

  async getEbooks(query: GetEbooksQuery) {
    const { items, total } = await this.catalogRepo.findActiveEbooks(query)
    const totalPages = Math.ceil(total / query.limit) || 1

    return {
      items,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
      },
    }
  }

  async getEbookDetail(id: string) {
    const ebook = await this.catalogRepo.findActiveEbookById(id)
    if (!ebook) {
      throw new AppError(404, 'NOT_FOUND', 'E-book tidak ditemukan atau sedang tidak aktif')
    }
    return ebook
  }
}

export const catalogService = new CatalogService()
