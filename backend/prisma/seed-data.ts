import type { OrderStatus, PaymentStatus, UserRole } from '../src/generated/prisma/client.js'

export interface SeedUser {
  id: string
  supabaseUserId: string
  fullName: string
  email: string
  phone: string | null
  role: UserRole
  isActive: boolean
}

export interface SeedCategory {
  id: string
  name: string
  slug: string
  description: string
  isActive: boolean
}

export interface SeedEbook {
  id: string
  categoryId: string
  title: string
  author: string
  description: string
  price: string
  coverUrl: string | null
  storagePath: string
  pageCount: number
  publishedYear: number
  ratingAvg: string
  salesCount: number
  isActive: boolean
}

export interface SeedOrder {
  id: string
  userId: string
  orderNumber: string
  totalAmount: string
  status: OrderStatus
  expiresAt: Date
  items: Array<{
    id: string
    ebookId: string
    unitPrice: string
  }>
  payment: {
    id: string
    provider: string
    paymentMethod: string
    amount: string
    status: PaymentStatus
    externalRef: string
    paidAt: Date | null
  }
}

export interface SeedTransaction {
  id: string
  orderId: string
  paymentId: string
  userId: string
  transactionCode: string
  amount: string
  recordedAt: Date
}

export interface SeedEbookAccess {
  id: string
  userId: string
  ebookId: string
  orderId: string
  grantedAt: Date
  isRevoked: boolean
}

/**
 * Builds deterministic, clearly-labeled "DATA SIMULASI" seed fixtures.
 * Only PAID orders receive Transaction and EbookAccess records.
 */
