import 'package:ebook_store/features/cart/domain/entities/cart_item.dart';
import 'package:ebook_store/features/cart/presentation/pages/cart_screen.dart';
import 'package:ebook_store/features/checkout/data/datasources/checkout_mock_datasource.dart';
import 'package:ebook_store/features/checkout/data/models/order_model.dart';
import 'package:ebook_store/features/checkout/domain/entities/order_entity.dart';
import 'package:ebook_store/features/checkout/domain/entities/payment_entity.dart';
import 'package:ebook_store/features/checkout/presentation/pages/checkout_screen.dart';
import 'package:ebook_store/features/checkout/presentation/providers/checkout_state.dart';
import 'package:ebook_store/features/checkout/presentation/widgets/checkout_stepper.dart';
import 'package:ebook_store/features/checkout/presentation/widgets/order_status_badge.dart';
import 'package:ebook_store/features/checkout/presentation/widgets/order_summary_card.dart';
import 'package:ebook_store/features/checkout/presentation/widgets/payment_gateway_card.dart';
import 'package:ebook_store/features/checkout/presentation/widgets/payment_gateway_pending_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

const _sampleCartItems = <CartItem>[
  CartItem(
    id: 'eb-001',
    title: 'Arsitektur Cloud & DevOps: Prinsip & Praktik Sistem Terdistribusi',
    author: 'Hendra Wijaya',
    pageCount: 450,
    category: 'Teknologi',
    sawRankLabel: 'Rank #2 SAW (V: 0.915)',
    price: 65000,
  ),
  CartItem(
    id: 'eb-007',
    title: 'Desain Sistem Modern: Skalabilitas Tinggi',
    author: 'Ahmad Fauzi',
    pageCount: 380,
    category: 'Rekayasa',
    sawRankLabel: 'Rank #1 SAW (V: 0.942)',
    price: 68000,
  ),
];

