import type { QrisPayload } from './order.types';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'expired';

export interface PaymentSummary {
  transactionId: string;
  orderId: string;
  orderNumber: string;
  paymentStatus: PaymentStatus;
  amount: number;
  paymentChannelLabel: string;
  paymentProvider?: string;
  paymentMethod?: string;
  qrPayload?: QrisPayload | null;
  recordedAt?: string;
  instructions: string[];
  verificationStatusText: string;
  isSimulation: boolean;
}
