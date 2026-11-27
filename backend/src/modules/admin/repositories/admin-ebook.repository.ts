import { prisma } from '../../../config/prisma.js'
import { AppError } from '../../../utils/app-error.js'
import type {
  CreateEbookInput,
  GetAdminEbooksQuery,
  UpdateEbookInput,
} from '../admin.schema.js'

export const adminEbookSelect = {
  id: true,
  categoryId: true,
  title: true,
  author: true,
  description: true,
  price: true,
  coverUrl: true,
  storagePath: true,
  pageCount: true,
  publishedYear: true,
  ratingAvg: true,
  salesCount: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
} as const

export async function findAdminEbookRecords(query: GetAdminEbooksQuery) {
  const skip = (query.page - 1) * query.limit
  const take = query.limit
  const where: Record<string, unknown> = {}

  if (query.status === 'AKTIF') {
    where.isActive = true
  } else if (query.status === 'ARSIP') {
    where.isActive = false
  }

  if (query.categoryId) {
    where.categoryId = query.categoryId
  }

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: 'insensitive' } },
      { author: { contains: query.search, mode: 'insensitive' } },
    ]
  }

  const orderBy: Record<string, 'asc' | 'desc'> = {
    [query.sortBy]: query.sortOrder,
  }

  const [items, total] = await Promise.all([
    prisma.ebook.findMany({
      where,
      select: adminEbookSelect,
      skip,
      take,
      orderBy,
    }),
    prisma.ebook.count({ where }),
  ])

  return {
    items,
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit) || 1,
    },
  }
}

export async function createAdminEbookRecord(data: CreateEbookInput) {
  const categoryExists = await prisma.category.findUnique({
    where: { id: data.categoryId },
  })
  if (!categoryExists) {
    throw new AppError(404, 'NOT_FOUND', 'Kategori e-book tidak ditemukan')
  }

  return prisma.ebook.create({
    data: {
      categoryId: data.categoryId,
      title: data.title,
      author: data.author,
      description: data.description,
      price: data.price,
      coverUrl: data.coverUrl ?? null,
      storagePath: data.storagePath || 'ebooks-private/default.pdf',
      pageCount: data.pageCount ?? null,
      publishedYear: data.publishedYear ?? null,
      isActive: data.isActive ?? true,
    },
    select: adminEbookSelect,
  })
}

export async function updateAdminEbookRecord(id: string, data: UpdateEbookInput) {
  const existing = await prisma.ebook.findUnique({ where: { id } })
  if (!existing) {
    throw new AppError(404, 'NOT_FOUND', 'E-book tidak ditemukan')
  }

  if (data.categoryId) {
    const categoryExists = await prisma.category.findUnique({
      where: { id: data.categoryId },
    })
    if (!categoryExists) {
      throw new AppError(404, 'NOT_FOUND', 'Kategori e-book tidak ditemukan')
    }
  }

  return prisma.ebook.update({
    where: { id },
    data: {
      ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
      ...(data.title !== undefined && { title: data.title }),
      ...(data.author !== undefined && { author: data.author }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.coverUrl !== undefined && { coverUrl: data.coverUrl }),
      ...(data.storagePath !== undefined && { storagePath: data.storagePath }),
      ...(data.pageCount !== undefined && { pageCount: data.pageCount }),
      ...(data.publishedYear !== undefined && { publishedYear: data.publishedYear }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
    select: adminEbookSelect,
  })
}

export async function toggleAdminEbookStatusRecord(id: string, isActive: boolean) {
  const existing = await prisma.ebook.findUnique({ where: { id } })
  if (!existing) {
    throw new AppError(404, 'NOT_FOUND', 'E-book tidak ditemukan')
  }

  return prisma.ebook.update({
    where: { id },
    data: { isActive },
    select: adminEbookSelect,
  })
}
