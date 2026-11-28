import '../../domain/entities/payment_entity.dart';

class PaymentModel extends PaymentEntity {
  const PaymentModel({
    required super.id,
    required super.orderId,
    required super.provider,
    required super.paymentMethod,
    required super.amount,
    required super.status,
    super.externalRef,
    super.qrId,
    super.qrString,
    super.channelCode,
    super.expiresAt,
    super.paidAt,
    super.createdAt,
  });

  factory PaymentModel.fromJson(Map<String, dynamic> json) {
    int parseAmount(dynamic val) {
      if (val is num) return val.toInt();
      if (val is String) {
        return (double.tryParse(val) ?? 0).toInt();
      }
      return 0;
    }

    DateTime? parseDate(dynamic val) {
      if (val == null) return null;
      if (val is String) return DateTime.tryParse(val);
      return null;
    }

    final rawQr = json['qrPayload'];
    final qrMap = rawQr is Map<String, dynamic> ? rawQr : null;

    return PaymentModel(
      id: (json['id'] ?? '').toString(),
      orderId: (json['orderId'] ?? '').toString(),
      provider: (json['provider'] ?? 'xendit').toString(),
      paymentMethod: (json['paymentMethod'] ?? 'QRIS').toString(),
      amount: parseAmount(json['amount']),
      status: PaymentStatusEnum.fromString(json['status']?.toString()),
      externalRef: json['externalRef']?.toString(),
      qrId: qrMap?['qrId']?.toString(),
      qrString: qrMap?['qrString']?.toString(),
      channelCode: qrMap?['channelCode']?.toString(),
      expiresAt: parseDate(json['expiresAt']),
      paidAt: parseDate(json['paidAt']),
      createdAt: parseDate(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'orderId': orderId,
      'provider': provider,
      'paymentMethod': paymentMethod,
      'amount': amount,
      'status': status.name.toUpperCase(),
      'externalRef': externalRef,
      if (qrString != null || qrId != null)
        'qrPayload': <String, dynamic>{
          'qrId': qrId,
          'qrString': qrString,
          'channelCode': channelCode,
        },
      'expiresAt': expiresAt?.toIso8601String(),
      'paidAt': paidAt?.toIso8601String(),
      'createdAt': createdAt?.toIso8601String(),
    };
  }
}
