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
  recordedAt?: string;
  instructions: string[];
  verificationStatusText: string;
  isSimulation: boolean;
}
