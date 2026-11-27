import type { NextFunction, Request, Response } from 'express'
import {
  uploadPrivatePdf,
  uploadPublicCoverImage,
} from '../../integrations/storage/supabase-storage.js'
import { AppError } from '../../utils/app-error.js'
import { sendSuccess } from '../../utils/response.js'
import { adminService } from './admin.service.js'
import type {
  GetAdminCategoriesQuery,
  GetAdminCustomersQuery,
  GetAdminEbooksQuery,
  GetAdminOrdersQuery,
  GetAdminPaymentsQuery,
} from './admin.schema.js'

export async function getDashboard(_req: Request, res: Response, next: NextFunction) {
  try {
    const summary = await adminService.getDashboardSummary()
    sendSuccess(res, summary, 200, undefined, 'Ringkasan statistik dashboard berhasil dimuat')
  } catch (err) {
    next(err)
  }
}

export async function getSawWeights(_req: Request, res: Response, next: NextFunction) {
  try {
    const result = await adminService.getActiveSawWeights()
    sendSuccess(res, result, 200, undefined, 'Konfigurasi bobot SAW aktif berhasil dimuat')
  } catch (err) {
    next(err)
  }
}

export async function updateSawWeights(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await adminService.updateSawWeights(req.body)
    sendSuccess(res, result, 200, undefined, 'Bobot kriteria SAW berhasil diperbarui')
  } catch (err) {
    next(err)
  }
}

export async function getAdminEbooks(req: Request, res: Response, next: NextFunction) {
  try {
    const query = req.query as unknown as GetAdminEbooksQuery
    const { items, meta } = await adminService.getAdminEbooks(query)
    sendSuccess(res, items, 200, meta, 'Daftar e-book admin berhasil dimuat')
  } catch (err) {
    next(err)
  }
}

export async function uploadEbookPdf(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'File PDF (field pdfFile) wajib dilampirkan',
      )
    }

    const uploaded = await uploadPrivatePdf(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
    )

    sendSuccess(
      res,
      uploaded,
      201,
      undefined,
      'File PDF berhasil diunggah ke bucket privat Supabase Storage',
    )
  } catch (err) {
    next(err)
  }
}

export async function uploadEbookCover(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'Gambar sampul wajib dilampirkan pada field coverFile',
      )
    }

    const uploaded = await uploadPublicCoverImage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
    )

    sendSuccess(
      res,
      uploaded,
      201,
      undefined,
      'Gambar sampul berhasil diunggah ke Supabase Storage',
    )
  } catch (err) {
    next(err)
  }
}

export async function createEbook(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = { ...req.body }
    if (req.file) {
      const uploaded = await uploadPrivatePdf(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
      )
      payload.storagePath = uploaded.storagePath
    }

    const created = await adminService.createEbook(payload)
    sendSuccess(res, created, 201, undefined, 'E-book baru berhasil disimpan ke katalog')
  } catch (err) {
    next(err)
  }
}

export async function updateEbook(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string }
    const updated = await adminService.updateEbook(id, req.body)
    sendSuccess(res, updated, 200, undefined, 'Data e-book berhasil diperbarui')
  } catch (err) {
    next(err)
  }
}

export async function toggleEbookStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string }
    const { isActive } = req.body as { isActive: boolean }
    const updated = await adminService.toggleEbookStatus(id, isActive)
    const msg = isActive
      ? 'E-book berhasil diaktifkan kembali ke katalog toko publik'
      : 'E-book berhasil diarsipkan dari katalog toko publik'
    sendSuccess(res, updated, 200, undefined, msg)
  } catch (err) {
    next(err)
  }
}

export async function archiveEbook(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string }
    const archived = await adminService.archiveEbook(id)
    sendSuccess(
      res,
      archived,
      200,
      undefined,
      'E-book berhasil diarsipkan dari katalog toko publik',
    )
  } catch (err) {
    next(err)
  }
}

export async function getAdminCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const query = req.query as unknown as GetAdminCategoriesQuery
    const { items, meta } = await adminService.getAdminCategories(query)
    sendSuccess(res, items, 200, meta, 'Daftar kategori admin berhasil dimuat')
  } catch (err) {
    next(err)
  }
}

export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const created = await adminService.createCategory(req.body)
    sendSuccess(res, created, 201, undefined, 'Kategori baru berhasil ditambahkan')
  } catch (err) {
    next(err)
  }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string }
    const updated = await adminService.updateCategory(id, req.body)
    sendSuccess(res, updated, 200, undefined, 'Data kategori berhasil diperbarui')
  } catch (err) {
    next(err)
  }
}

export async function toggleCategoryStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string }
    const { isActive } = req.body as { isActive: boolean }
    const updated = await adminService.toggleCategoryStatus(id, isActive)
    const msg = isActive
      ? 'Kategori berhasil diaktifkan kembali ke katalog publik'
      : 'Kategori berhasil diarsipkan dari katalog publik'
    sendSuccess(res, updated, 200, undefined, msg)
  } catch (err) {
    next(err)
  }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string }
    const deleted = await adminService.deleteCategory(id)
    sendSuccess(res, deleted, 200, undefined, 'Kategori berhasil dihapus')
  } catch (err) {
    next(err)
  }
}

export async function getAdminCustomers(req: Request, res: Response, next: NextFunction) {
  try {
    const query = req.query as unknown as GetAdminCustomersQuery
    const { data, meta } = await adminService.getAdminCustomers(query)
    sendSuccess(res, data, 200, meta, 'Daftar pelanggan berhasil dimuat')
  } catch (err) {
    next(err)
  }
}

export async function getAdminCustomerById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string }
    const customer = await adminService.getAdminCustomerById(id)
    sendSuccess(res, customer, 200, undefined, 'Detail pelanggan berhasil dimuat')
  } catch (err) {
    next(err)
  }
}

export async function toggleCustomerStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string }
    const { isActive } = req.body as { isActive: boolean }
    const updated = await adminService.toggleCustomerStatus(id, isActive)
    const msg = isActive
      ? 'Akun pelanggan berhasil diaktifkan kembali'
      : 'Akun pelanggan berhasil dinonaktifkan'
    sendSuccess(res, updated, 200, undefined, msg)
  } catch (err) {
    next(err)
  }
}

export async function getAdminOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const query = req.query as unknown as GetAdminOrdersQuery
    const { items, meta } = await adminService.getAdminOrders(query)
    sendSuccess(res, items, 200, meta, 'Daftar pesanan admin berhasil dimuat')
  } catch (err) {
    next(err)
  }
}

export async function getAdminPayments(req: Request, res: Response, next: NextFunction) {
  try {
    const query = req.query as unknown as GetAdminPaymentsQuery
    const { items, meta } = await adminService.getAdminPayments(query)
    sendSuccess(res, items, 200, meta, 'Daftar audit pembayaran berhasil dimuat')
  } catch (err) {
    next(err)
  }
}

export async function toggleOrderAccess(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string }
    const { isRevoked } = req.body as { isRevoked: boolean }
    const actorSupabaseId = req.user?.id
    const updated = await adminService.toggleOrderAccess(id, isRevoked, actorSupabaseId)
    const msg = isRevoked
      ? 'Hak akses e-book pada pesanan berhasil dicabut'
      : 'Hak akses e-book pada pesanan berhasil dipulihkan'
    sendSuccess(res, updated, 200, undefined, msg)
  } catch (err) {
    next(err)
  }
}

