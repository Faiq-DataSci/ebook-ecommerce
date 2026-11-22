import 'package:ebook_store/features/catalog/presentation/pages/ebook_detail_screen.dart';
import 'package:ebook_store/features/home/presentation/pages/home_screen.dart';
import 'package:ebook_store/main.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Detail Buku pada Beranda (Integrasi EbookDetailScreen)', () {
    testWidgets(
      '1. Menekan tombol "Lihat Detail Buku" pada Rekomendasi Utama membuka EbookDetailScreen',
      (WidgetTester tester) async {
        tester.view.physicalSize = const Size(390, 884);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        await tester.pumpWidget(const MyApp(initialScreen: HomeScreen()));
        await tester.pumpAndSettle();

        // Temukan tombol "Lihat Detail Buku" pada kartu rekomendasi utama
        final detailBtn = find.byKey(const Key('featured_saw_detail_button'));
        expect(detailBtn, findsOneWidget);

        await tester.ensureVisible(detailBtn);
        await tester.pumpAndSettle();
        await tester.tap(detailBtn);
        await tester.pump(const Duration(milliseconds: 50));
        await tester.pump(const Duration(milliseconds: 200));
        await tester.pumpAndSettle();

        // Memastikan beralih ke EbookDetailScreen sama seperti di katalog
        expect(find.byType(EbookDetailScreen), findsOneWidget);
        expect(find.text('Detail E-Book'), findsOneWidget);
        expect(find.text('Penulis: Ahmad Fauzi'), findsOneWidget);
        expect(find.text('TEKNOLOGI & AI'), findsWidgets);
        expect(find.text('Sinopsis E-Book'), findsOneWidget);
        expect(
          find.byKey(const Key('detail_add_to_cart_button')),
          findsOneWidget,
        );
        expect(find.text('+ KERANJANG'), findsOneWidget);

        // Tombol kembali kembali ke HomeScreen
        final backBtn = find.byKey(const Key('detail_back_button'));
        expect(backBtn, findsOneWidget);
        await tester.tap(backBtn);
        await tester.pumpAndSettle();

        expect(find.byType(HomeScreen), findsOneWidget);
        expect(find.byType(EbookDetailScreen), findsNothing);
      },
    );

    testWidgets(
      '2. Menekan kartu buku pada Rilisan Terbaru membuka EbookDetailScreen dengan data lengkap',
      (WidgetTester tester) async {
        tester.view.physicalSize = const Size(390, 884);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        await tester.pumpWidget(const MyApp(initialScreen: HomeScreen()));
        await tester.pumpAndSettle();

        // Scroll ke bagian Rilisan Terbaru
        final bookCard = find.byKey(const Key('book_card_detail_eb-008'));
        expect(bookCard, findsOneWidget);

        await tester.ensureVisible(bookCard);
        await tester.pumpAndSettle();
        await tester.tap(bookCard);
        await tester.pump(const Duration(milliseconds: 50));
        await tester.pump(const Duration(milliseconds: 200));
        await tester.pumpAndSettle();

        // Memastikan beralih ke EbookDetailScreen untuk buku Algoritma & Struktur Data
        expect(find.byType(EbookDetailScreen), findsOneWidget);
        expect(find.text('Detail E-Book'), findsOneWidget);
        expect(find.text('Algoritma & Struktur Data Praktis'), findsWidgets);
        expect(find.text('Penulis: Budi Santoso'), findsOneWidget);
        expect(find.text('Sinopsis E-Book'), findsOneWidget);

        // Tombol kembali
        await tester.tap(find.byKey(const Key('detail_back_button')));
        await tester.pumpAndSettle();

        expect(find.byType(HomeScreen), findsOneWidget);
      },
    );

    testWidgets(
      '3. Menambah buku ke keranjang dari EbookDetailScreen saat dibuka dari Beranda',
      (WidgetTester tester) async {
        tester.view.physicalSize = const Size(390, 884);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        await tester.pumpWidget(const MyApp(initialScreen: HomeScreen()));
        await tester.pumpAndSettle();

        // Buka detail buku rekomendasi
        final detailBtn = find.byKey(const Key('featured_saw_detail_button'));
        await tester.ensureVisible(detailBtn);
        await tester.tap(detailBtn);
        await tester.pump(const Duration(milliseconds: 200));
        await tester.pumpAndSettle();

        // Tekan tombol + KERANJANG di bottom action bar detail
        final addCartBtn = find.byKey(const Key('detail_add_to_cart_button'));
        expect(addCartBtn, findsOneWidget);

        await tester.tap(addCartBtn);
        await tester.pump();
        await tester.pump(const Duration(milliseconds: 300));

        // SnackBar muncul
        expect(find.textContaining('dimasukkan ke keranjang'), findsOneWidget);

        // Kembali ke HomeScreen dan cek badge keranjang bertambah
        await tester.tap(find.byKey(const Key('detail_back_button')));
        await tester.pumpAndSettle();

        expect(find.byType(HomeScreen), findsOneWidget);
        // Awalnya 2, setelah ditambah menjadi 3
        expect(find.text('3'), findsOneWidget);
      },
    );
  });
}
