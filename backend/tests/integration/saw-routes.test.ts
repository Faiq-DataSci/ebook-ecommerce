import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import { app } from '../../src/app.js'
import { recommendationRepository } from '../../src/modules/recommendations/recommendation.repository.js'

describe('SAW Recommendation Routes Integration Tests (GET /api/v1/recommendations/saw)', () => {
  // Dataset alternatif e-book berbasis manual match test & seed data (DATA SIMULASI)
  // Bobot default: C1 (price, Cost) = 0.40, C2 (ratingAvg, Benefit) = 0.35, C3 (salesCount, Benefit) = 0.25
  const mockCandidates = [
    {
      id: '00000000-0000-4000-8000-000000000001',
      categoryId: '00000000-0000-4000-8000-000000000100',
      title: 'DATA SIMULASI - Ebook Alternatif 1',
      author: 'Penulis Satu',
      price: '50000.00',
      ratingAvg: '4.50',
      salesCount: 100,
      coverUrl: 'https://example.com/cover1.png',
      pageCount: 200,
      isActive: true,
      category: {
        id: '00000000-0000-4000-8000-000000000100',
        name: 'Teknologi',
        slug: 'teknologi',
      },
    },
    {
      id: '00000000-0000-4000-8000-000000000002',
      categoryId: '00000000-0000-4000-8000-000000000100',
      title: 'DATA SIMULASI - Ebook Alternatif 2',
      author: 'Penulis Dua',
      price: '75000.00',
      ratingAvg: '4.00',
      salesCount: 50,
      coverUrl: 'https://example.com/cover2.png',
      pageCount: 250,
      isActive: true,
      category: {
        id: '00000000-0000-4000-8000-000000000100',
        name: 'Teknologi',
        slug: 'teknologi',
      },
    },
    {
      id: '00000000-0000-4000-8000-000000000003',
      categoryId: '00000000-0000-4000-8000-000000000100',
      title: 'DATA SIMULASI - Ebook Alternatif 3',
      author: 'Penulis Tiga',
      price: '40000.00',
      ratingAvg: '4.80',
      salesCount: 200,
      coverUrl: 'https://example.com/cover3.png',
      pageCount: 300,
      isActive: true,
      category: {
        id: '00000000-0000-4000-8000-000000000100',
        name: 'Teknologi',
        slug: 'teknologi',
      },
    },
  ]

  it('GET /api/v1/recommendations/saw returns ranked e-books computed exclusively by backend SAW', async () => {
    vi.spyOn(recommendationRepository, 'findActiveEbooksForSaw').mockResolvedValue(mockCandidates as any)

    const res = await request(app).get('/api/v1/recommendations/saw')

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data).toHaveLength(3)

    // Sesuai rumus manual: Alternatif 3 (harga termurah 40k, rating 4.8, sales 200) menduduki Rank 1
    const rank1 = res.body.data[0]
    expect(rank1.rank).toBe(1)
    expect(rank1.ebookId).toBe('00000000-0000-4000-8000-000000000003')
    expect(rank1.title).toBe('DATA SIMULASI - Ebook Alternatif 3')
    expect(rank1.sawScore).toBeGreaterThan(0)
    expect(typeof rank1.displayScore).toBe('string')
    expect(rank1.category.name).toBe('Teknologi')

    // Peringkat kedua adalah Alternatif 1
    const rank2 = res.body.data[1]
    expect(rank2.rank).toBe(2)
    expect(rank2.ebookId).toBe('00000000-0000-4000-8000-000000000001')

    // Peringkat ketiga adalah Alternatif 2
    const rank3 = res.body.data[2]
    expect(rank3.rank).toBe(3)
    expect(rank3.ebookId).toBe('00000000-0000-4000-8000-000000000002')

    // Skor berurutan menurun (descending)
    expect(rank1.sawScore).toBeGreaterThanOrEqual(rank2.sawScore)
    expect(rank2.sawScore).toBeGreaterThanOrEqual(rank3.sawScore)
  })

  it('GET /api/v1/recommendations/saw respects limit query parameter', async () => {
    vi.spyOn(recommendationRepository, 'findActiveEbooksForSaw').mockResolvedValue(mockCandidates as any)

    const res = await request(app).get('/api/v1/recommendations/saw?limit=2')

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveLength(2)
    expect(res.body.meta.limit).toBe(2)
    expect(res.body.meta.total).toBe(2)
    expect(res.body.data[0].rank).toBe(1)
    expect(res.body.data[1].rank).toBe(2)
  })

  it('GET /api/v1/recommendations/saw passes categoryId to repository', async () => {
    const findSpy = vi
      .spyOn(recommendationRepository, 'findActiveEbooksForSaw')
      .mockResolvedValue([mockCandidates[0]] as any)

    const categoryId = '00000000-0000-4000-8000-000000000100'
    const res = await request(app).get(`/api/v1/recommendations/saw?categoryId=${categoryId}`)

    expect(res.status).toBe(200)
    expect(findSpy).toHaveBeenCalledWith(categoryId)
    expect(res.body.data).toHaveLength(1)
  })

  it('GET /api/v1/recommendations/saw returns empty array when no active ebooks found', async () => {
    vi.spyOn(recommendationRepository, 'findActiveEbooksForSaw').mockResolvedValue([])

    const res = await request(app).get('/api/v1/recommendations/saw')

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toEqual([])
    expect(res.body.meta.total).toBe(0)
  })

  it('GET /api/v1/recommendations/saw rejects invalid categoryId with 400 VALIDATION_ERROR', async () => {
    const res = await request(app).get('/api/v1/recommendations/saw?categoryId=not-a-valid-uuid')

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('GET /api/v1/recommendations/saw rejects limit < 1 or limit > 20 with 400 VALIDATION_ERROR', async () => {
    const resNegative = await request(app).get('/api/v1/recommendations/saw?limit=0')
    expect(resNegative.status).toBe(400)
    expect(resNegative.body.error.code).toBe('VALIDATION_ERROR')

    const resOversize = await request(app).get('/api/v1/recommendations/saw?limit=50')
    expect(resOversize.status).toBe(400)
    expect(resOversize.body.error.code).toBe('VALIDATION_ERROR')
  })
})