export function buildSimulationSeedData(referenceDate = new Date('2026-11-16T00:00:00.000Z')) {
  const oneDayMs = 24 * 60 * 60 * 1000
  const paidAt = new Date(referenceDate.getTime() - oneDayMs)
  const pendingExpiresAt = new Date(referenceDate.getTime() + oneDayMs)

  const users: SeedUser[] = [
    {
      id: '00000000-0000-4000-8000-000000000001',
      supabaseUserId: 'data-simulasi-supabase-admin-001',
      fullName: 'DATA SIMULASI - Admin Toko',
      email: 'admin.simulasi@example.com',
      phone: '081200000001',
      role: 'ADMIN',
      isActive: true,
    },
    {
      id: '00000000-0000-4000-8000-000000000002',
      supabaseUserId: 'data-simulasi-supabase-customer-001',
      fullName: 'DATA SIMULASI - Budi Santoso',
      email: 'budi.simulasi@example.com',
      phone: '081200000002',
      role: 'CUSTOMER',
      isActive: true,
    },
    {
      id: '00000000-0000-4000-8000-000000000003',
      supabaseUserId: 'data-simulasi-supabase-customer-002',
      fullName: 'DATA SIMULASI - Siti Rahma',
      email: 'siti.simulasi@example.com',
      phone: '081200000003',
      role: 'CUSTOMER',
      isActive: true,
    },
  ]

  const categories: SeedCategory[] = [
    {
      id: '00000000-0000-4000-8000-000000000101',
      name: 'DATA SIMULASI - Pemrograman',
      slug: 'data-simulasi-pemrograman',
      description: 'DATA SIMULASI - Buku elektronik pengembangan perangkat lunak dan backend.',
      isActive: true,
    },
    {
      id: '00000000-0000-4000-8000-000000000102',
      name: 'DATA SIMULASI - Sains Data',
      slug: 'data-simulasi-sains-data',
      description: 'DATA SIMULASI - Buku elektronik analisis data dan statistik terapan.',
      isActive: true,
    },
    {
      id: '00000000-0000-4000-8000-000000000103',
      name: 'DATA SIMULASI - Sistem Informasi',
      slug: 'data-simulasi-sistem-informasi',
      description: 'DATA SIMULASI - Buku elektronik arsitektur dan rekayasa sistem informasi.',
      isActive: true,
    },
  ]

  const ebooks: SeedEbook[] = [
    {
      id: '00000000-0000-4000-8000-000000000201',
      categoryId: categories[0]!.id,
      title: 'DATA SIMULASI - Arsitektur Backend TypeScript',
      author: 'DATA SIMULASI - Andi Wijaya',
      description: 'DATA SIMULASI - Panduan modular membangun REST API dengan Express dan Prisma.',
      price: '75000.00',
      coverUrl: null,
      storagePath: 'data-simulasi/arsitektur-backend-typescript.pdf',
      pageCount: 240,
      publishedYear: 2025,
      ratingAvg: '4.80',
      salesCount: 1,
      isActive: true,
    },
    {
      id: '00000000-0000-4000-8000-000000000202',
      categoryId: categories[1]!.id,
      title: 'DATA SIMULASI - Pengantar Sains Data Praktis',
      author: 'DATA SIMULASI - Rina Kusuma',
      description: 'DATA SIMULASI - Dasar pengolahan data, normalisasi, dan pemodelan analitik.',
      price: '85000.00',
      coverUrl: null,
      storagePath: 'data-simulasi/pengantar-sains-data.pdf',
      pageCount: 210,
      publishedYear: 2025,
      ratingAvg: '4.60',
      salesCount: 0,
      isActive: true,
    },
    {
      id: '00000000-0000-4000-8000-000000000203',
      categoryId: categories[2]!.id,
      title: 'DATA SIMULASI - Desain Basis Data Relasional',
      author: 'DATA SIMULASI - Hendra Pratama',
      description: 'DATA SIMULASI - Normalisasi, integritas referensial, dan indeks PostgreSQL.',
      price: '65000.00',
      coverUrl: null,
      storagePath: 'data-simulasi/desain-basis-data.pdf',
      pageCount: 185,
      publishedYear: 2024,
      ratingAvg: '0.00',
      salesCount: 0,
      isActive: true,
    },
  ]

  const orders: SeedOrder[] = [
    {
      id: '00000000-0000-4000-8000-000000000301',
      userId: users[1]!.id,
      orderNumber: 'DATA-SIMULASI-ORD-001',
      totalAmount: '75000.00',
      status: 'PAID',
      expiresAt: referenceDate,
      items: [
        {
          id: '00000000-0000-4000-8000-000000000401',
          ebookId: ebooks[0]!.id,
          unitPrice: '75000.00',
        },
      ],
      payment: {
        id: '00000000-0000-4000-8000-000000000501',
        provider: 'midtrans',
        paymentMethod: 'QRIS',
        amount: '75000.00',
        status: 'VERIFIED',
        externalRef: 'DATA-SIMULASI-QRIS-001',
        paidAt,
      },
    },
    {
      id: '00000000-0000-4000-8000-000000000302',
      userId: users[2]!.id,
      orderNumber: 'DATA-SIMULASI-ORD-002',
      totalAmount: '85000.00',
      status: 'PENDING',
      expiresAt: pendingExpiresAt,
      items: [
        {
          id: '00000000-0000-4000-8000-000000000402',
          ebookId: ebooks[1]!.id,
          unitPrice: '85000.00',
        },
      ],
      payment: {
        id: '00000000-0000-4000-8000-000000000502',
        provider: 'midtrans',
        paymentMethod: 'QRIS',
        amount: '85000.00',
        status: 'PENDING',
        externalRef: 'DATA-SIMULASI-QRIS-002',
        paidAt: null,
      },
    },
  ]

  // Only PAID order gets Transaction and EbookAccess; PENDING order receives neither.
  const transactions: SeedTransaction[] = [
    {
      id: '00000000-0000-4000-8000-000000000601',
      orderId: orders[0]!.id,
      paymentId: orders[0]!.payment.id,
      userId: orders[0]!.userId,
      transactionCode: 'DATA-SIMULASI-TRX-001',
      amount: '75000.00',
      recordedAt: paidAt,
    },
  ]

  const ebookAccesses: SeedEbookAccess[] = [
    {
      id: '00000000-0000-4000-8000-000000000701',
      userId: orders[0]!.userId,
      ebookId: ebooks[0]!.id,
      orderId: orders[0]!.id,
      grantedAt: paidAt,
      isRevoked: false,
    },
  ]

  return {
    users,
    categories,
    ebooks,
    orders,
    transactions,
    ebookAccesses,
  }
}
