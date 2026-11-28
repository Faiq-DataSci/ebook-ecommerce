import {
  INITIAL_MOCK_ORDERS,
  INITIAL_PURCHASED_LIBRARY,
  MOCK_BOOKS,
} from '../data/mock-books';
import type { Order, PurchasedBookAccess, QrisPayload } from '../types/order.types';
import { fetchAuthenticatedApi, getStoredAccessToken } from './api/apiClient';
import { API_ENDPOINTS } from './api/endpoints';

const ORDERS_STORAGE_KEY = 'ebook_store_sim_orders';

interface RawBackendPayment {
  id: string;
  provider?: string;
  paymentMethod?: string;
  amount?: string | number;
  status?: string;
  externalRef?: string | null;
  qrPayload?: QrisPayload | null;
  expiresAt?: string | null;
  paidAt?: string | null;
}

interface RawBackendOrder {
  id: string;
  orderNumber: string;
  userId?: string;
  totalAmount: string | number;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'CANCELLED';
  expiresAt: string;
  createdAt: string;
  items?: Array<{
    ebookId: string;
    unitPrice?: string | number;
    ebook?: {
      id: string;
      title: string;
      author: string;
      category?: { name: string } | null;
    };
  }>;
  payments?: RawBackendPayment[];
}

function mapBackendOrder(raw: RawBackendOrder, explicitPayment?: RawBackendPayment): Order {
  const firstItem = raw.items?.[0];
  const latestPayment = explicitPayment ?? raw.payments?.[0];
  const paymentStatus: Order['paymentStatus'] =
    raw.status === 'PAID'
      ? 'paid'
      : raw.status === 'PENDING'
        ? 'pending'
        : raw.status === 'EXPIRED'
          ? 'expired'
          : 'failed';
  const orderStatus: Order['orderStatus'] =
    raw.status === 'PAID'
      ? 'completed'
      : raw.status === 'PENDING'
        ? 'pending'
        : 'cancelled';

  const paymentProvider = latestPayment?.provider ?? 'xendit';
  const paymentMethod = latestPayment?.paymentMethod ?? 'QRIS';

  return {
    id: raw.id,
    orderNumber: raw.orderNumber,
    customerId: raw.userId ?? 'customer',
    bookId: firstItem?.ebookId ?? 'unknown',
    bookTitle: firstItem?.ebook?.title ?? 'E-Book Digital',
    bookAuthor: firstItem?.ebook?.author ?? 'Penulis',
    bookCategory: firstItem?.ebook?.category?.name ?? 'Umum',
    bookCoverAccent: 'blue',
    bookCoverCode: 'EBK',
    orderDate: raw.createdAt,
    expiresAt: latestPayment?.expiresAt ?? raw.expiresAt,
    totalAmount: Number(raw.totalAmount ?? 0),
    paymentStatus,
    orderStatus,
    transactionReference: latestPayment?.externalRef ?? undefined,
    paymentProvider,
    paymentMethod,
    qrPayload: latestPayment?.qrPayload ?? null,
    paymentConfigurationNote:
      paymentMethod.toUpperCase() === 'QRIS'
        ? `QRIS Dinamis via ${paymentProvider.toUpperCase()} (terhubung ke backend REST API).`
        : 'Diproses melalui backend REST API resmi.',
    verificationNote:
      paymentStatus === 'paid'
        ? 'Pembayaran QRIS terverifikasi otomatis oleh backend melalui webhook.'
        : 'Scan kode QRIS dinamis sebelum batas waktu berakhir. Status akan terverifikasi otomatis melalui webhook.',
    isSimulation: false,
  };
}

function readStoredOrders(): Order[] {
  try {
    const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return INITIAL_MOCK_ORDERS;
    const parsed = JSON.parse(raw) as Order[];
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : INITIAL_MOCK_ORDERS;
  } catch {
    return INITIAL_MOCK_ORDERS;
  }
}

