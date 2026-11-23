import type { NextFunction, Request, Response } from 'express'
import { sendSuccess } from '../../utils/response.js'
import { adminService } from './admin.service.js'

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
