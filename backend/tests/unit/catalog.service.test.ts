import { describe, expect, it, vi } from 'vitest'
import type { CatalogRepository } from '../../src/modules/catalog/catalog.repository.js'
import { CatalogService } from '../../src/modules/catalog/catalog.service.js'
import { AppError } from '../../src/utils/app-error.js'

describe('CatalogService Unit Tests', () => {
  const mockCategories = [
    {
      id: 'cat-001',
      name: 'Teknologi',
      slug: 'teknologi',
      description: 'Buku teknologi dan pemrograman',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'cat-002',
      name: 'Bisnis',
      slug: 'bisnis',
      description: 'Buku bisnis dan keuangan',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const mockEbook = {
    id: '00000000-0000-4000-8000-000000000010',
    categoryId: 'cat-001',
    title: 'DATA SIMULASI - Arsitektur Backend Modern',
    author: 'Faiq Pratama',
    description: 'Buku arsitektur backend dan Express TypeScript',
    price: 75000 as unknown as any,
    coverUrl: 'https://example.com/cover.png',
    pageCount: 300,
    publishedYear: 2026,
    ratingAvg: 4.8 as unknown as any,
    salesCount: 150,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: 'cat-001',
      name: 'Teknologi',
      slug: 'teknologi',
    },
  }

  it('getCategories returns active categories list', async () => {
    const mockRepo: Partial<CatalogRepository> = {
      findActiveCategories: vi.fn().mockResolvedValue(mockCategories),
    }

    const service = new CatalogService(mockRepo as CatalogRepository)
    const result = await service.getCategories()

    expect(mockRepo.findActiveCategories).toHaveBeenCalledTimes(1)
    expect(result).toHaveLength(2)
    expect(result[0]?.name).toBe('Teknologi')
  })

  it('getEbooks calculates totalPages correctly and returns items with meta', async () => {
    const mockRepo: Partial<CatalogRepository> = {
      findActiveEbooks: vi.fn().mockResolvedValue({
        items: [mockEbook],
        total: 25,
      }),
    }

    const service = new CatalogService(mockRepo as CatalogRepository)
    const result = await service.getEbooks({
      page: 1,
      limit: 10,
      sortBy: 'newest',
    })

    expect(result.items).toHaveLength(1)
    expect(result.meta).toEqual({
      page: 1,
      limit: 10,
      total: 25,
      totalPages: 3,
    })
  })

  it('getEbookDetail returns ebook when found and active', async () => {
    const mockRepo: Partial<CatalogRepository> = {
      findActiveEbookById: vi.fn().mockResolvedValue(mockEbook),
    }

    const service = new CatalogService(mockRepo as CatalogRepository)
    const result = await service.getEbookDetail('00000000-0000-4000-8000-000000000010')

    expect(mockRepo.findActiveEbookById).toHaveBeenCalledWith(
      '00000000-0000-4000-8000-000000000010',
    )
    expect(result.title).toBe('DATA SIMULASI - Arsitektur Backend Modern')
  })

  it('getEbookDetail throws 404 when ebook is not found', async () => {
    const mockRepo: Partial<CatalogRepository> = {
      findActiveEbookById: vi.fn().mockResolvedValue(null),
    }

    const service = new CatalogService(mockRepo as CatalogRepository)

    await expect(service.getEbookDetail('00000000-0000-4000-8000-000000000099')).rejects.toThrow(
      AppError,
    )
    await expect(
      service.getEbookDetail('00000000-0000-4000-8000-000000000099'),
    ).rejects.toMatchObject({
      statusCode: 404,
      code: 'NOT_FOUND',
    })
  })
})
