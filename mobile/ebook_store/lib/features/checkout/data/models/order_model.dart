import '../../domain/entities/order_entity.dart';
import 'payment_model.dart';

class OrderItemModel extends OrderItemEntity {
  const OrderItemModel({
    required super.id,
    required super.ebookId,
    required super.unitPrice,
    required super.title,
    required super.author,
    super.coverUrl,
    super.categoryName,
  });

  factory OrderItemModel.fromJson(Map<String, dynamic> json) {
    int parsePrice(dynamic val) {
      if (val is num) return val.toInt();
      if (val is String) {
        return (double.tryParse(val) ?? 0).toInt();
      }
      return 0;
    }

    final ebook = json['ebook'] as Map<String, dynamic>?;
    final category = ebook?['category'] as Map<String, dynamic>?;

    return OrderItemModel(
      id: (json['id'] ?? '').toString(),
      ebookId: (json['ebookId'] ?? '').toString(),
      unitPrice: parsePrice(json['unitPrice']),
      title: (ebook?['title'] ?? json['title'] ?? 'E-Book Digital').toString(),
      author: (ebook?['author'] ?? json['author'] ?? 'Penulis').toString(),
      coverUrl: ebook?['coverUrl']?.toString() ?? json['coverUrl']?.toString(),
      categoryName:
          category?['name']?.toString() ?? json['categoryName']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'ebookId': ebookId,
      'unitPrice': unitPrice,
      'title': title,
      'author': author,
      'coverUrl': coverUrl,
      'categoryName': categoryName,
    };
  }
}

class OrderModel extends OrderEntity {
  const OrderModel({
    required super.id,
    required super.userId,
    required super.orderNumber,
    required super.totalAmount,
    required super.status,
    required super.expiresAt,
    required super.createdAt,
    required super.items,
    super.payments,
  });

  factory OrderModel.fromJson(Map<String, dynamic> json) {
    int parseAmount(dynamic val) {
      if (val is num) return val.toInt();
      if (val is String) {
        return (double.tryParse(val) ?? 0).toInt();
      }
      return 0;
    }

    DateTime parseDate(dynamic val, [DateTime? fallback]) {
      if (val is String) {
        final parsed = DateTime.tryParse(val);
        if (parsed != null) return parsed;
      }
      return fallback ?? DateTime.now();
    }

    final rawItems = json['items'];
    final items = <OrderItemEntity>[];
    if (rawItems is List) {
      for (final item in rawItems) {
        if (item is Map<String, dynamic>) {
          items.add(OrderItemModel.fromJson(item));
        }
      }
    }

    final rawPayments = json['payments'];
    final payments = <PaymentModel>[];
    if (rawPayments is List) {
      for (final p in rawPayments) {
        if (p is Map<String, dynamic>) {
          payments.add(PaymentModel.fromJson(p));
        }
      }
    }

    return OrderModel(
      id: (json['id'] ?? '').toString(),
      userId: (json['userId'] ?? '').toString(),
      orderNumber: (json['orderNumber'] ?? '').toString(),
      totalAmount: parseAmount(json['totalAmount']),
      status: OrderStatusEnum.fromString(json['status']?.toString()),
      expiresAt: parseDate(
        json['expiresAt'],
        DateTime.now().add(const Duration(hours: 24)),
      ),
      createdAt: parseDate(json['createdAt']),
      items: items,
      payments: payments,
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'userId': userId,
      'orderNumber': orderNumber,
      'totalAmount': totalAmount,
      'status': status.name.toUpperCase(),
      'expiresAt': expiresAt.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
      'items': items
          .whereType<OrderItemModel>()
          .map((i) => i.toJson())
          .toList(),
      'payments': payments
          .whereType<PaymentModel>()
          .map((p) => p.toJson())
          .toList(),
    };
  }
}
