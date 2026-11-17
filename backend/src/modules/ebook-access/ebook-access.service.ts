import { prisma } from '../../config/prisma.js'
import { createPrivatePdfSignedUrl } from '../../integrations/storage/supabase-storage.js'
import type { AuthenticatedUser } from '../../middlewares/auth.middleware.js'
import { AppError } from '../../utils/app-error.js'
import { userRepository, type UserRepository } from '../users/user.repository.js'

export class EbookAccessService {
  constructor(private userRepo: UserRepository = userRepository) {}

  async getSignedAccessUrl(authUser: AuthenticatedUser, ebookId: string, expiresInSeconds = 300) {
    const user = await this.userRepo.findBySupabaseId(authUser.id)
    if (!user) {
      throw new AppError(404, 'NOT_FOUND', 'Pengguna belum terdaftar di database sistem')
    }

    if (!user.isActive) {
      throw new AppError(403, 'FORBIDDEN', 'Akun pengguna telah dinonaktifkan')
    }

    const ebook = await prisma.ebook.findUnique({
      where: { id: ebookId },
      select: {
        id: true,
        title: true,
        storagePath: true,
        isActive: true,
      },
    })

    if (!ebook || !ebook.isActive) {
      throw new AppError(404, 'NOT_FOUND', 'E-book tidak ditemukan atau sedang tidak aktif')
    }

    // Role ADMIN can inspect/access, regular customers require valid EbookAccess
    if (authUser.role !== 'ADMIN') {
      const access = await prisma.ebookAccess.findUnique({
        where: {
          userId_ebookId: {
            userId: user.id,
            ebookId: ebook.id,
          },
        },
      })

      if (!access) {
        throw new AppError(
          403,
          'FORBIDDEN',
          'Anda belum memiliki hak akses atau belum membeli e-book ini',
        )
      }

      if (access.isRevoked) {
        throw new AppError(
          403,
          'FORBIDDEN',
          'Hak akses e-book Anda telah dicabut oleh Administrator',
        )
      }
    }

    try {
      const signedUrl = await createPrivatePdfSignedUrl(ebook.storagePath, expiresInSeconds)
      return {
        ebookId: ebook.id,
        title: ebook.title,
        signedUrl,
        expiresInSeconds,
      }
    } catch {
      throw new AppError(500, 'STORAGE_ERROR', 'Gagal menerbitkan signed URL akses file privat')
    }
  }
}

export const ebookAccessService = new EbookAccessService()
