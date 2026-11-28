import '../../domain/entities/order_entity.dart';
import '../../domain/entities/payment_entity.dart';
import '../models/order_model.dart';
import '../models/payment_model.dart';

abstract class CheckoutMockDataSource {
  Future<OrderModel> createOrder(List<String> ebookIds);
  Future<OrderModel> getOrderById(String orderId);
  Future<List<OrderModel>> getMyOrders({int page = 1, int limit = 10});
  Future<OrderModel> markOrderPaid(String orderId);
}

class CheckoutMockDataSourceImpl implements CheckoutMockDataSource {
  static const String simulationLabel = 'DATA SIMULASI';

  // In-memory orders store for offline testing and demo
  final List<OrderModel> _mockOrders = <OrderModel>[];

  CheckoutMockDataSourceImpl() {
    _seedDefaultMockOrders();
  }

  void _seedDefaultMockOrders() {
    final now = DateTime.now();
    _mockOrders.add(
      OrderModel(
        id: 'ord-sim-001',
        userId: 'usr-sim-100',
        orderNumber: 'ORD-SIM-202611-001',
        totalAmount: 133000,
        status: OrderStatusEnum.pending,
        expiresAt: now.add(const Duration(hours: 24)),
        createdAt: now.subtract(const Duration(minutes: 15)),
        items: const <OrderItemModel>[
          OrderItemModel(
            id: 'item-001',
            ebookId: 'eb-001',
            unitPrice: 65000,
            title:
                'Arsitektur Cloud & DevOps: Prinsip & Praktik Sistem Terdistribusi',
            author: 'Hendra Wijaya',
            categoryName: 'Teknologi',
          ),
          OrderItemModel(
            id: 'item-002',
            ebookId: 'eb-007',
            unitPrice: 68000,
            title: 'Desain Sistem Modern: Skalabilitas Tinggi',
            author: 'Ahmad Fauzi',
            categoryName: 'Rekayasa',
          ),
        ],
        payments: <PaymentModel>[
          PaymentModel(
            id: 'pay-sim-001',
            orderId: 'ord-sim-001',
            provider: 'xendit',
            paymentMethod: 'BCA Virtual Account',
            amount: 133000,
            status: PaymentStatusEnum.pending,
            externalRef: 'PAY-ORD-SIM-202611-001',
            expiresAt: now.add(const Duration(hours: 24)),
            createdAt: now.subtract(const Duration(minutes: 15)),
          ),
        ],
      ),
    );
  }

  @override
  Future<OrderModel> createOrder(List<String> ebookIds) async {
    await Future<void>.delayed(const Duration(milliseconds: 300));

    final now = DateTime.now();
    final randomSuffix = (now.millisecondsSinceEpoch % 10000)
        .toString()
        .padLeft(4, '0');
    final orderId = 'ord-sim-$randomSuffix';
    final orderNumber = 'ORD-SIM-$randomSuffix';
    final paymentRef = 'PAY-$orderNumber';

    final mockCatalogItems = <String, Map<String, dynamic>>{
      'eb-001': {
        'title':
            'Arsitektur Cloud & DevOps: Prinsip & Praktik Sistem Terdistribusi',
        'author': 'Hendra Wijaya',
        'price': 65000,
        'category': 'Teknologi',
      },
      'eb-007': {
        'title': 'Desain Sistem Modern: Skalabilitas Tinggi',
        'author': 'Ahmad Fauzi',
        'price': 68000,
        'category': 'Rekayasa',
      },
      'eb-002': {
        'title': 'Algoritma & Struktur Data Tingkat Lanjut',
        'author': 'Budi Santoso',
        'price': 55000,
        'category': 'Teknologi',
      },
      'eb-003': {
        'title': 'Psikologi Produk Digital & Konversi UI/UX',
        'author': 'Rina Dian',
        'price': 72000,
        'category': 'Desain',
      },
    };

    final orderItems = <OrderItemModel>[];
    int total = 0;

    for (final id in ebookIds) {
      final info =
          mockCatalogItems[id] ??
          {
            'title': 'E-Book Digital ($id)',
            'author': 'Penulis Terverifikasi',
            'price': 60000,
            'category': 'Teknologi',
          };
      final price = (info['price'] as num).toInt();
      total += price;

      orderItems.add(
        OrderItemModel(
          id: 'item-$id-$randomSuffix',
          ebookId: id,
          unitPrice: price,
          title: info['title'].toString(),
          author: info['author'].toString(),
          categoryName: info['category']?.toString(),
        ),
      );
    }

    final newPayment = PaymentModel(
      id: 'pay-$randomSuffix',
      orderId: orderId,
      provider: 'xendit',
      paymentMethod: 'BCA Virtual Account',
      amount: total,
      status: PaymentStatusEnum.pending,
      externalRef: paymentRef,
      expiresAt: now.add(const Duration(hours: 24)),
      createdAt: now,
    );

    final newOrder = OrderModel(
      id: orderId,
      userId: 'usr-sim-current',
      orderNumber: orderNumber,
      totalAmount: total,
      status: OrderStatusEnum.pending,
      expiresAt: now.add(const Duration(hours: 24)),
      createdAt: now,
      items: orderItems,
      payments: <PaymentModel>[newPayment],
    );

    _mockOrders.insert(0, newOrder);
    return newOrder;
  }

  @override
  Future<OrderModel> getOrderById(String orderId) async {
    await Future<void>.delayed(const Duration(milliseconds: 150));
    final found = _mockOrders.firstWhere(
      (o) => o.id == orderId || o.orderNumber == orderId,
      orElse: () =>
          throw Exception('Pesanan $orderId tidak ditemukan (DATA SIMULASI)'),
    );
    return found;
  }

  @override
  Future<List<OrderModel>> getMyOrders({int page = 1, int limit = 10}) async {
    await Future<void>.delayed(const Duration(milliseconds: 150));
    return List<OrderModel>.from(_mockOrders);
  }

  @override
  Future<OrderModel> markOrderPaid(String orderId) async {
    await Future<void>.delayed(const Duration(milliseconds: 200));
    final index = _mockOrders.indexWhere(
      (o) => o.id == orderId || o.orderNumber == orderId,
    );
    if (index < 0) {
      throw Exception('Pesanan tidak ditemukan');
    }

    final current = _mockOrders[index];
    final now = DateTime.now();

    final updatedPayments = current.payments.map((p) {
      return PaymentModel(
        id: p.id,
        orderId: p.orderId,
        provider: p.provider,
        paymentMethod: p.paymentMethod,
        amount: p.amount,
        status: PaymentStatusEnum.verified,
        externalRef: p.externalRef,
        expiresAt: p.expiresAt,
        paidAt: now,
        createdAt: p.createdAt,
      );
    }).toList();

    final paidOrder = OrderModel(
      id: current.id,
      userId: current.userId,
      orderNumber: current.orderNumber,
      totalAmount: current.totalAmount,
      status: OrderStatusEnum.paid,
      expiresAt: current.expiresAt,
      createdAt: current.createdAt,
      items: current.items,
      payments: updatedPayments,
    );

    _mockOrders[index] = paidOrder;
    return paidOrder;
  }
}
