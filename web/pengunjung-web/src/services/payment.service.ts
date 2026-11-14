import type { Order } from '../types/order.types';
import type { PaymentStatus, PaymentSummary } from '../types/payment.types';

export const paymentService = {
  buildPaymentSummary(
    order: Order,
    previewStatusOverride?: PaymentStatus,
  ): PaymentSummary {
    const activeStatus = previewStatusOverride ?? order.paymentStatus;

    switch (activeStatus) {
      case 'paid':
        return {
          transactionId: order.transactionReference ?? `TRX-SIM-${order.id.toUpperCase()}`,
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentStatus: 'paid',
          amount: order.totalAmount,
          paymentChannelLabel:
            'Kanal pembayaran terkonfigurasi sistem (DATA SIMULASI)',
          recordedAt: order.orderDate,
          instructions: [
            'Pembayaran telah diverifikasi oleh sistem dan tercatat pada riwayat transaksi.',
            'Hak akses baca e-book digital telah diaktifkan pada halaman Pustaka Saya.',
          ],
          verificationStatusText:
            'Terverifikasi: Pembayaran valid dan hak akses e-book diberikan.',
          isSimulation: true,
        };
      case 'pending':
        return {
          transactionId: 'Belum diterbitkan (Menunggu Verifikasi)',
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentStatus: 'pending',
          amount: order.totalAmount,
          paymentChannelLabel:
            'Menunggu pembayaran sesuai mekanisme yang dikonfigurasi pada backend',
          instructions: [
            'Selesaikan pembayaran sebelum batas waktu kedaluwarsa pesanan berakhir.',
            'Sistem hanya mencatat transaksi selesai setelah status pembayaran terverifikasi oleh backend.',
            'Selama status masih menunggu, e-book belum dapat dibuka di Pustaka Saya.',
          ],
          verificationStatusText:
            'Menunggu Verifikasi: Hak akses e-book masih terkunci hingga pembayaran terkonfirmasi.',
          isSimulation: true,
        };
      case 'failed':
        return {
          transactionId: 'Verifikasi Ditolak / Gagal',
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentStatus: 'failed',
          amount: order.totalAmount,
          paymentChannelLabel:
            'Otorisasi pembayaran tidak berhasil (DATA SIMULASI)',
          instructions: [
            'Pembayaran tidak berhasil diverifikasi oleh sistem.',
            'Tidak ada hak akses e-book yang diberikan untuk pesanan berstatus gagal.',
            'Silakan buat pesanan baru dari halaman detail e-book apabila Anda ingin membeli ulang.',
          ],
          verificationStatusText:
            'Gagal: Pembayaran tidak valid dan akses e-book tidak diberikan.',
          isSimulation: true,
        };
      case 'expired':
        return {
          transactionId: 'Tidak Ada Transaksi (Pesanan Kedaluwarsa)',
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentStatus: 'expired',
          amount: order.totalAmount,
          paymentChannelLabel:
            'Waktu pembayaran habis sebelum verifikasi diterima (DATA SIMULASI)',
          instructions: [
            'Batas waktu pembayaran untuk pesanan ini telah terlewati.',
            'Pesanan yang kedaluwarsa otomatis ditutup dan tidak memberikan akses ke e-book.',
            'Anda dapat membuat pesanan baru melalui halaman katalog atau detail e-book.',
          ],
          verificationStatusText:
            'Kedaluwarsa: Batas waktu habis dan akses e-book tetap terkunci.',
          isSimulation: true,
        };
    }
  },
};
