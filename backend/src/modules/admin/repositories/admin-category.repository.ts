import { prisma } from '../../../config/prisma.js'
import { AppError } from '../../../utils/app-error.js'
import type {
  CreateCategoryInput,
  GetAdminCategoriesQuery,
  UpdateCategoryInput,
} from '../admin.schema.js'

function toCategorySlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return base || `kategori-${Date.now()}`
}

export async function findAdminCategoryRecords(query: GetAdminCategoriesQuery) {
  const skip = (query.page - 1) * query.limit
  const where: Record<string, unknown> = {}

  if (query.status === 'AKTIF') {
    where.isActive = true
  } else if (query.status === 'ARSIP') {
    where.isActive = false
  }

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { slug: { contains: query.search, mode: 'insensitive' } },
    ]
  }

  const [items, total] = await Promise.all([
    prisma.category.findMany({
      where,
      include: { _count: { select: { ebooks: true } } },
      orderBy: { name: 'asc' },
      skip,
      take: query.limit,
    }),
    prisma.category.count({ where }),
  ])

  return {
    items,
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    },
  }
}

export async function createAdminCategoryRecord(data: CreateCategoryInput) {
  const slug = data.slug || toCategorySlug(data.name)

  const existing = await prisma.category.findFirst({
    where: {
      OR: [
        { name: { equals: data.name, mode: 'insensitive' } },
        { slug: { equals: slug, mode: 'insensitive' } },
      ],
    },
  })

  if (existing) {
    throw new AppError(409, 'CONFLICT', 'Nama atau slug kategori sudah digunakan')
  }

  return prisma.category.create({
    data: {
      name: data.name,
      slug,
      description: data.description ?? null,
      isActive: data.isActive,
    },
    include: { _count: { select: { ebooks: true } } },
  })
}

export async function updateAdminCategoryRecord(id: string, data: UpdateCategoryInput) {
  const existing = await prisma.category.findUnique({ where: { id } })
  if (!existing) {
    throw new AppError(404, 'NOT_FOUND', 'Kategori tidak ditemukan')
  }

  const nextName = data.name ?? existing.name
  const nextSlug = data.slug ?? (data.name ? toCategorySlug(data.name) : existing.slug)

  const duplicate = await prisma.category.findFirst({
    where: {
      id: { not: id },
      OR: [
        { name: { equals: nextName, mode: 'insensitive' } },
        { slug: { equals: nextSlug, mode: 'insensitive' } },
      ],
    },
  })

  if (duplicate) {
    throw new AppError(
      409,
      'CONFLICT',
      'Nama atau slug kategori sudah digunakan oleh kategori lain',
    )
  }

  return prisma.category.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.slug !== undefined || data.name !== undefined ? { slug: nextSlug } : {}),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
    include: { _count: { select: { ebooks: true } } },
  })
}

export async function toggleAdminCategoryStatusRecord(id: string, isActive: boolean) {
  const existing = await prisma.category.findUnique({ where: { id } })
  if (!existing) {
    throw new AppError(404, 'NOT_FOUND', 'Kategori tidak ditemukan')
  }

  return prisma.category.update({
    where: { id },
    data: { isActive },
    include: { _count: { select: { ebooks: true } } },
  })
}

export async function deleteAdminCategoryRecord(id: string) {
  const existing = await prisma.category.findUnique({ where: { id } })
  if (!existing) {
    throw new AppError(404, 'NOT_FOUND', 'Kategori tidak ditemukan')
  }

  const relatedEbooksCount = await prisma.ebook.count({ where: { categoryId: id } })
  if (relatedEbooksCount > 0) {
    throw new AppError(
      409,
      'CONFLICT',
      `Kategori tidak dapat dihapus karena masih digunakan oleh ${relatedEbooksCount} e-book`,
    )
  }

  return prisma.category.delete({ where: { id } })
}
