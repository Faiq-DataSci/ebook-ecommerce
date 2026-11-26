import type { NextFunction, Request, Response } from 'express'
import { sendSuccess } from '../../utils/response.js'
import { adminService } from './admin.service.js'
import type { GetAdminEbooksQuery } from './admin.schema.js'

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
    const result = adminService.getActiveSawWeights()
    sendSuccess(res, result, 200, undefined, 'Konfigurasi bobot SAW aktif berhasil dimuat')
  } catch (err) {
    next(err)
  }
}

export async function updateSawWeights(req: Request, res: Response, next: NextFunction) {
  try {
    const result = adminService.updateSawWeights(req.body)
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

export async function createEbook(req: Request, res: Response, next: NextFunction) {
  try {
    const created = await adminService.createEbook(req.body)
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

