import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ebook_store/core/config/api_config.dart';
import 'package:ebook_store/features/cart/domain/entities/cart_item.dart';
import 'package:ebook_store/features/checkout/data/models/order_model.dart';
import 'package:ebook_store/features/checkout/domain/entities/order_entity.dart';
import 'package:ebook_store/features/checkout/domain/repositories/checkout_repository.dart';
import 'package:ebook_store/features/checkout/presentation/pages/checkout_screen.dart';
import 'package:ebook_store/features/checkout/presentation/providers/checkout_provider.dart';
import 'package:ebook_store/features/home/data/datasources/recommendation_remote_datasource.dart';
import 'package:ebook_store/features/home/data/models/saw_recommendation_model.dart';
import 'package:ebook_store/features/home/data/repositories/recommendation_repository_impl.dart';
import 'package:ebook_store/features/home/domain/models/ebook.dart';
import 'package:ebook_store/features/home/presentation/pages/home_screen.dart';
import 'package:ebook_store/features/home/presentation/providers/home_provider.dart';

/// Fake Remote Checkout Repository simulating Express Backend REST API
class FakeRemoteCheckoutApiRepository implements CheckoutRepository {
  OrderEntity? lastCreatedOrder;
  bool returnPaidImmediately = false;

  @override
  Future<OrderEntity> createOrder(List<String> ebookIds) async {
    final now = DateTime.now();
    lastCreatedOrder = OrderEntity(
      id: '00000000-0000-4000-8000-000000000099',
      orderNumber: 'ORD-LIVE-${now.millisecondsSinceEpoch}',
      userId: '00000000-0000-4000-8000-000000000001',
      totalAmount: 85000,
      status: returnPaidImmediately
          ? OrderStatusEnum.paid
          : OrderStatusEnum.pending,
      expiresAt: now.add(const Duration(hours: 24)),
      createdAt: now,
      items: [
        OrderItemEntity(
          id: 'item-01',
          ebookId: ebookIds.first,
          unitPrice: 85000,
          title: 'Pemrograman Cloud & Microservices Modern',
          author: 'Prof. Budi Raharjo',
        ),
      ],
    );
    return lastCreatedOrder!;
  }

  @override
  Future<OrderEntity> getOrderById(String orderId) async {
    return lastCreatedOrder!;
  }

  @override
  Future<List<OrderEntity>> getMyOrders({int page = 1, int limit = 10}) async {
    return lastCreatedOrder != null ? [lastCreatedOrder!] : [];
  }

  @override
  Future<OrderEntity> simulatePaymentSuccess(String orderId) async {
    if (lastCreatedOrder != null) {
      lastCreatedOrder = lastCreatedOrder!.copyWith(
        status: OrderStatusEnum.paid,
      );
      return lastCreatedOrder!;
    }
    throw Exception('Order tidak ditemukan');
  }
}

/// Fake Remote Recommendation Datasource simulating GET /api/v1/recommendations/saw
class FakeRemoteSawDatasource implements RecommendationRemoteDataSource {
  @override
  Future<Ebook> getTopSawRecommendation({String? categoryId}) async {
    final backendJson = <String, dynamic>{
      'rank': 1,
      'ebookId': 'eb-007',
      'title': 'DATA SIMULASI - Desain Sistem Modern',
      'sawScore': 0.942,
      'displayScore': '0.942',
      'author': 'Prof. Budi Raharjo',
      'price': '85000',
      'coverUrl': 'https://example.com/cover3.png',
      'category': {'id': 'cat-01', 'name': 'Teknologi & AI'},
      'criteriaBreakdown': {
        'c1_price': {'normalized': 0.30, 'weighted': 0.075},
        'c2_rating': {'normalized': 0.50, 'weighted': 0.150},
        'c3_popularity': {'normalized': 0.20, 'weighted': 0.050},
        'c4_category': {'normalized': 0.20, 'weighted': 0.050},
      },
    };
    return SawRecommendationModel.fromJson(backendJson).toEbook();
  }

  @override
  Future<List<SawRecommendationModel>> getSawRankingList({
    String? categoryId,
    int limit = 10,
  }) async {
    return [];
  }
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Pengujian Integrasi End-to-End Live Backend Flow', () {
    test(
      '1. ApiConfig mengonfigurasi host dan baseUrl secara dinamis sesuai platform',
      () {
        expect(ApiConfig.baseUrl, isNotEmpty);
        expect(ApiConfig.baseUrl, contains('/api/v1'));
        // Default port 3000
        expect(ApiConfig.defaultPort, 3000);
      },
    );

