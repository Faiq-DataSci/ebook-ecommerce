import type { Order } from '../types/order.types';
import type { PaymentStatus, PaymentSummary } from '../types/payment.types';

export const paymentService = {
  buildPaymentSummary(
    order: Order,
    previewStatusOverride?: PaymentStatus,
  ): PaymentSummary {
    const activeStatus = previewStatusOverride ?? order.paymentStatus;
    const isQris =
      order.paymentMethod?.toUpperCase() === 'QRIS' ||
      Boolean(order.qrPayload?.qrString);
    const providerLabel =
      order.paymentProvider?.toUpperCase() === 'XENDIT'
        ? 'Xendit Dynamic QRIS'
        : isQris
          ? 'QRIS Dinamis'
          : 'Kanal pembayaran terkonfigurasi sistem';
    const isSimulation = order.isSimulation || Boolean(previewStatusOverride);

    switch (activeStatus) {
      case 'paid':
        return {
          transactionId: order.transactionReference ?? `TRX-SIM-${order.id.toUpperCase()}`,
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentStatus: 'paid',
          amount: order.totalAmount,
          paymentChannelLabel: isSimulation
            ? `${providerLabel} (DATA SIMULASI)`
            : providerLabel,
          paymentProvider: order.paymentProvider,
          paymentMethod: order.paymentMethod,
          qrPayload: order.qrPayload,
          recordedAt: order.orderDate,
          instructions: [
            'Pembayaran telah diverifikasi oleh sistem dan tercatat pada riwayat transaksi.',
            'Hak akses baca e-book digital telah diaktifkan pada halaman Pustaka Saya.',
          ],
          verificationStatusText:
            'Terverifikasi: Pembayaran valid dan hak akses e-book diberikan.',
          isSimulation,
        };
      case 'pending':
        return {
          transactionId:
            order.transactionReference ?? 'Belum diterbitkan (Menunggu Verifikasi)',
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentStatus: 'pending',
          amount: order.totalAmount,
          paymentChannelLabel: isQris
            ? `${providerLabel} (Scan QR untuk membayar)`
            : 'Menunggu pembayaran sesuai mekanisme yang dikonfigurasi pada backend',
          paymentProvider: order.paymentProvider,
          paymentMethod: order.paymentMethod,
          qrPayload: order.qrPayload,
          instructions: isQris
            ? [
                'Scan kode QRIS dinamis menggunakan aplikasi e-wallet atau mobile banking (nominal terisi otomatis).',
                'Setelah pembayaran selesai, Xendit mengirim webhook ke backend untuk membuka akses baca PDF.',
                'Klik tombol "Cek Status Pembayaran" bila status belum berubah secara otomatis.',
              ]
            : [
                'Selesaikan pembayaran sebelum batas waktu kedaluwarsa pesanan berakhir.',
                'Sistem hanya mencatat transaksi selesai setelah status pembayaran terverifikasi oleh backend.',
                'Selama status masih menunggu, e-book belum dapat dibuka di Pustaka Saya.',
              ],
          verificationStatusText:
            'Menunggu Verifikasi: Hak akses e-book masih terkunci hingga pembayaran terkonfirmasi.',
          isSimulation,
        };
      case 'failed':
        return {
          transactionId: order.transactionReference ?? 'Verifikasi Ditolak / Gagal',
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentStatus: 'failed',
          amount: order.totalAmount,
          paymentChannelLabel: isSimulation
            ? 'Otorisasi pembayaran tidak berhasil (DATA SIMULASI)'
            : `${providerLabel} — Gagal`,
          paymentProvider: order.paymentProvider,
          paymentMethod: order.paymentMethod,
          qrPayload: order.qrPayload,
          instructions: [
            'Pembayaran tidak berhasil diverifikasi oleh sistem.',
            'Tidak ada hak akses e-book yang diberikan untuk pesanan berstatus gagal.',
            'Silakan buat pesanan baru dari halaman detail e-book apabila Anda ingin membeli ulang.',
          ],
          verificationStatusText:
            'Gagal: Pembayaran tidak valid dan akses e-book tidak diberikan.',
          isSimulation,
        };
      case 'expired':
        return {
          transactionId:
            order.transactionReference ?? 'Tidak Ada Transaksi (Pesanan Kedaluwarsa)',
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentStatus: 'expired',
          amount: order.totalAmount,
          paymentChannelLabel: isSimulation
            ? 'Waktu pembayaran habis sebelum verifikasi diterima (DATA SIMULASI)'
            : `${providerLabel} — Kedaluwarsa`,
          paymentProvider: order.paymentProvider,
          paymentMethod: order.paymentMethod,
          qrPayload: order.qrPayload,
          instructions: [
            'Batas waktu pembayaran untuk pesanan ini telah terlewati.',
            'Pesanan yang kedaluwarsa otomatis ditutup dan tidak memberikan akses ke e-book.',
            'Anda dapat membuat pesanan baru melalui halaman katalog atau detail e-book.',
          ],
          verificationStatusText:
            'Kedaluwarsa: Batas waktu habis dan akses e-book tetap terkunci.',
          isSimulation,
        };
    }
  },
};
