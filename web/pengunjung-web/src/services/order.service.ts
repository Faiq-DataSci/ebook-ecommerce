import {
  INITIAL_MOCK_ORDERS,
  INITIAL_PURCHASED_LIBRARY,
  MOCK_BOOKS,
} from '../data/mock-books';
import type { Order, PurchasedBookAccess } from '../types/order.types';

const ORDERS_STORAGE_KEY = 'ebook_store_sim_orders';

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
    return readStoredOrders();
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const orders = readStoredOrders();
    return orders.find((order) => order.id === orderId) ?? null;
  },

  async createSimulatedOrder(bookId: string, customerId: string): Promise<Order> {
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
        (item) => item.bookId === order.bookId,
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
