import 'dart:ui';
import 'package:ebook_store/core/constants/app_assets.dart';
import 'package:ebook_store/features/cart/data/models/cart_item_model.dart';
import 'package:ebook_store/features/cart/presentation/pages/cart_screen.dart';
import 'package:ebook_store/features/cart/presentation/providers/cart_provider.dart';
import 'package:ebook_store/features/catalog/presentation/pages/ebook_detail_screen.dart';
import 'package:ebook_store/features/home/presentation/pages/home_screen.dart';
import 'package:ebook_store/main.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

Future<void> _pumpCartScreen(
  WidgetTester tester, {
  Size size = const Size(390, 884),
  double textScale = 1.0,
}) async {
  tester.view.physicalSize = size;
  tester.view.devicePixelRatio = 1.0;
  addTearDown(() {
    tester.view.resetPhysicalSize();
    tester.view.resetDevicePixelRatio();
  });

  await tester.pumpWidget(
    ProviderScope(
      child: MaterialApp(
        home: MediaQuery(
          data: MediaQueryData(
            size: size,
            textScaler: TextScaler.linear(textScale),
          ),
          child: const CartScreen(),
        ),
      ),
    ),
  );
  await tester.pumpAndSettle();
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Keranjang Belanja Mobile (Zona C) - Stitch Fidelity & Interaction Tests', () {
    testWidgets(
      '1. Merender seluruh komponen Keranjang Belanja Mobile (Zona C) sesuai Stitch pada 390x884',
      (WidgetTester tester) async {
        await _pumpCartScreen(tester);

        // Header
        expect(find.text('KERANJANG BELANJA'), findsOneWidget);
        expect(find.byKey(const Key('cart_back_button')), findsOneWidget);
        expect(find.byKey(const Key('cart_clear_all_button')), findsOneWidget);

        // Top Digital Product Notice + DATA SIMULASI Badge
        expect(find.byKey(const Key('cart_digital_notice')), findsOneWidget);
        expect(find.text('INFORMASI PRODUK DIGITAL'), findsOneWidget);
        expect(find.text('DATA SIMULASI'), findsOneWidget);
        expect(
          find.textContaining('Akses langsung ditambahkan ke Pustaka'),
          findsOneWidget,
        );

        // Bulk Selection Header Bar
        expect(find.text('PILIH SEMUA (2 E-BOOK)'), findsOneWidget);
        expect(find.text('HAPUS TERPILIH'), findsOneWidget);

        // Item 1: Arsitektur Cloud & DevOps
        expect(find.byKey(const Key('cart_item_card_eb-001')), findsOneWidget);
        expect(find.text('Rank #2 SAW (V: 0.915)'), findsOneWidget);
        expect(find.text('TEKNOLOGI'), findsOneWidget);
        expect(
          find.text(
            'Arsitektur Cloud & DevOps: Prinsip & Praktik Sistem Terdistribusi',
          ),
          findsOneWidget,
        );
        expect(find.text('Hendra Wijaya \u2022 450 Hal'), findsOneWidget);
        expect(find.text('PDF + EPUB'), findsOneWidget);
        expect(find.text('Rp 65.000'), findsOneWidget);
        expect(find.text('Rp 95.000'), findsOneWidget);

        // Item 2: Desain Sistem Modern
        expect(find.byKey(const Key('cart_item_card_eb-007')), findsOneWidget);
        expect(find.text('Rank #1 SAW (V: 0.942)'), findsOneWidget);
        expect(find.text('REKAYASA'), findsOneWidget);
        expect(
          find.text('Desain Sistem Modern: Skalabilitas Tinggi'),
          findsOneWidget,
        );
        expect(find.text('Ahmad Fauzi \u2022 380 Hal'), findsOneWidget);
        expect(find.text('Rp 68.000'), findsOneWidget);
        expect(find.text('1 LISENSI DIGITAL'), findsNWidgets(2));

        // Scroll ke Kupon & Ringkasan Transaksi
        await tester.drag(
          find.byKey(const Key('cart_scroll_view')),
          const Offset(0, -350),
        );
        await tester.pumpAndSettle();

        // Promo Section
        expect(find.text('KUPON & KODE PROMO'), findsOneWidget);
        expect(find.text('TERAPKAN'), findsOneWidget);
        expect(find.text('HEMAT 10K'), findsOneWidget);
        expect(find.text('(-Rp 10.000)'), findsOneWidget);

        // Ringkasan Transaksi (SAW-C2-PAY)
        expect(find.text('RINGKASAN TRANSAKSI'), findsOneWidget);
        expect(find.text('SAW-C2-PAY'), findsOneWidget);
        expect(find.text('Total Harga (2 E-book)'), findsOneWidget);
        expect(find.text('Rp 133.000'), findsOneWidget);
        expect(find.text('-Rp 10.000'), findsOneWidget);
        expect(find.text('Biaya Sinkronisasi Cloud'), findsOneWidget);
        expect(find.text('Rp 1.000'), findsOneWidget);
        expect(find.text('TOTAL TAGIHAN'), findsOneWidget);

        // Sticky Bottom Checkout Bar
        expect(find.text('TOTAL BAYAR'), findsOneWidget);
        expect(find.text('Rp 124.000'), findsNWidgets(2));
        expect(find.text('Hemat Rp 10.000'), findsOneWidget);
        expect(find.text('CHECKOUT'), findsOneWidget);
      },
    );

    testWidgets(
      '2. Responsif tanpa overflow pada ukuran layar mobile (320, 360, 390, 412, 430) dan zoom teks',
      (WidgetTester tester) async {
        final viewports = <Size>[
          const Size(320, 640),
          const Size(360, 800),
          const Size(390, 884),
          const Size(412, 915),
          const Size(430, 932),
        ];

        for (final size in viewports) {
          await _pumpCartScreen(tester, size: size);
          expect(find.byType(CartScreen), findsOneWidget);
          expect(tester.takeException(), isNull);
        }

        // Verifikasi skala teks diperbesar (aksesibilitas zoom)
        await _pumpCartScreen(
          tester,
          size: const Size(390, 884),
          textScale: 1.35,
        );
        expect(find.byType(CartScreen), findsOneWidget);
        expect(tester.takeException(), isNull);
      },
    );

    testWidgets(
      '3. Checkbox Pilih Semua & per-item memperbarui kalkulasi Ringkasan Transaksi secara dinamis',
      (WidgetTester tester) async {
        await _pumpCartScreen(tester);

        // Uncheck item pertama (Rp 65.000) -> tersisa item kedua (Rp 68.000)
        // Total = 68.000 - 10.000 + 1.000 = Rp 59.000
        await tester.tap(find.byKey(const Key('cart_item_checkbox_eb-001')));
        await tester.pumpAndSettle();

        expect(find.text('Total Harga (1 E-book)'), findsOneWidget);
        expect(find.text('Rp 59.000'), findsNWidgets(2));

        // Uncheck item kedua -> 0 terpilih -> Total Rp 0
        await tester.tap(find.byKey(const Key('cart_item_checkbox_eb-007')));
        await tester.pumpAndSettle();

        expect(find.text('Total Harga (0 E-book)'), findsOneWidget);

        // Klik Pilih Semua -> kembali 2 item terpilih -> Rp 124.000
        await tester.tap(find.byKey(const Key('cart_select_all_checkbox')));
        await tester.pumpAndSettle();

        expect(find.text('Total Harga (2 E-book)'), findsOneWidget);
        expect(find.text('Rp 124.000'), findsNWidgets(2));
      },
    );

    testWidgets(
      '4. Interaksi Kupon Promo: hapus kupon, validasi kode salah, dan terapkan kode SAWHEMAT',
      (WidgetTester tester) async {
        await _pumpCartScreen(tester);

        final removePromoBtn = find.byKey(const Key('cart_remove_promo_button'));
        await tester.ensureVisible(removePromoBtn);
        await tester.pumpAndSettle();

        // Hapus kupon aktif BUKUBARU -> Total menjadi 133.000 + 1.000 = Rp 134.000
        await tester.tap(removePromoBtn);
        await tester.pumpAndSettle();

        expect(find.byKey(const Key('cart_active_promo_pill')), findsNothing);
        expect(find.text('Rp 134.000'), findsNWidgets(2));

        // Masukkan kode promo tidak valid
        final promoInput = find.byKey(const Key('cart_promo_input'));
        await tester.enterText(promoInput, 'KODEPALSU');
        await tester.tap(find.byKey(const Key('cart_promo_apply_button')));
        await tester.pumpAndSettle();

        expect(find.byKey(const Key('cart_promo_error_banner')), findsOneWidget);

        // Masukkan kode promo valid SAWHEMAT (-Rp 15.000) -> 133.000 - 15.000 + 1.000 = Rp 119.000
        await tester.enterText(promoInput, 'SAWHEMAT');
        await tester.tap(find.byKey(const Key('cart_promo_apply_button')));
        await tester.pumpAndSettle();

        expect(find.byKey(const Key('cart_promo_error_banner')), findsNothing);
        expect(find.text('HEMAT 15K'), findsOneWidget);
        expect(find.text('Rp 119.000'), findsNWidgets(2));
      },
    );

    testWidgets(
      '5. Hapus item individual, Hapus Terpilih, dan dialog konfirmasi Hapus Semua',
      (WidgetTester tester) async {
        await _pumpCartScreen(tester);

        // Hapus item pertama
        await tester.tap(find.byKey(const Key('cart_item_delete_eb-001')));
        await tester.pumpAndSettle();

        expect(find.byKey(const Key('cart_item_card_eb-001')), findsNothing);
        expect(find.text('PILIH SEMUA (1 E-BOOK)'), findsOneWidget);

        // Buka dialog konfirmasi hapus seluruh keranjang
        await tester.tap(find.byKey(const Key('cart_clear_all_button')));
        await tester.pumpAndSettle();

        expect(find.byKey(const Key('cart_clear_confirm_dialog')), findsOneWidget);

        // Batal terlebih dahulu
        await tester.tap(find.byKey(const Key('cart_clear_cancel_button')));
        await tester.pumpAndSettle();
        expect(find.byKey(const Key('cart_item_card_eb-007')), findsOneWidget);

        // Hapus Terpilih -> keranjang kosong (Empty State)
        await tester.tap(find.byKey(const Key('cart_delete_selected_button')));
        await tester.pumpAndSettle();

        expect(find.byKey(const Key('cart_empty_state')), findsOneWidget);
        expect(find.text('KERANJANG ANDA MASIH KOSONG'), findsOneWidget);
      },
    );

    testWidgets(
      '6. Dialog info Biaya Sinkronisasi Cloud dan modal ringkasan Checkout (DATA SIMULASI)',
      (WidgetTester tester) async {
        await _pumpCartScreen(tester);

        final helpBtn = find.byKey(const Key('cart_cloud_fee_help_button'));
        await tester.ensureVisible(helpBtn);
        await tester.pumpAndSettle();
        await tester.tap(helpBtn);
        await tester.pumpAndSettle();

        expect(find.byKey(const Key('cart_cloud_fee_dialog')), findsOneWidget);
        await tester.tap(
          find.byKey(const Key('cart_close_cloud_fee_dialog_button')),
        );
        await tester.pumpAndSettle();

        // Tap tombol Checkout di sticky bottom bar
        await tester.tap(find.byKey(const Key('cart_checkout_button')));
        await tester.pumpAndSettle();

        expect(find.byKey(const Key('cart_checkout_modal')), findsOneWidget);
        expect(find.text('Ringkasan Pesanan Digital'), findsOneWidget);

        await tester.tap(
          find.byKey(const Key('cart_close_checkout_modal_button')),
        );
        await tester.pumpAndSettle();
        expect(find.byKey(const Key('cart_checkout_modal')), findsNothing);
      },
    );

    testWidgets(
      '7. Menangani 3 kondisi UI wajib: Loading, Error (dengan Coba Lagi), dan Empty State (Quick Add SAW)',
      (WidgetTester tester) async {
        await _pumpCartScreen(tester);

        final element = tester.element(find.byType(Scaffold).first);
        final container = ProviderScope.containerOf(element);

        // 1. Loading State
        container
            .read(cartProvider.notifier)
            .setLoadStatus(CartStatus.loading);
        await tester.pump();
        expect(find.byKey(const Key('cart_loading_state')), findsOneWidget);
        expect(find.text('MEMUAT KERANJANG BELANJA...'), findsOneWidget);

        // 2. Error State + Retry
        container.read(cartProvider.notifier).setLoadStatus(CartStatus.error);
        await tester.pumpAndSettle();
        expect(find.byKey(const Key('cart_error_state')), findsOneWidget);
        expect(find.text('GAGAL MEMUAT KERANJANG'), findsOneWidget);

        await tester.tap(find.byKey(const Key('cart_error_retry_button')));
        await tester.pumpAndSettle();
        expect(find.byKey(const Key('cart_item_card_eb-001')), findsOneWidget);

        // 3. Empty State + Quick Add Rekomendasi SAW
        container.read(cartProvider.notifier).setLoadStatus(CartStatus.empty);
        await tester.pumpAndSettle();
        expect(find.byKey(const Key('cart_empty_state')), findsOneWidget);
        expect(
          find.text('STATUS: CART_EMPTY // SUBTOTAL: RP 0'),
          findsOneWidget,
        );
        expect(find.text('REKOMENDASI TERATAS SAW'), findsOneWidget);

        final quickAddBtn = find.byKey(const Key('cart_quick_add_eb-001'));
        await tester.ensureVisible(quickAddBtn);
        await tester.pumpAndSettle();
        await tester.tap(quickAddBtn);
        await tester.pumpAndSettle();

        expect(find.byKey(const Key('cart_empty_state')), findsNothing);
        expect(find.text('Arsitektur Cloud Modern'), findsOneWidget);
      },
    );

    testWidgets(
      '8. Navigasi dari HomeScreen ke CartScreen dan menuju EbookDetailScreen',
      (WidgetTester tester) async {
        tester.view.physicalSize = const Size(390, 884);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        await tester.pumpWidget(const MyApp(initialScreen: HomeScreen()));
        await tester.pumpAndSettle();

        // Tap tombol Cart pada header Beranda
        await tester.tap(find.byKey(const Key('cart_button')));
        await tester.pumpAndSettle();

        expect(find.byType(CartScreen), findsOneWidget);
        expect(find.text('KERANJANG BELANJA'), findsOneWidget);

        // Tap judul buku untuk membuka EbookDetailScreen
        await tester.tap(find.byKey(const Key('cart_item_title_eb-001')));
        await tester.pump(const Duration(milliseconds: 200));
        await tester.pumpAndSettle();

        expect(find.byType(EbookDetailScreen), findsOneWidget);
        expect(find.text('Detail E-Book'), findsOneWidget);

        // Kembali ke CartScreen lalu kembali ke HomeScreen
        await tester.tap(find.byKey(const Key('detail_back_button')));
        await tester.pumpAndSettle();
        expect(find.byType(CartScreen), findsOneWidget);

        await tester.tap(find.byKey(const Key('cart_back_button')));
        await tester.pumpAndSettle();
        expect(find.byType(HomeScreen), findsOneWidget);
      },
    );

    test('9. Unit test CartItemModel serialization & validasi byte cover AppAssets', () {
      const model = CartItemModel(
        id: 'eb-001',
        title: 'Arsitektur Cloud & DevOps',
        author: 'Hendra Wijaya',
        pageCount: 450,
        category: 'Teknologi',
        sawRankLabel: 'Rank #2 SAW (V: 0.915)',
        isTopSawRank: false,
        formatLabel: 'PDF + EPUB',
        price: 65000,
        originalPrice: 95000,
      );

      final json = model.toJson();
      final parsed = CartItemModel.fromJson(json);

      expect(parsed.id, 'eb-001');
      expect(parsed.title, 'Arsitektur Cloud & DevOps');
      expect(parsed.price, 65000);
      expect(parsed.originalPrice, 95000);
      expect(parsed.hasDiscount, isTrue);
      expect(parsed.formattedPrice, 'Rp 65.000');
      expect(parsed.formattedOriginalPrice, 'Rp 95.000');

      for (final assetPath in <String>[
        AppAssets.coverDesainSistemModern,
        AppAssets.coverAlgoritmaStrukturData,
        AppAssets.coverPsikologiProdukDigital,
        AppAssets.coverArsitekturCloudDevops,
      ]) {
        final bytes = AppAssets.getEmbeddedBytes(assetPath);
        expect(bytes, isNotNull);
        expect(bytes!.length, greaterThan(100));
        expect(bytes[0], 0xFF);
        expect(bytes[1], 0xD8);
      }
    });

    testWidgets(
      '10. Navigasi mouse hover + tap pada cart_button di dalam DevicePreview tanpa OverlayPortal assertion',
      (WidgetTester tester) async {
        tester.view.physicalSize = const Size(1280, 900);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        await tester.pumpWidget(
          const MyApp(
            enableDevicePreview: true,
            initialScreen: HomeScreen(),
          ),
        );
        await tester.pumpAndSettle();

        final cartBtn = find.byKey(const Key('cart_button'));
        expect(cartBtn, findsOneWidget);

        // Simulasikan mouse hover di atas tombol keranjang sebelum klik
        final gesture = await tester.createGesture(kind: PointerDeviceKind.mouse);
        await gesture.addPointer(location: Offset.zero);
        addTearDown(gesture.removePointer);
        await gesture.moveTo(tester.getCenter(cartBtn));
        await tester.pump(const Duration(milliseconds: 600));

        await tester.tap(cartBtn);
        await tester.pumpAndSettle();

        expect(find.byType(CartScreen), findsOneWidget);
        expect(find.text('KERANJANG BELANJA'), findsOneWidget);

        // Hover dan klik tombol kembali dari CartScreen
        final backBtn = find.byKey(const Key('cart_back_button'));
        await gesture.moveTo(tester.getCenter(backBtn));
        await tester.pump(const Duration(milliseconds: 600));
        await tester.tap(backBtn);
        await tester.pumpAndSettle();

        expect(find.byType(HomeScreen), findsOneWidget);
      },
    );
  });
}
