export const API_ENDPOINTS = {
  HEALTH: '/health',
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_ME: '/auth/me',
  BOOKS: '/ebooks',
  BOOK_BY_ID: (id: string) => `/ebooks/${id}`,
  BOOK_ACCESS_URL: (id: string) => `/ebooks/${id}/access-url`,
  CATEGORIES: '/categories',
  ORDERS: '/orders',
  ORDER_BY_ID: (id: string) => `/orders/${id}`,
  LIBRARY: '/library',
  SAW_RECOMMENDATIONS: '/recommendations/saw',
} as const;
