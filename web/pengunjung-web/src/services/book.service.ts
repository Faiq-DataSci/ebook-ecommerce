import { MOCK_BOOKS } from '../data/mock-books';
import { MOCK_CATEGORIES } from '../data/mock-categories';
import type { Book, Category } from '../types/book.types';
import { fetchPublicApi } from './api/apiClient';
import { API_ENDPOINTS } from './api/endpoints';

interface RawPublicCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: {
    ebooks?: number;
  };
}

interface RawPublicEbook {
  id: string;
  categoryId: string;
  title: string;
  author: string;
  description: string;
  price: string | number;
  coverUrl?: string | null;
  pageCount?: number | null;
  publishedYear?: number | null;
  ratingAvg?: string | number | null;
  salesCount?: number | null;
  isActive?: boolean;
  createdAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

const CATEGORY_ACCENTS: Category['accentColor'][] = [
  'yellow',
  'blue',
  'green',
  'orange',
  'lavender',
  'pink',
];

const BOOK_ACCENTS: Book['coverAccent'][] = [
  'yellow',
  'blue',
  'green',
  'orange',
  'pink',
];

function hashIndex(seed: string, length: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash % length;
}

function mapBackendCategory(raw: RawPublicCategory, idx: number): Category {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description || `Koleksi e-book pilihan kategori ${raw.name}.`,
    accentColor: CATEGORY_ACCENTS[idx % CATEGORY_ACCENTS.length],
    bookCount: raw._count?.ebooks ?? 0,
    isSimulation: false,
  };
}

function mapBackendEbook(raw: RawPublicEbook, idx = 0): Book {
  const priceNum =
    typeof raw.price === 'number' ? raw.price : parseFloat(String(raw.price)) || 0;
  const ratingNum =
    raw.ratingAvg !== null && raw.ratingAvg !== undefined
      ? parseFloat(String(raw.ratingAvg)) || 0
      : 0;
  const salesCount = raw.salesCount ?? 0;
  const slugPrefix = (raw.category?.slug || 'EBK')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 3)
    .toUpperCase();

  return {
    id: raw.id,
    title: raw.title,
    author: raw.author,
    categoryId: raw.categoryId,
    categoryName: raw.category?.name || 'Umum',
    description: raw.description,
    price: priceNum,
    rating: ratingNum > 0 ? Number(ratingNum.toFixed(1)) : undefined,
    reviewCount: salesCount > 0 ? salesCount : undefined,
    formats: ['PDF'],
    coverImage: raw.coverUrl || '',
    coverAccent: BOOK_ACCENTS[hashIndex(raw.id || String(idx), BOOK_ACCENTS.length)],
    coverCode: `${slugPrefix}-${String(idx + 1).padStart(2, '0')}`,
    pageCount: raw.pageCount ?? undefined,
    publishedYear: raw.publishedYear ?? undefined,
    isFeatured: idx < 4 || ratingNum >= 4.5,
    createdAt: raw.createdAt,
    isSimulation: false,
  };
}

export const bookService = {
  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetchPublicApi<RawPublicCategory[]>(API_ENDPOINTS.CATEGORIES);
      if (res.ok && res.body?.data && Array.isArray(res.body.data)) {
        return res.body.data.map((cat, idx) => mapBackendCategory(cat, idx));
      }
    } catch {
      // Fallback ke DATA SIMULASI bila backend offline
    }
    return MOCK_CATEGORIES;
  },

  async getAllBooks(): Promise<Book[]> {
    try {
      const res = await fetchPublicApi<RawPublicEbook[]>(
        `${API_ENDPOINTS.BOOKS}?page=1&limit=50`,
      );
      if (res.ok && res.body?.data && Array.isArray(res.body.data)) {
        return res.body.data.map((book, idx) => mapBackendEbook(book, idx));
      }
    } catch {
      // Fallback ke DATA SIMULASI bila backend offline
    }
    return MOCK_BOOKS;
  },

  async getFeaturedBooks(): Promise<Book[]> {
    const books = await bookService.getAllBooks();
    const featured = books.filter((book) => book.isFeatured);
    return featured.length > 0 ? featured : books.slice(0, 4);
  },

  async getLatestBooks(limit = 4): Promise<Book[]> {
    const books = await bookService.getAllBooks();
    return [...books]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, limit);
  },

  async getBookById(id: string): Promise<Book | null> {
    try {
      const res = await fetchPublicApi<RawPublicEbook>(API_ENDPOINTS.BOOK_BY_ID(id));
      if (res.ok && res.body?.data) {
        return mapBackendEbook(res.body.data, 0);
      }
      if (res.status === 404) {
        return null;
      }
    } catch {
      // Fallback ke DATA SIMULASI bila backend offline
    }
    return MOCK_BOOKS.find((book) => book.id === id) ?? null;
  },

  async getRelatedBooks(currentBook: Book, limit = 3): Promise<Book[]> {
    const books = await bookService.getAllBooks();
    return books
      .filter(
        (book) =>
          book.id !== currentBook.id &&
          book.categoryId === currentBook.categoryId,
      )
      .slice(0, limit);
  },

  async getAuthors(): Promise<string[]> {
    const books = await bookService.getAllBooks();
    return Array.from(new Set(books.map((book) => book.author))).sort();
  },
};
