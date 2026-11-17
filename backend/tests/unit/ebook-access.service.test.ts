import { describe, expect, it, vi } from 'vitest'
import { prisma } from '../../src/config/prisma.js'
import * as storageIntegration from '../../src/integrations/storage/supabase-storage.js'
import type { AuthenticatedUser } from '../../src/middlewares/auth.middleware.js'
import { EbookAccessService } from '../../src/modules/ebook-access/ebook-access.service.js'
import type { UserRepository } from '../../src/modules/users/user.repository.js'
import { AppError } from '../../src/utils/app-error.js'

describe('EbookAccessService Unit Tests', () => {
  const mockAuthCustomer: AuthenticatedUser = {
    id: 'supa-cust-1',
    email: 'cust@example.com',
    role: 'CUSTOMER',
  }

  const mockAuthAdmin: AuthenticatedUser = {
    id: 'supa-admin-1',
    email: 'admin@example.com',
    role: 'ADMIN',
  }

  const mockDbUser = {
    id: 'usr-db-001',
    supabaseUserId: 'supa-cust-1',
    fullName: 'Pelanggan Setia',
    email: 'cust@example.com',
    phone: '08123456789',
    role: 'CUSTOMER' as const,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockEbook = {
    id: '00000000-0000-4000-8000-000000000055',
    title: 'DATA SIMULASI - Pemrograman TypeScript Tingkat Lanjut',
    storagePath: 'ebooks/tech/typescript-advanced.pdf',
    isActive: true,
  }

  it('getSignedAccessUrl throws 404 when user is not found in database', async () => {
    const mockUserRepo = {
      findBySupabaseId: vi.fn().mockResolvedValue(null),
    } as unknown as UserRepository
    const service = new EbookAccessService(mockUserRepo)

    await expect(
      service.getSignedAccessUrl(mockAuthCustomer, mockEbook.id),
    ).rejects.toThrow(AppError)
  })

  it('getSignedAccessUrl throws 403 when user is deactivated', async () => {
    const mockUserRepo = {
      findBySupabaseId: vi.fn().mockResolvedValue({ ...mockDbUser, isActive: false }),
    } as unknown as UserRepository
    const service = new EbookAccessService(mockUserRepo)

    await expect(
      service.getSignedAccessUrl(mockAuthCustomer, mockEbook.id),
    ).rejects.toThrow('Akun pengguna telah dinonaktifkan')
  })

  it('getSignedAccessUrl throws 404 when ebook is not found or inactive', async () => {
    const mockUserRepo = {
      findBySupabaseId: vi.fn().mockResolvedValue(mockDbUser),
    } as unknown as UserRepository
    vi.spyOn(prisma.ebook, 'findUnique').mockResolvedValue(null)

    const service = new EbookAccessService(mockUserRepo)

    await expect(
      service.getSignedAccessUrl(mockAuthCustomer, mockEbook.id),
    ).rejects.toThrow('E-book tidak ditemukan atau sedang tidak aktif')
  })

  it('getSignedAccessUrl throws 403 when customer does not own access to the ebook', async () => {
    const mockUserRepo = {
      findBySupabaseId: vi.fn().mockResolvedValue(mockDbUser),
    } as unknown as UserRepository
    vi.spyOn(prisma.ebook, 'findUnique').mockResolvedValue(mockEbook as any)
    vi.spyOn(prisma.ebookAccess, 'findUnique').mockResolvedValue(null)

    const service = new EbookAccessService(mockUserRepo)

    await expect(
      service.getSignedAccessUrl(mockAuthCustomer, mockEbook.id),
    ).rejects.toThrow('Anda belum memiliki hak akses atau belum membeli e-book ini')
  })

  it('getSignedAccessUrl throws 403 when customer access is revoked', async () => {
    const mockUserRepo = {
      findBySupabaseId: vi.fn().mockResolvedValue(mockDbUser),
    } as unknown as UserRepository
    vi.spyOn(prisma.ebook, 'findUnique').mockResolvedValue(mockEbook as any)
    vi.spyOn(prisma.ebookAccess, 'findUnique').mockResolvedValue({
      id: 'acc-001',
      userId: mockDbUser.id,
      ebookId: mockEbook.id,
      isRevoked: true,
      grantedAt: new Date(),
    } as any)

    const service = new EbookAccessService(mockUserRepo)

    await expect(
      service.getSignedAccessUrl(mockAuthCustomer, mockEbook.id),
    ).rejects.toThrow('Hak akses e-book Anda telah dicabut oleh Administrator')
  })

  it('getSignedAccessUrl returns signed URL and expiration timestamp for authorized customer', async () => {
    const mockUserRepo = {
      findBySupabaseId: vi.fn().mockResolvedValue(mockDbUser),
    } as unknown as UserRepository
    vi.spyOn(prisma.ebook, 'findUnique').mockResolvedValue(mockEbook as any)
    vi.spyOn(prisma.ebookAccess, 'findUnique').mockResolvedValue({
      id: 'acc-001',
      userId: mockDbUser.id,
      ebookId: mockEbook.id,
      isRevoked: false,
      grantedAt: new Date(),
    } as any)

    const mockSignedUrl = 'https://supabase.co/storage/v1/object/sign/ebook-files/file.pdf?token=xyz'
    vi.spyOn(storageIntegration, 'createPrivatePdfSignedUrl').mockResolvedValue(mockSignedUrl)

    const service = new EbookAccessService(mockUserRepo)
    const result = await service.getSignedAccessUrl(mockAuthCustomer, mockEbook.id, 300)

    expect(result.signedUrl).toBe(mockSignedUrl)
    expect(result.expiresInSeconds).toBe(300)
    expect(result.ebookId).toBe(mockEbook.id)
    expect(result.title).toBe(mockEbook.title)
    expect(storageIntegration.createPrivatePdfSignedUrl).toHaveBeenCalledWith(
      mockEbook.storagePath,
      300,
    )
  })

  it('getSignedAccessUrl allows ADMIN to generate signed URL without EbookAccess record', async () => {
    const mockUserRepo = {
      findBySupabaseId: vi.fn().mockResolvedValue({ ...mockDbUser, role: 'ADMIN' }),
    } as unknown as UserRepository
    vi.spyOn(prisma.ebook, 'findUnique').mockResolvedValue(mockEbook as any)
    const ebookAccessSpy = vi.spyOn(prisma.ebookAccess, 'findUnique')

    const mockSignedUrl = 'https://supabase.co/storage/v1/object/sign/ebook-files/admin-preview.pdf'
    vi.spyOn(storageIntegration, 'createPrivatePdfSignedUrl').mockResolvedValue(mockSignedUrl)

    const service = new EbookAccessService(mockUserRepo)
    const result = await service.getSignedAccessUrl(mockAuthAdmin, mockEbook.id, 600)

    expect(result.signedUrl).toBe(mockSignedUrl)
    expect(result.expiresInSeconds).toBe(600)
    // Verify findUnique on ebookAccess was NOT called for ADMIN
    expect(ebookAccessSpy).not.toHaveBeenCalled()
  })
})
