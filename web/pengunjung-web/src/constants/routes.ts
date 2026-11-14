export const ROUTES = {
  HOME: '/',
  CATALOG: '/catalog',
  BOOK_DETAIL: (id = ':id') => `/books/${id}`,
  LOGIN: '/login',
  REGISTER: '/register',
  LIBRARY: '/library',
  ACCOUNT: '/account',
  ORDERS: '/orders',
  ORDER_DETAIL: (id = ':id') => `/orders/${id}`,
} as const;