    test(
      '2. CheckoutRemoteDataSource mengurai envelope respons pesanan backend Express secara presisi',
      () {
        final backendResponsePayload = <String, dynamic>{
          'success': true,
          'message': 'Pesanan berhasil dibuat',
          'data': {
            'order': {
              'id': '00000000-0000-4000-8000-000000000099',
              'orderNumber': 'ORD-2026-TEST-001',
              'userId': '00000000-0000-4000-8000-000000000001',
              'totalAmount': '85000.00',
              'status': 'PENDING',
              'expiresAt': '2026-11-24T12:00:00.000Z',
              'createdAt': '2026-11-23T12:00:00.000Z',
              'items': [
                {
                  'id': 'item-01',
                  'orderId': '00000000-0000-4000-8000-000000000099',
                  'ebookId': '00000000-0000-4000-8000-000000000003',
                  'price': '85000.00',
                  'ebook': {
                    'title': 'Pemrograman Cloud & Microservices Modern',
                    'coverUrl': 'https://example.com/cover3.png',
                  },
                },
              ],
            },
            'payment': {
              'id': 'pay-01',
              'orderId': '00000000-0000-4000-8000-000000000099',
              'amount': '85000.00',
              'status': 'PENDING',
              'paymentMethod': 'VA_BCA',
              'externalRef': 'TRX-BCA-998877',
            },
          },
        };

        final dataMap = backendResponsePayload['data'] as Map<String, dynamic>;
        final orderMap = dataMap['order'] as Map<String, dynamic>;
        final orderModel = OrderModel.fromJson(orderMap);

        expect(orderModel.id, '00000000-0000-4000-8000-000000000099');
        expect(orderModel.orderNumber, 'ORD-2026-TEST-001');
        expect(orderModel.totalAmount, 85000);
        expect(orderModel.status, OrderStatusEnum.pending);
        expect(orderModel.isPending, isTrue);
        expect(orderModel.isPaid, isFalse);
        expect(orderModel.items.length, 1);
        expect(
          orderModel.items.first.title,
          'Pemrograman Cloud & Microservices Modern',
        );
      },
    );

