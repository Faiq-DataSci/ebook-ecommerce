import { describe, expect, it, vi } from 'vitest'
import type { AuthenticatedUser } from '../../src/middlewares/auth.middleware.js'
import type { OrderRepository } from '../../src/modules/orders/order.repository.js'
import { OrderService } from '../../src/modules/orders/order.service.js'
import type { UserRepository } from '../../src/modules/users/user.repository.js'
import { AppError } from '../../src/utils/app-error.js'

describe('OrderService Unit Tests', () => {
  const mockAuthCustomer: AuthenticatedUser = {
    id: 'supa-user-cust-1',
    email: 'customer@example.com',
    role: 'CUSTOMER',
  }

  const mockAuthAdmin: AuthenticatedUser = {
    id: 'supa-user-admin-1',
    email: 'admin@example.com',
    role: 'ADMIN',
  }

  const mockDbUser = {
    id: '00000000-0000-4000-8000-000000000001',
    supabaseUserId: 'supa-user-cust-1',
    fullName: 'Customer Satu',
    email: 'customer@example.com',
    phone: '0811111111',
    role: 'CUSTOMER' as const,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockEbook1 = {
    id: '00000000-0000-4000-8000-000000000010',
    title: 'DATA SIMULASI - Ebook Satu',
    price: 50000 as any,
    isActive: true,
  }

  const mockEbook2 = {
    id: '00000000-0000-4000-8000-000000000020',
    title: 'DATA SIMULASI - Ebook Dua',
    price: 75000 as any,
  }

  it('createOrder throws 404 when user is not found in database', async () => {
    const mockOrderRepo = {} as OrderRepository
    const mockUserRepo = {
      findBySupabaseId: vi.fn().mockResolvedValue(null),
    } as unknown as UserRepository

    const service = new OrderService(mockOrderRepo, mockUserRepo)

    await expect(
      service.createOrder(mockAuthCustomer, { ebookIds: [mockEbook1.id] }),
    ).rejects.toThrow(AppError)
  })

  it('createOrder throws 403 when user is deactivated', async () => {
    const mockOrderRepo = {} as OrderRepository
    const mockUserRepo = {
      findBySupabaseId: vi.fn().mockResolvedValue({ ...mockDbUser, isActive: false }),
    } as unknown as UserRepository

    const service = new OrderService(mockOrderRepo, mockUserRepo)

    await expect(
      service.createOrder(mockAuthCustomer, { ebookIds: [mockEbook1.id] }),
    ).rejects.toThrow('Akun pengguna telah dinonaktifkan')
  })

  it('createOrder throws 409 when user already owns an ebook in the list', async () => {
    const mockOrderRepo = {
      findUserAccesses: vi.fn().mockResolvedValue([
        {
          id: 'acc-1',
          ebookId: mockEbook1.id,
          ebook: { title: 'DATA SIMULASI - Ebook Satu' },
        },
      ]),
    } as unknown as OrderRepository
    const mockUserRepo = {
      findBySupabaseId: vi.fn().mockResolvedValue(mockDbUser),
    } as unknown as UserRepository

    const service = new OrderService(mockOrderRepo, mockUserRepo)

    await expect(
      service.createOrder(mockAuthCustomer, { ebookIds: [mockEbook1.id] }),
    ).rejects.toThrow('Anda sudah memiliki hak akses ke e-book: DATA SIMULASI - Ebook Satu')
  })

  it('createOrder throws 400 when one or more ebooks are missing or inactive', async () => {
    const mockOrderRepo = {
      findUserAccesses: vi.fn().mockResolvedValue([]),
      findActiveEbooksByIds: vi.fn().mockResolvedValue([mockEbook1]), // Returns only 1 of 2 requested
    } as unknown as OrderRepository
    const mockUserRepo = {
      findBySupabaseId: vi.fn().mockResolvedValue(mockDbUser),
    } as unknown as UserRepository

    const service = new OrderService(mockOrderRepo, mockUserRepo)

    await expect(
      service.createOrder(mockAuthCustomer, { ebookIds: [mockEbook1.id, mockEbook2.id] }),
    ).rejects.toThrow('Satu atau lebih e-book yang dipilih tidak ditemukan atau sedang tidak aktif')
  })

  it('createOrder calculates total from server prices and executes transaction', async () => {
    const mockOrderRepo = {
      findUserAccesses: vi.fn().mockResolvedValue([]),
      findActiveEbooksByIds: vi.fn().mockResolvedValue([mockEbook1, mockEbook2]),
      createOrderTransaction: vi.fn().mockImplementation(async (params) => ({
        order: {
          id: 'ord-123',
          userId: params.userId,
          orderNumber: params.orderNumber,
          totalAmount: params.totalAmount,
          status: 'PENDING',
          items: params.items,
        },
        payment: {
          id: 'pay-123',
          orderId: 'ord-123',
          externalRef: params.paymentRef,
          amount: params.totalAmount,
          status: 'PENDING',
        },
      })),
    } as unknown as OrderRepository
    const mockUserRepo = {
      findBySupabaseId: vi.fn().mockResolvedValue(mockDbUser),
    } as unknown as UserRepository

    const service = new OrderService(mockOrderRepo, mockUserRepo)
    const result = await service.createOrder(mockAuthCustomer, {
      ebookIds: [mockEbook1.id, mockEbook2.id],
    })

    expect(result.order.totalAmount).toBe('125000.00')
    expect(result.payment.amount).toBe('125000.00')
    expect(mockOrderRepo.createOrderTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: mockDbUser.id,
        totalAmount: '125000.00',
        items: [
          { ebookId: mockEbook1.id, unitPrice: '50000.00' },
          { ebookId: mockEbook2.id, unitPrice: '75000.00' },
        ],
      }),
    )
  })

  it('getMyOrders returns paginated order list with metadata', async () => {
    const mockOrders = [
      {
        id: 'ord-1',
        orderNumber: 'ORD-1',
        totalAmount: '50000.00',
        status: 'PENDING',
        createdAt: new Date(),
        items: [],
      },
    ]

    const mockOrderRepo = {
      findOrdersByUserId: vi.fn().mockResolvedValue({
        items: mockOrders,
        total: 1,
      }),
    } as unknown as OrderRepository
    const mockUserRepo = {
      findBySupabaseId: vi.fn().mockResolvedValue(mockDbUser),
    } as unknown as UserRepository

    const service = new OrderService(mockOrderRepo, mockUserRepo)
    const result = await service.getMyOrders(mockAuthCustomer, { page: 1, limit: 10 })

    expect(result.items).toHaveLength(1)
    expect(result.meta).toEqual({
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    })
  })

  it('getOrderById throws 404 if order does not exist', async () => {
    const mockOrderRepo = {
      findOrderById: vi.fn().mockResolvedValue(null),
    } as unknown as OrderRepository
    const mockUserRepo = {
      findBySupabaseId: vi.fn().mockResolvedValue(mockDbUser),
    } as unknown as UserRepository

    const service = new OrderService(mockOrderRepo, mockUserRepo)

    await expect(service.getOrderById(mockAuthCustomer, 'invalid-order-id')).rejects.toThrow(
      'Pesanan tidak ditemukan',
    )
  })

  it('getOrderById throws 403 when customer tries to access another customer order (IDOR)', async () => {
    const mockOrder = {
      id: 'ord-other-user',
      userId: 'different-user-uuid',
      orderNumber: 'ORD-OTHER',
      totalAmount: '50000.00',
      status: 'PAID',
    }
    const mockOrderRepo = {
      findOrderById: vi.fn().mockResolvedValue(mockOrder),
    } as unknown as OrderRepository
    const mockUserRepo = {
      findBySupabaseId: vi.fn().mockResolvedValue(mockDbUser),
    } as unknown as UserRepository

    const service = new OrderService(mockOrderRepo, mockUserRepo)

    await expect(service.getOrderById(mockAuthCustomer, 'ord-other-user')).rejects.toThrow(
      'Anda tidak berhak mengakses pesanan ini',
    )
  })

  it('getOrderById allows ADMIN to access any order', async () => {
    const mockOrder = {
      id: 'ord-other-user',
      userId: 'different-user-uuid',
      orderNumber: 'ORD-OTHER',
      totalAmount: '50000.00',
      status: 'PAID',
    }
    const mockOrderRepo = {
      findOrderById: vi.fn().mockResolvedValue(mockOrder),
    } as unknown as OrderRepository
    const mockUserRepo = {
      findBySupabaseId: vi.fn().mockResolvedValue({ ...mockDbUser, id: 'admin-db-uuid', role: 'ADMIN' }),
    } as unknown as UserRepository

    const service = new OrderService(mockOrderRepo, mockUserRepo)
    const result = await service.getOrderById(mockAuthAdmin, 'ord-other-user')

    expect(result.orderNumber).toBe('ORD-OTHER')
  })
})
