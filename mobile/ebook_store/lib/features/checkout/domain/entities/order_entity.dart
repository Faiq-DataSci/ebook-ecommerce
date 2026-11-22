import '../../../../core/utils/rupiah_formatter.dart';
import 'payment_entity.dart';

enum OrderStatusEnum {
  pending,
  paid,
  failed,
  expired,
  cancelled;

  static OrderStatusEnum fromString(String? value) {
    switch (value?.toUpperCase()) {
      case 'PAID':
        return OrderStatusEnum.paid;
      case 'FAILED':
        return OrderStatusEnum.failed;
      case 'EXPIRED':
        return OrderStatusEnum.expired;
      case 'CANCELLED':
        return OrderStatusEnum.cancelled;
      case 'PENDING':
      default:
        return OrderStatusEnum.pending;
    }
  }

  String get label {
    switch (this) {
      case OrderStatusEnum.paid:
        return 'Lunas';
      case OrderStatusEnum.pending:
        return 'Menunggu Pembayaran';
      case OrderStatusEnum.failed:
        return 'Pesanan Gagal';
      case OrderStatusEnum.expired:
        return 'Kedaluwarsa';
      case OrderStatusEnum.cancelled:
        return 'Dibatalkan';
    }
  }
}

class OrderItemEntity {
  final String id;
  final String ebookId;
  final int unitPrice;
  final String title;
  final String author;
  final String? coverUrl;
  final String? categoryName;

  const OrderItemEntity({
    required this.id,
    required this.ebookId,
    required this.unitPrice,
    required this.title,
    required this.author,
    this.coverUrl,
    this.categoryName,
  });

  String get formattedUnitPrice => formatRupiah(unitPrice);
}

class OrderEntity {
  final String id;
  final String userId;
  final String orderNumber;
  final int totalAmount;
  final OrderStatusEnum status;
  final DateTime expiresAt;
  final DateTime createdAt;
  final List<OrderItemEntity> items;
  final List<PaymentEntity> payments;

  const OrderEntity({
    required this.id,
    required this.userId,
    required this.orderNumber,
    required this.totalAmount,
    required this.status,
    required this.expiresAt,
    required this.createdAt,
    required this.items,
    this.payments = const <PaymentEntity>[],
  });

  String get formattedTotalAmount => formatRupiah(totalAmount);
  bool get isPaid => status == OrderStatusEnum.paid;
  bool get isPending => status == OrderStatusEnum.pending;
  bool get isFailed => status == OrderStatusEnum.failed;
  bool get isExpired => status == OrderStatusEnum.expired;

  PaymentEntity? get latestPayment =>
      payments.isNotEmpty ? payments.last : null;
}