export const orderService = {
  async getCustomerOrders(): Promise<Order[]> {
    if (getStoredAccessToken()) {
      try {
        const res = await fetchAuthenticatedApi<RawBackendOrder[]>(API_ENDPOINTS.ORDERS);
        if (res.ok && Array.isArray(res.body?.data)) {
          return res.body.data.map((item) => mapBackendOrder(item));
        }
      } catch {
        // Fallback ke DATA SIMULASI bila backend offline
      }
    }
    return readStoredOrders();
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    if (getStoredAccessToken()) {
      try {
        const res = await fetchAuthenticatedApi<RawBackendOrder>(
          API_ENDPOINTS.ORDER_BY_ID(orderId),
        );
        if (res.ok && res.body?.data) {
          return mapBackendOrder(res.body.data);
        }
        if (res.status === 404) return null;
      } catch {
        // Fallback ke DATA SIMULASI bila backend offline
      }
    }
    const orders = readStoredOrders();
    return orders.find((order) => order.id === orderId) ?? null;
  },

  async getSignedAccessUrl(bookId: string): Promise<{ signedUrl: string; expiresIn: number } | null> {
    if (!getStoredAccessToken()) return null;
    try {
      const res = await fetchAuthenticatedApi<{ signedUrl: string; expiresIn: number }>(
        API_ENDPOINTS.BOOK_ACCESS_URL(bookId),
      );
      if (res.ok && res.body?.data?.signedUrl) {
        return res.body.data;
      }
    } catch {
      return null;
    }
    return null;
  },

  async createSimulatedOrder(bookId: string, customerId: string): Promise<Order> {
    if (getStoredAccessToken()) {
      try {
        const res = await fetchAuthenticatedApi<{
          order: RawBackendOrder;
          payment?: RawBackendPayment;
        }>(API_ENDPOINTS.ORDERS, {
          method: 'POST',
          body: JSON.stringify({ ebookIds: [bookId] }),
        });
        if (res.ok && res.body?.data?.order) {
          return mapBackendOrder(res.body.data.order, res.body.data.payment);
        }
      } catch {
        // Fallback ke DATA SIMULASI bila backend offline atau bookId simulasi
      }
    }

    const book = MOCK_BOOKS.find((item) => item.id === bookId);
    if (!book) {
      throw new Error('E-book tidak ditemukan di katalog.');
    }

    const existingOrders = readStoredOrders();
    const existingForBook = existingOrders.find(
      (item) =>
        item.bookId === book.id &&
        (item.paymentStatus === 'paid' || item.paymentStatus === 'pending'),
    );

    if (existingForBook) {
      return existingForBook;
    }

    const now = new Date();
    const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const sequence = 1000 + existingOrders.length + 1;

    // Newly created orders always start as pending; only verified payments grant access.
    const newOrder: Order = {
      id: `ord-sim-${sequence}`,
      orderNumber: `ORD-20261114-${sequence}`,
      customerId,
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookCategory: book.categoryName,
      bookCoverAccent: book.coverAccent,
      bookCoverCode: book.coverCode,
      orderDate: now.toISOString(),
      expiresAt: expires.toISOString(),
      totalAmount: book.price,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      paymentConfigurationNote:
        'Menunggu penyelesaian pembayaran melalui mekanisme yang dikonfigurasi pada backend.',
      verificationNote:
        'DATA SIMULASI: Pesanan baru dibuat dalam status menunggu pembayaran. Akses baca e-book belum aktif sebelum verifikasi pembayaran diterima dari backend.',
      isSimulation: true,
    };

    const updated = [newOrder, ...existingOrders];
    window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    return newOrder;
  },

  async getAuthorizedLibrary(): Promise<PurchasedBookAccess[]> {
    const orders = readStoredOrders();
    const paidOrders = orders.filter(
      (order) =>
        order.paymentStatus === 'paid' && order.orderStatus === 'completed',
    );

    return paidOrders.map((order) => {
      const existingAccess = INITIAL_PURCHASED_LIBRARY.find(
        (item: PurchasedBookAccess) => item.bookId === order.bookId,
      );
      if (existingAccess) {
        return existingAccess;
      }

      const book = MOCK_BOOKS.find((item) => item.id === order.bookId);
      return {
        id: `acc-${order.id}`,
        customerId: order.customerId,
        bookId: order.bookId,
        orderId: order.id,
        orderNumber: order.orderNumber,
        title: order.bookTitle,
        author: order.bookAuthor,
        categoryName: order.bookCategory,
        coverAccent: order.bookCoverAccent,
        coverCode: order.bookCoverCode,
        purchaseDate: order.orderDate,
        paymentStatus: 'paid',
        accessStatus: 'granted',
        previewExcerpt:
          book?.description ??
          'Pratinjau isi e-book tersedia karena pembayaran telah terverifikasi.',
        isSimulation: true,
      };
    });
  },

  resetSimulatedOrders(): Order[] {
    window.localStorage.removeItem(ORDERS_STORAGE_KEY);
    return INITIAL_MOCK_ORDERS;
  },
};
