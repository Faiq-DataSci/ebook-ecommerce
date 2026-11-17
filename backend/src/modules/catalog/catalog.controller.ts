import type { NextFunction, Request, Response } from 'express'
import { sendSuccess } from '../../utils/response.js'
import { catalogService } from './catalog.service.js'
import type { EbookIdParam, GetEbooksQuery } from './catalog.schema.js'

export async function getCategoriesController(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const categories = await catalogService.getCategories()
    sendSuccess(res, categories, 200, undefined, 'Daftar kategori aktif berhasil diambil')
  } catch (err) {
    next(err)
  }
}

export async function getEbooksController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const query = req.query as unknown as GetEbooksQuery
    const { items, meta } = await catalogService.getEbooks(query)
    sendSuccess(res, items, 200, meta, 'Daftar e-book berhasil diambil')
  } catch (err) {
    next(err)
  }
}

export async function getEbookDetailController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = req.params as unknown as EbookIdParam
    const ebook = await catalogService.getEbookDetail(params.id)
    sendSuccess(res, ebook, 200, undefined, 'Detail e-book berhasil ditemukan')
  } catch (err) {
    next(err)
  }
}
