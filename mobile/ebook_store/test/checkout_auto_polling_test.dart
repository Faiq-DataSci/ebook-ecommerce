import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ebook_store/features/checkout/domain/entities/order_entity.dart';
import 'package:ebook_store/features/checkout/domain/repositories/checkout_repository.dart';
import 'package:ebook_store/features/checkout/presentation/providers/checkout_provider.dart';
import 'package:ebook_store/features/checkout/presentation/providers/checkout_state.dart';
import 'package:ebook_store/features/checkout/presentation/widgets/payment_gateway_pending_card.dart';

class FakeCheckoutRepositoryForPolling implements CheckoutRepository {
  OrderEntity currentMockOrder;

  FakeCheckoutRepositoryForPolling(this.currentMockOrder);

  @override
  Future<OrderEntity> createOrder(List<String> ebookIds) async =>
      currentMockOrder;

  @override
  Future<OrderEntity> getOrderById(String orderId) async => currentMockOrder;

  @override
  Future<List<OrderEntity>> getMyOrders({int page = 1, int limit = 10}) async =>
      [currentMockOrder];

  @override
  Future<OrderEntity> simulatePaymentSuccess(String orderId) async {
    currentMockOrder = OrderEntity(
      id: currentMockOrder.id,
      orderNumber: currentMockOrder.orderNumber,
      userId: currentMockOrder.userId,
      totalAmount: currentMockOrder.totalAmount,
      status: OrderStatusEnum.paid,
      expiresAt: currentMockOrder.expiresAt,
      createdAt: currentMockOrder.createdAt,
      items: currentMockOrder.items,
    );
    return currentMockOrder;
  }
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  final initialPendingOrder = OrderEntity(
    id: 'ord-test-poll-001',
    orderNumber: 'ORD-POLL-2026-001',
    userId: 'user-001',
    totalAmount: 120000,
    status: OrderStatusEnum.pending,
    expiresAt: DateTime.now().add(const Duration(hours: 24)),
    createdAt: DateTime.now(),
    items: const [],
  );

  group('P1.3 Auto-Polling Status Pesanan (PENDING -> PAID)', () {
    test(
      'CheckoutNotifier secara otomatis polling dan bertransisi ke completed saat order lunas',
      () async {
        final fakeRepo = FakeCheckoutRepositoryForPolling(initialPendingOrder);
        final notifier = CheckoutNotifier(repository: fakeRepo, isMock: false);

        // Resume order dalam status pending
        notifier.resumeOrder(initialPendingOrder);

        expect(notifier.state.currentStep, CheckoutStep.payment);
        expect(notifier.state.currentOrder?.status, OrderStatusEnum.pending);

        // Ubah status di backend/repo menjadi paid (mis. disimulasikan webhook masuk)
        fakeRepo.currentMockOrder = OrderEntity(
          id: initialPendingOrder.id,
          orderNumber: initialPendingOrder.orderNumber,
          userId: initialPendingOrder.userId,
          totalAmount: initialPendingOrder.totalAmount,
          status: OrderStatusEnum.paid,
          expiresAt: initialPendingOrder.expiresAt,
          createdAt: initialPendingOrder.createdAt,
          items: initialPendingOrder.items,
        );

        // Mulai polling dengan interval cepat 50ms untuk keperluan test
        notifier.startPollingOrderStatus(
          interval: const Duration(milliseconds: 50),
        );

        // Tunggu polling berjalan 1 tick
        await Future<void>.delayed(const Duration(milliseconds: 120));

        // State otomatis berubah menjadi completed & paid
        expect(notifier.state.currentStep, CheckoutStep.completed);
        expect(notifier.state.status, CheckoutStatus.completed);
        expect(notifier.state.currentOrder?.status, OrderStatusEnum.paid);

        notifier.dispose();
      },
    );

    testWidgets(
      'PaymentGatewayPendingCard menampilkan badge auto-polling aktif pada UI',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        await tester.pumpWidget(
          MaterialApp(
            home: Scaffold(
              body: SingleChildScrollView(
                child: PaymentGatewayPendingCard(
                  order: initialPendingOrder,
                  isCheckingStatus: false,
                  onCheckStatus: () {},
                  isMock: true,
                ),
              ),
            ),
          ),
        );

        await tester.pumpAndSettle();

        expect(
          find.text('Auto-polling aktif: memantau konfirmasi pelunasan...'),
          findsOneWidget,
        );
        expect(find.text('Menunggu Verifikasi Pembayaran'), findsOneWidget);
        expect(
          find.byKey(const Key('check_payment_status_button')),
          findsOneWidget,
        );
      },
    );
  });
}
