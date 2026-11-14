import type { PaymentStatus } from './payment.types';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'cancelled';

export type AccessStatus = 'granted' | 'locked' | 'revoked';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCategory: string;
  bookCoverAccent: 'yellow' | 'blue' | 'orange' | 'green' | 'pink';
  bookCoverCode: string;
  orderDate: string;
  expiresAt: string;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  transactionReference?: string;
  paymentConfigurationNote: string;
  verificationNote: string;
  isSimulation: boolean;
}

export interface PurchasedBookAccess {
  id: string;
  customerId: string;
  bookId: string;
  orderId: string;
  orderNumber: string;
  title: string;
  author: string;
  categoryName: string;
  coverAccent: 'yellow' | 'blue' | 'orange' | 'green' | 'pink';
  coverCode: string;
  purchaseDate: string;
  paymentStatus: PaymentStatus;
  accessStatus: AccessStatus;
  previewExcerpt: string;
  isSimulation: boolean;
}
