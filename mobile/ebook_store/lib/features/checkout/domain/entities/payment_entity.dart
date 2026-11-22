enum PaymentStatusEnum {
  pending,
  verified,
  failed,
  expired,
  cancelled;

  static PaymentStatusEnum fromString(String? value) {
    switch (value?.toUpperCase()) {
      case 'VERIFIED':
      case 'PAID':
      case 'SETTLEMENT':
      case 'CAPTURED':
        return PaymentStatusEnum.verified;
      case 'FAILED':
      case 'DENY':
        return PaymentStatusEnum.failed;
      case 'EXPIRED':
        return PaymentStatusEnum.expired;
      case 'CANCEL':
      case 'CANCELLED':
        return PaymentStatusEnum.cancelled;
      case 'PENDING':
      default:
        return PaymentStatusEnum.pending;
    }
  }

  String get label {
    switch (this) {
      case PaymentStatusEnum.verified:
        return 'Lunas';
      case PaymentStatusEnum.pending:
        return 'Menunggu Pembayaran';
      case PaymentStatusEnum.failed:
        return 'Gagal';
      case PaymentStatusEnum.expired:
        return 'Kedaluwarsa';
      case PaymentStatusEnum.cancelled:
        return 'Dibatalkan';
    }
  }
}

class PaymentEntity {
  final String id;
  final String orderId;
  final String provider;
  final String paymentMethod;
  final int amount;
  final PaymentStatusEnum status;
  final String? externalRef;
  final DateTime? expiresAt;
  final DateTime? paidAt;
  final DateTime? createdAt;

  const PaymentEntity({
    required this.id,
    required this.orderId,
    required this.provider,
    required this.paymentMethod,
    required this.amount,
    required this.status,
    this.externalRef,
    this.expiresAt,
    this.paidAt,
    this.createdAt,
  });

  bool get isPaid => status == PaymentStatusEnum.verified;
  bool get isPending => status == PaymentStatusEnum.pending;
  bool get isFailed => status == PaymentStatusEnum.failed;
  bool get isExpired => status == PaymentStatusEnum.expired;
}
