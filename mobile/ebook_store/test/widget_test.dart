import 'package:device_preview/device_preview.dart';
import 'package:ebook_store/main.dart';
import 'package:ebook_store/features/home/presentation/providers/home_provider.dart';
import 'package:ebook_store/features/home/presentation/pages/home_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

Future<void> _pumpAtViewport(WidgetTester tester, Size size) async {
  tester.view.physicalSize = size;
  tester.view.devicePixelRatio = 1.0;
  addTearDown(() {
    tester.view.resetPhysicalSize();
    tester.view.resetDevicePixelRatio();
  });

  await tester.pumpWidget(const MyApp(initialScreen: HomeScreen()));
  await tester.pumpAndSettle();
}

void main() {
  group('Beranda Mobile (Neubrutalism) - Stitch Fidelity & Responsive Tests', () {
    testWidgets(
      'Renders all Google Stitch sections without overflow at 390x884 reference viewport',
      (WidgetTester tester) async {
        await _pumpAtViewport(tester, const Size(390, 884));

        // Header & Greeting
        expect(find.text('BUKUKITA'), findsOneWidget);
        expect(find.byKey(const Key('cart_badge_text')), findsOneWidget);
        expect(find.text('2'), findsOneWidget);
        expect(find.text('Halo, Raditya'), findsOneWidget);
        expect(find.text('Mau baca apa hari ini?'), findsOneWidget);
        expect(find.text('KURASI PINTAR'), findsOneWidget);

        // Search Bar
        expect(
          find.widgetWithText(TextField, 'Cari judul, penulis, ISBN...'),
          findsOneWidget,
        );

        // Hero Banner (Zona A)
        expect(find.text('ASISTEN BACAAN'), findsOneWidget);
        expect(find.text('Bingung Pilih Buku?'), findsOneWidget);
        expect(find.text('CARI REKOMENDASI BUKU'), findsOneWidget);

        // Categories (Section 4)
        expect(find.text('KATEGORI PILIHAN'), findsOneWidget);
        expect(find.text('6 Bidang'), findsOneWidget);
        expect(find.text('Semua'), findsOneWidget);
        expect(find.text('Teknologi & AI'), findsOneWidget);

        // Featured Recommendation #1 Card (Zona B - Customer-friendly SAW output)
        expect(find.text('Rekomendasi Terbaik Untukmu'), findsOneWidget);
        expect(find.text('PILIHAN UTAMA'), findsOneWidget);
        expect(find.text('#1 PILIHAN TERBAIK'), findsOneWidget);
        expect(find.text('Desain Sistem Modern'), findsOneWidget);
        expect(find.text('Ahmad Fauzi'), findsOneWidget);
        expect(find.text('Rp 68.000'), findsOneWidget);
        expect(find.text('TINGKAT KECOCOKAN'), findsOneWidget);
        expect(find.text('94% COCOK'), findsOneWidget);
        expect(find.text('Lihat Detail Buku'), findsOneWidget);

        // Scroll down to verify Latest Releases & Flash Sale Bundles
        await tester.drag(
          find.byKey(const Key('home_scroll_view')),
          const Offset(0, -600),
        );
        await tester.pumpAndSettle();

        expect(find.text('Rilisan Terbaru'), findsOneWidget);
        expect(find.text('Lihat Semua'), findsOneWidget);
        expect(find.text('Algoritma & Struktur Data Praktis'), findsOneWidget);
        expect(find.text('Budi Santoso'), findsOneWidget);
        expect(find.text('Rp 55.000'), findsOneWidget);
        expect(find.text('Psikologi Produk Digital'), findsOneWidget);
        expect(find.text('Sarah Utami'), findsOneWidget);
        expect(find.text('Rp 49.000'), findsOneWidget);

        await tester.drag(
          find.byKey(const Key('home_scroll_view')),
          const Offset(0, -600),
        );
        await tester.pumpAndSettle();

        expect(find.text('FLASH SALE & BUNDEL HEMAT'), findsOneWidget);
        expect(find.text('SISA WAKTU: 04:18:22'), findsOneWidget);
        expect(
          find.text('Bundel Arsitektur Skala Besar (3 E-Book)'),
          findsOneWidget,
        );
        expect(
          find.text('AI & Data Engineering Pack (2 E-Book)'),
          findsOneWidget,
        );
        expect(find.text('DATA SIMULASI'), findsOneWidget);

        // Bottom Navigation
        expect(find.text('Beranda'), findsOneWidget);
        expect(find.text('Katalog'), findsOneWidget);
        expect(find.text('Pustaka'), findsOneWidget);
        expect(find.text('Profil'), findsOneWidget);
      },
    );

    testWidgets('Renders without overflow on compact 360x800 viewport', (
      WidgetTester tester,
    ) async {
      await _pumpAtViewport(tester, const Size(360, 800));
      expect(find.text('BUKUKITA'), findsOneWidget);
      expect(find.text('Bingung Pilih Buku?'), findsOneWidget);

      await tester.drag(
        find.byKey(const Key('home_scroll_view')),
        const Offset(0, -700),
      );
      await tester.pumpAndSettle();
      expect(find.text('Rilisan Terbaru'), findsOneWidget);

      await tester.drag(
        find.byKey(const Key('home_scroll_view')),
        const Offset(0, -700),
      );
      await tester.pumpAndSettle();
      expect(find.text('FLASH SALE & BUNDEL HEMAT'), findsOneWidget);
    });

    testWidgets('Renders without overflow on large 412x915 viewport', (
      WidgetTester tester,
    ) async {
      await _pumpAtViewport(tester, const Size(412, 915));
      expect(find.text('BUKUKITA'), findsOneWidget);
      expect(find.text('Rekomendasi Terbaik Untukmu'), findsOneWidget);

      await tester.drag(
        find.byKey(const Key('home_scroll_view')),
        const Offset(0, -700),
      );
      await tester.pumpAndSettle();
      expect(find.text('FLASH SALE & BUNDEL HEMAT'), findsOneWidget);
    });

    testWidgets(
      'Interactive controls: theme toggle, cart increment, search, recommendation modal, and loading/empty/error states',
      (WidgetTester tester) async {
        await _pumpAtViewport(tester, const Size(390, 884));

        // 1. Tap Light Mode button (stays in Stitch Light Mode)
        await tester.tap(find.byKey(const Key('theme_toggle_button')));
        await tester.pumpAndSettle();
        expect(find.byIcon(Icons.wb_sunny_outlined), findsOneWidget);

        // 2. Add to cart increments badge from 2 to 3
        final addCartBtn = find.byKey(const Key('featured_add_cart_button'));
        await tester.ensureVisible(addCartBtn);
        await tester.pumpAndSettle();
        await tester.tap(addCartBtn);
        await tester.pumpAndSettle();
        expect(find.text('3'), findsOneWidget);

        // 3. Open and close Recommendation Modal
        final sawCtaBtn = find.byKey(const Key('saw_cta_button'));
        await tester.ensureVisible(sawCtaBtn);
        await tester.pumpAndSettle();
        await tester.tap(sawCtaBtn);
        await tester.pumpAndSettle();
        expect(find.text('REKOMENDASI TERKURASI'), findsOneWidget);
        await tester.tap(find.byKey(const Key('close_saw_modal_button')));
        await tester.pumpAndSettle();

        // 4. Search filtering into empty state and reset
        final searchInput = find.byKey(const Key('home_search_input'));
        await tester.ensureVisible(searchInput);
        await tester.pumpAndSettle();
        await tester.enterText(searchInput, 'JudulTidakAda999');
        await tester.pumpAndSettle();
        expect(find.byKey(const Key('home_empty_state')), findsOneWidget);

        await tester.tap(find.byKey(const Key('empty_reset_button')));
        await tester.pumpAndSettle();
        expect(find.text('Bingung Pilih Buku?'), findsOneWidget);

        // 5. Verify Loading and Error states with Retry via ProviderContainer
        final element = tester.element(find.byType(Scaffold).first);
        final container = ProviderScope.containerOf(element);

        container
            .read(homeProvider.notifier)
            .setLoadStatus(HomeLoadStatus.loading);
        await tester.pump();
        expect(find.byKey(const Key('home_loading_state')), findsOneWidget);

        container
            .read(homeProvider.notifier)
            .setLoadStatus(HomeLoadStatus.error);
        await tester.pumpAndSettle();
        expect(find.byKey(const Key('home_error_state')), findsOneWidget);

        await tester.tap(find.byKey(const Key('error_retry_button')));
        await tester.pumpAndSettle();
        expect(find.text('Bingung Pilih Buku?'), findsOneWidget);
      },
    );

    testWidgets(
      'Renders inside DevicePreview iPhone frame on desktop Chrome viewport (1280x900)',
      (WidgetTester tester) async {
        tester.view.physicalSize = const Size(1280, 900);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        await tester.pumpWidget(
          const MyApp(enableDevicePreview: true, initialScreen: HomeScreen()),
        );
        await tester.pumpAndSettle();

        expect(find.byType(DevicePreview), findsOneWidget);
        expect(find.text('BUKUKITA'), findsOneWidget);
        expect(find.text('Bingung Pilih Buku?'), findsOneWidget);
      },
    );
  });
}