Future<void> _pumpCheckoutWidget(
  WidgetTester tester, {
  required Widget child,
  List<Override> overrides = const <Override>[],
  Size size = const Size(390, 884),
}) async {
  tester.view.physicalSize = size;
  tester.view.devicePixelRatio = 1.0;
  addTearDown(() {
    tester.view.resetPhysicalSize();
    tester.view.resetDevicePixelRatio();
  });

  await tester.pumpWidget(
    ProviderScope(
      overrides: overrides,
      child: MaterialApp(
        home: MediaQuery(
          data: MediaQueryData(size: size),
          child: child,
        ),
      ),
    ),
  );
  await tester.pumpAndSettle();
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Checkout & Payment (Zona C) - Unit Tests', () {
    test(
      '1. Model OrderModel & PaymentModel serialization / deserialization',
      () {
        final json = <String, dynamic>{
          'id': 'ord-test-01',
          'userId': 'usr-01',
          'orderNumber': 'ORD-TEST-001',
          'totalAmount': '133000.00',
          'status': 'PENDING',
          'expiresAt': '2026-11-23T12:00:00.000Z',
          'createdAt': '2026-11-22T12:00:00.000Z',
          'items': <Map<String, dynamic>>[
            {
              'id': 'item-01',
              'ebookId': 'eb-001',
              'unitPrice': '65000.00',
              'title': 'Arsitektur Cloud',
              'author': 'Hendra',
              'categoryName': 'Teknologi',
            },
          ],
          'payments': <Map<String, dynamic>>[
            {
              'id': 'pay-01',
              'orderId': 'ord-test-01',
              'provider': 'xendit',
              'paymentMethod': 'BCA Virtual Account',
              'amount': '133000.00',
              'status': 'PENDING',
              'externalRef': 'PAY-ORD-TEST-001',
            },
          ],
        };

        final order = OrderModel.fromJson(json);
        expect(order.id, 'ord-test-01');
        expect(order.orderNumber, 'ORD-TEST-001');
        expect(order.totalAmount, 133000);
        expect(order.status, OrderStatusEnum.pending);
        expect(order.items.length, 1);
        expect(order.items.first.title, 'Arsitektur Cloud');
        expect(order.payments.length, 1);
        expect(order.payments.first.provider, 'xendit');
        expect(order.payments.first.status, PaymentStatusEnum.pending);

        final serialized = order.toJson();
        expect(serialized['id'], 'ord-test-01');
        expect(serialized['status'], 'PENDING');
      },
    );

    test(
      '2. CheckoutMockDataSource creates order and marks paid properly',
      () async {
        final mock = CheckoutMockDataSourceImpl();
        final order = await mock.createOrder(<String>['eb-001', 'eb-007']);

        expect(order.items.length, 2);
        expect(order.totalAmount, 133000);
        expect(order.status, OrderStatusEnum.pending);

        final fetched = await mock.getOrderById(order.id);
        expect(fetched.id, order.id);

        final paid = await mock.markOrderPaid(order.id);
        expect(paid.status, OrderStatusEnum.paid);
        expect(paid.isPaid, isTrue);
      },
    );

    test('3. CheckoutState computed getters and copyWith', () {
      const state = CheckoutState(items: _sampleCartItems);

      expect(state.totalItemsCount, 2);
      expect(state.calculatedSubtotal, 133000);
      expect(state.canProceedToPay, isTrue);

      final updated = state.copyWith(
        currentStep: CheckoutStep.payment,
        isSubmitting: true,
      );
      expect(updated.currentStep, CheckoutStep.payment);
      expect(updated.isSubmitting, isTrue);
      expect(updated.canProceedToPay, isFalse);
    });
  });

  group('Checkout & Payment (Zona C) - Component Widget Tests', () {
    testWidgets(
      '4. CheckoutStepper merender 3 tahapan (Tinjau, Bayar, Selesai)',
      (tester) async {
        await _pumpCheckoutWidget(
          tester,
          child: const Scaffold(
            body: CheckoutStepper(currentStep: CheckoutStep.review),
          ),
        );

        expect(find.byKey(const Key('checkout_stepper')), findsOneWidget);
        expect(find.text('Tinjau'), findsOneWidget);
        expect(find.text('Bayar'), findsOneWidget);
        expect(find.text('Selesai'), findsOneWidget);
      },
    );

    testWidgets(
      '5. OrderSummaryCard menampilkan rincian buku dan total harga',
      (tester) async {
        await _pumpCheckoutWidget(
          tester,
          child: const Scaffold(
            body: OrderSummaryCard(cartItems: _sampleCartItems),
          ),
        );

        expect(find.byKey(const Key('order_summary_card')), findsOneWidget);
        expect(find.text('RINGKASAN PESANAN'), findsOneWidget);
        expect(find.text('2 E-BOOK'), findsOneWidget);
        expect(
          find.text(
            'Arsitektur Cloud & DevOps: Prinsip & Praktik Sistem Terdistribusi',
          ),
          findsOneWidget,
        );
        expect(
          find.text('Desain Sistem Modern: Skalabilitas Tinggi'),
          findsOneWidget,
        );
        expect(
          find.byKey(const Key('order_summary_total_amount')),
          findsOneWidget,
        );
        expect(find.text('Rp 133.000'), findsNWidgets(2));
      },
    );

    testWidgets(
      '6. PaymentGatewayCard menampilkan opsi kanal Xendit QRIS dan interaksi pilih',
      (tester) async {
        String selected = 'BCA Virtual Account';
        await _pumpCheckoutWidget(
          tester,
          child: StatefulBuilder(
            builder: (context, setState) {
              return Scaffold(
                body: PaymentGatewayCard(
                  selectedMethod: selected,
                  onSelectMethod: (val) => setState(() => selected = val),
                ),
              );
            },
          ),
        );

        expect(find.byKey(const Key('payment_gateway_card')), findsOneWidget);
        expect(find.text('XENDIT QRIS GATEWAY'), findsOneWidget);
        expect(find.text('BCA Virtual Account'), findsOneWidget);
        expect(find.text('QRIS (Gopay / ShopeePay / Dana)'), findsOneWidget);

        await tester.tap(
          find.byKey(
            const Key('payment_method_QRIS (Gopay / ShopeePay / Dana)'),
          ),
        );
        await tester.pumpAndSettle();

        expect(selected, 'QRIS (Gopay / ShopeePay / Dana)');
      },
    );

    testWidgets(
      '7. OrderStatusBadge merender status Lunas, Menunggu, Gagal, Kedaluwarsa',
      (tester) async {
        await _pumpCheckoutWidget(
          tester,
          child: const Scaffold(
            body: Column(
              children: <Widget>[
                OrderStatusBadge(orderStatus: OrderStatusEnum.paid),
                OrderStatusBadge(orderStatus: OrderStatusEnum.pending),
                OrderStatusBadge(orderStatus: OrderStatusEnum.failed),
                OrderStatusBadge(orderStatus: OrderStatusEnum.expired),
              ],
            ),
          ),
        );

        expect(find.text('LUNAS'), findsOneWidget);
        expect(find.text('MENUNGGU PEMBAYARAN'), findsOneWidget);
        expect(find.text('PESANAN GAGAL'), findsOneWidget);
        expect(find.text('KEDALUWARSA'), findsOneWidget);
      },
    );

    testWidgets(
      '8. PaymentGatewayPendingCard menampilkan nomor VA dan tombol Cek Status',
      (tester) async {
        final now = DateTime.now();
        final mockOrder = OrderEntity(
          id: 'ord-sim-01',
          userId: 'usr-01',
          orderNumber: 'ORD-SIM-1234',
          totalAmount: 133000,
          status: OrderStatusEnum.pending,
          expiresAt: now.add(const Duration(hours: 24)),
          createdAt: now,
          items: const <OrderItemEntity>[
            OrderItemEntity(
              id: 'it-01',
              ebookId: 'eb-001',
              unitPrice: 133000,
              title: 'Arsitektur Cloud',
              author: 'Hendra',
            ),
          ],
          payments: <PaymentEntity>[
            PaymentEntity(
              id: 'pay-01',
              orderId: 'ord-sim-01',
              provider: 'xendit',
              paymentMethod: 'BCA Virtual Account',
              amount: 133000,
              status: PaymentStatusEnum.pending,
              externalRef: 'PAY-ORD-SIM-1234',
            ),
          ],
        );

        bool checked = false;
        bool simulated = false;

        await _pumpCheckoutWidget(
          tester,
          child: Scaffold(
            body: PaymentGatewayPendingCard(
              order: mockOrder,
              isCheckingStatus: false,
              onCheckStatus: () => checked = true,
              onSimulatePay: () => simulated = true,
            ),
          ),
        );

        expect(
          find.byKey(const Key('payment_gateway_pending_card')),
          findsOneWidget,
        );
        expect(find.byKey(const Key('pending_va_number_text')), findsOneWidget);
        expect(
          find.byKey(const Key('pending_total_amount_text')),
          findsOneWidget,
        );
        expect(find.text('Rp 133.000'), findsOneWidget);

        await tester.tap(find.byKey(const Key('check_payment_status_button')));
        expect(checked, isTrue);

        await tester.tap(find.byKey(const Key('simulate_pay_button')));
        expect(simulated, isTrue);
      },
    );
  });

  group('Checkout & Payment (Zona C) - Full Flow Screen Tests', () {
    testWidgets('9. CheckoutScreen Alur Lengkap: Tinjau -> Bayar -> Selesai', (
      tester,
    ) async {
      await _pumpCheckoutWidget(
        tester,
        child: const CheckoutScreen(checkoutItems: _sampleCartItems),
      );

      // STEP 1: TINJAU
      expect(find.text('CHECKOUT & PEMBAYARAN'), findsOneWidget);
      expect(find.text('INFORMASI PRODUK DIGITAL'), findsOneWidget);
      expect(find.byKey(const Key('order_summary_card')), findsOneWidget);
      expect(
        find.byKey(const Key('checkout_proceed_to_pay_button')),
        findsOneWidget,
      );

      // Tap 'LANJUT KE PEMBAYARAN' -> Menuju STEP 2
      await tester.tap(find.byKey(const Key('checkout_proceed_to_pay_button')));
      await tester.pumpAndSettle();

      // STEP 2: BAYAR
      expect(
        find.byKey(const Key('checkout_order_number_text')),
        findsOneWidget,
      );
      expect(find.byKey(const Key('payment_gateway_card')), findsOneWidget);
      expect(find.byKey(const Key('checkout_pay_button')), findsOneWidget);

      // Tap 'BAYAR SEKARANG' -> Menuju STEP 3
      await tester.tap(find.byKey(const Key('checkout_pay_button')));
      await tester.pumpAndSettle();

      // STEP 3: SELESAI
      expect(find.byKey(const Key('checkout_success_card')), findsOneWidget);
      expect(find.text('PEMBAYARAN TERVERIFIKASI!'), findsOneWidget);
      expect(
        find.byKey(const Key('checkout_goto_library_button')),
        findsOneWidget,
      );
      expect(
        find.byKey(const Key('checkout_goto_orders_button')),
        findsOneWidget,
      );
    });

    testWidgets('10. Navigasi dari CartScreen Modal menuju CheckoutScreen', (
      tester,
    ) async {
      await _pumpCheckoutWidget(tester, child: const CartScreen());

      // Buka modal Checkout dari tombol checkout di keranjang
      await tester.tap(find.byKey(const Key('cart_checkout_button')));
      await tester.pumpAndSettle();

      expect(find.byKey(const Key('cart_checkout_modal')), findsOneWidget);

      // Tap tombol 'LANJUT KE CHECKOUT' di modal
      final proceedBtn = find.byKey(
        const Key('cart_proceed_to_checkout_stepper_button'),
      );
      expect(proceedBtn, findsOneWidget);
      await tester.tap(proceedBtn);
      await tester.pumpAndSettle();

      // Memastikan CheckoutScreen terbuka
      expect(find.byType(CheckoutScreen), findsOneWidget);
      expect(find.text('CHECKOUT & PEMBAYARAN'), findsOneWidget);
    });
  });
}
