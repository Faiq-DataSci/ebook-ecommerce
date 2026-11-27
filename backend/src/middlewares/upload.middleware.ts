import type { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import { AppError } from '../utils/app-error.js'

const MAX_PDF_SIZE_BYTES = 25 * 1024 * 1024 // 25 MB
const MAX_COVER_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

const coverUploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_COVER_SIZE_BYTES,
    files: 1,
  },
  fileFilter(_req, file, callback) {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const lowerName = file.originalname.toLowerCase()
    const hasAllowedExt = ['.jpg', '.jpeg', '.png', '.webp'].some((ext) =>
      lowerName.endsWith(ext),
    )

    if (!allowedMimes.includes(file.mimetype.toLowerCase()) && !hasAllowedExt) {
      callback(
        new AppError(
          400,
          'VALIDATION_ERROR',
          'Format gambar sampul tidak valid. Hanya JPG, PNG, atau WebP yang diizinkan',
        ),
      )
      return
    }

    callback(null, true)
  },
})

const pdfUploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_PDF_SIZE_BYTES,
    files: 1,
  },
  fileFilter(_req, file, callback) {
    const isPdfMime = file.mimetype === 'application/pdf'
    const isPdfExt = file.originalname.toLowerCase().endsWith('.pdf')

    if (!isPdfMime && !isPdfExt) {
      callback(
        new AppError(
          400,
          'VALIDATION_ERROR',
          'Format file tidak valid. Hanya file PDF (application/pdf) yang diizinkan',
        ),
      )
      return
    }

    callback(null, true)
  },
})

/**
 * Middleware multer untuk unggah file PDF tunggal pada field `pdfFile`.
 * Hanya diproses apabila Content-Type adalah multipart/form-data;
 * meneruskan error ukuran/format file ke errorHandler standar.
 */
export function parseOptionalPdfUpload(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const contentType = req.headers['content-type'] ?? ''
  if (!contentType.includes('multipart/form-data')) {
    next()
    return
  }

  pdfUploader.single('pdfFile')(req, res, (err: unknown) => {
    if (!err) {
      next()
      return
    }

    if (err instanceof AppError) {
      next(err)
      return
    }

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        next(new AppError(400, 'VALIDATION_ERROR', 'Ukuran file PDF maksimal 25 MB'))
        return
      }
      next(new AppError(400, 'VALIDATION_ERROR', `Gagal membaca unggahan file: ${err.message}`))
      return
    }

    next(err)
  })
}

/**
 * Middleware multer untuk unggah gambar sampul tunggal pada field `coverFile`.
 */
export function parseOptionalCoverUpload(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const contentType = req.headers['content-type'] ?? ''
  if (!contentType.includes('multipart/form-data')) {
    next()
    return
  }

  coverUploader.single('coverFile')(req, res, (err: unknown) => {
    if (!err) {
      next()
      return
    }

    if (err instanceof AppError) {
      next(err)
      return
    }

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        next(new AppError(400, 'VALIDATION_ERROR', 'Ukuran gambar sampul maksimal 5 MB'))
        return
      }
      next(new AppError(400, 'VALIDATION_ERROR', `Gagal membaca unggahan gambar: ${err.message}`))
      return
    }

    next(err)
  })
}
