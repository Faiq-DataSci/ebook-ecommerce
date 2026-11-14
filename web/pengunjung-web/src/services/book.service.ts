import { MOCK_BOOKS } from '../data/mock-books';
import { MOCK_CATEGORIES } from '../data/mock-categories';
import type { Book, Category } from '../types/book.types';

export const bookService = {
  async getCategories(): Promise<Category[]> {
    return MOCK_CATEGORIES;
  },

  async getAllBooks(): Promise<Book[]> {
    return MOCK_BOOKS;
  },

  async getFeaturedBooks(): Promise<Book[]> {
    return MOCK_BOOKS.filter((book) => book.isFeatured);
  },

  async getLatestBooks(limit = 4): Promise<Book[]> {
    return [...MOCK_BOOKS]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, limit);
  },

  async getBookById(id: string): Promise<Book | null> {
    return MOCK_BOOKS.find((book) => book.id === id) ?? null;
  },

  async getRelatedBooks(currentBook: Book, limit = 3): Promise<Book[]> {
    return MOCK_BOOKS.filter(
      (book) =>
        book.id !== currentBook.id &&
        book.categoryId === currentBook.categoryId,
    ).slice(0, limit);
  },

  async getAuthors(): Promise<string[]> {
    return Array.from(new Set(MOCK_BOOKS.map((book) => book.author))).sort();
  },
};