    testWidgets(
      '3. Alur E2E: Rekomendasi SAW Remote -> Tambah ke Keranjang -> Checkout Screen',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        final fakeRemoteSaw = FakeRemoteSawDatasource();
        final fakeRemoteCheckout = FakeRemoteCheckoutApiRepository();

        final recommendationRepo = RecommendationRepositoryImpl(
          remoteDataSource: fakeRemoteSaw,
          useRemote: true,
        );

        await tester.pumpWidget(
          ProviderScope(
            overrides: [
              recommendationRepositoryProvider.overrideWithValue(
                recommendationRepo,
              ),
              checkoutRepositoryProvider.overrideWithValue(fakeRemoteCheckout),
            ],
            child: const MaterialApp(home: HomeScreen()),
          ),
        );
        await tester.pumpAndSettle();

        // 1. Verifikasi Rekomendasi SAW Remote muncul di Beranda
        expect(find.text('#1 PILIHAN TERBAIK'), findsOneWidget);
        expect(find.text('SPK SAW AKTIF'), findsOneWidget);
        expect(
          find.text('DATA SIMULASI - Desain Sistem Modern'),
          findsOneWidget,
        );

        // 2. Buka Detail Rekomendasi
        final detailBtn = find.byKey(const Key('featured_saw_detail_button'));
        expect(detailBtn, findsOneWidget);
        await tester.ensureVisible(detailBtn);
        await tester.tap(detailBtn);
        await tester.pump(const Duration(milliseconds: 200));
        await tester.pumpAndSettle();

        // 3. Masukkan ke Keranjang Belanja
        final addToCartBtn = find.byKey(const Key('detail_add_to_cart_button'));
        expect(addToCartBtn, findsOneWidget);
        await tester.tap(addToCartBtn);
        await tester.pump();
        await tester.pump(const Duration(milliseconds: 300));

        expect(
          find.textContaining('berhasil dimasukkan ke keranjang'),
          findsOneWidget,
        );

        // 4. Kembali ke Beranda
        final backBtn = find.byKey(const Key('detail_back_button'));
        expect(backBtn, findsOneWidget);
        await tester.tap(backBtn);
        await tester.pumpAndSettle();

        // 5. Buka Keranjang Belanja dari Header
        final cartBtn = find.byKey(const Key('cart_button'));
        expect(cartBtn, findsOneWidget);
        await tester.tap(cartBtn);
        await tester.pumpAndSettle();

        expect(find.text('KERANJANG BELANJA'), findsOneWidget);

        // Pastikan floating snackbar sebelumnya sudah selesai sebelum interaksi bottom bar
        await tester.pump(const Duration(seconds: 3));
        await tester.pumpAndSettle();

        // 6. Tekan Checkout di Keranjang
        final cartCheckoutBtn = find.byKey(const Key('cart_checkout_button'));
        expect(cartCheckoutBtn, findsOneWidget);
        await tester.tap(cartCheckoutBtn);
        await tester.pumpAndSettle();

        expect(find.byKey(const Key('cart_checkout_modal')), findsOneWidget);

        // 7. Lanjut ke Checkout Stepper
        final proceedCheckoutBtn = find.byKey(
          const Key('cart_proceed_to_checkout_stepper_button'),
        );
        expect(proceedCheckoutBtn, findsOneWidget);
        await tester.tap(proceedCheckoutBtn);
        await tester.pumpAndSettle();

        // Berada di CheckoutScreen (STEP 1: TINJAU)
        expect(find.byType(CheckoutScreen), findsOneWidget);
        expect(find.text('CHECKOUT & PEMBAYARAN'), findsOneWidget);
      },
    );

    testWidgets(
      '4. Alur E2E Checkout: Pembuatan Pesanan Remote -> Menunggu Pelunasan -> Auto-Polling Selesai',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        final fakeRemoteCheckout = FakeRemoteCheckoutApiRepository();

        const testCartItem = CartItem(
          id: '00000000-0000-4000-8000-000000000003',
          title: 'Pemrograman Cloud & Microservices Modern',
          author: 'Prof. Budi Raharjo',
          pageCount: 380,
          category: 'Teknologi & AI',
          sawRankLabel: 'Rank #1 SAW (V: 0.942)',
          price: 85000,
          isSelected: true,
        );

        final container = ProviderContainer(
          overrides: [
            checkoutRepositoryProvider.overrideWithValue(fakeRemoteCheckout),
          ],
        );
        addTearDown(container.dispose);

        // Inisialisasi item di checkout notifier
        final checkoutNotifier = container.read(checkoutProvider.notifier);
        checkoutNotifier.initialize([testCartItem]);

        await tester.pumpWidget(
          UncontrolledProviderScope(
            container: container,
            child: const MaterialApp(
              home: CheckoutScreen(checkoutItems: [testCartItem]),
            ),
          ),
        );
        await tester.pumpAndSettle();

        // STEP 1: TINJAU
        expect(find.text('CHECKOUT & PEMBAYARAN'), findsOneWidget);
        final proceedToPayBtn = find.byKey(
          const Key('checkout_proceed_to_pay_button'),
        );
        expect(proceedToPayBtn, findsOneWidget);

        // Klik 'LANJUT KE PEMBAYARAN' -> Memicu createOrder di remote backend
        await tester.tap(proceedToPayBtn);
        await tester.pumpAndSettle();

        // STEP 2: BAYAR
        expect(find.byKey(const Key('payment_gateway_card')), findsOneWidget);
        expect(fakeRemoteCheckout.lastCreatedOrder, isNotNull);
        expect(
          fakeRemoteCheckout.lastCreatedOrder!.status,
          OrderStatusEnum.pending,
        );

        // Simulasikan backend memproses pembayaran webhook menjadi PAID
        fakeRemoteCheckout.lastCreatedOrder = fakeRemoteCheckout
            .lastCreatedOrder!
            .copyWith(status: OrderStatusEnum.paid);

        // Auto-polling memicu pembaruan status
        checkoutNotifier.startPollingOrderStatus(
          interval: const Duration(milliseconds: 50),
        );
        await tester.pump(const Duration(milliseconds: 100));
        await tester.pumpAndSettle();

        // STEP 3: SELESAI
        expect(find.byKey(const Key('checkout_success_card')), findsOneWidget);
        expect(find.text('PEMBAYARAN TERVERIFIKASI!'), findsOneWidget);
        expect(
          find.byKey(const Key('checkout_goto_library_button')),
          findsOneWidget,
        );
      },
    );
  });
}
