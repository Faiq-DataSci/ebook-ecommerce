import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ebook_store/features/catalog/domain/entities/catalog_category.dart';
import 'package:ebook_store/features/catalog/domain/entities/catalog_ebook.dart';
import 'package:ebook_store/features/catalog/domain/entities/catalog_failure.dart';
import 'package:ebook_store/features/catalog/domain/entities/catalog_filter.dart';
import 'package:ebook_store/features/catalog/domain/entities/catalog_page.dart';
import 'package:ebook_store/features/catalog/domain/repositories/catalog_repository.dart';
import 'package:ebook_store/features/catalog/presentation/pages/catalog_screen.dart';
import 'package:ebook_store/features/catalog/presentation/pages/ebook_detail_screen.dart';
import 'package:ebook_store/features/catalog/presentation/providers/catalog_provider.dart';
import 'package:ebook_store/features/catalog/presentation/widgets/active_filter_chips.dart';
import 'package:ebook_store/features/catalog/presentation/widgets/catalog_result_bar.dart';
import 'package:ebook_store/features/catalog/presentation/widgets/catalog_search_bar.dart';
import 'package:ebook_store/features/catalog/presentation/widgets/catalog_toolbar.dart';
import 'package:ebook_store/features/catalog/presentation/widgets/category_pills_bar.dart';
import 'package:ebook_store/features/catalog/presentation/widgets/ebook_card.dart';

class FakeCatalogRepository implements CatalogRepository {
  List<CatalogCategory> mockCategories;
  List<CatalogEbook> mockBooks;
  bool shouldFail;
  String errorMessage;

  FakeCatalogRepository({
    this.mockCategories = const [],
    this.mockBooks = const [],
    this.shouldFail = false,
    this.errorMessage = 'Gagal memuat data dari server.',
  });

  @override
  Future<List<CatalogCategory>> getCategories() async {
    if (shouldFail) {
      throw CatalogFailure(CatalogFailureType.network, errorMessage);
    }
    return mockCategories;
  }

  @override
  Future<CatalogPage> getEbooks({
    required CatalogFilter filter,
    int page = 1,
    int limit = 6,
  }) async {
    if (shouldFail) {
      throw CatalogFailure(CatalogFailureType.network, errorMessage);
    }
    final filtered = filter.apply(mockBooks);
    final total = filtered.length;
    final totalPages = (total / limit).ceil().clamp(1, 999);
    final safePage = page.clamp(1, totalPages);
    final start = (safePage - 1) * limit;

    List<CatalogEbook> items = const [];
    if (start < total) {
      final end = (start + limit).clamp(0, total);
      items = filtered.sublist(start, end);
    }

    return CatalogPage(
      items: items,
      page: safePage,
      limit: limit,
      total: total,
      totalPages: totalPages,
    );
  }

  @override
  Future<CatalogEbook> getEbookById(String id) async {
    if (shouldFail) {
      throw CatalogFailure(CatalogFailureType.network, errorMessage);
    }
    final match = mockBooks.where((b) => b.id == id).firstOrNull;
    if (match != null) return match;
    throw const CatalogFailure.notFound();
  }
}

Widget _buildTestableCatalogScreen({
  required CatalogRepository repository,
  Size screenSize = const Size(390, 884),
}) {
  return ProviderScope(
    overrides: [catalogRepositoryProvider.overrideWithValue(repository)],
    child: MaterialApp(
      home: MediaQuery(
        data: MediaQueryData(
          size: screenSize,
          padding: const EdgeInsets.only(top: 44, bottom: 34),
        ),
        child: const CatalogScreen(),
      ),
    ),
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  final testCategories = [
    const CatalogCategory(id: 'cat-tek', name: 'Teknologi & AI'),
    const CatalogCategory(id: 'cat-bis', name: 'Bisnis & Finansial'),
    const CatalogCategory(id: 'cat-des', name: 'Desain UI/UX'),
  ];

  final testBooks = [
    CatalogEbook(
      id: 'eb-1',
      title: 'Arsitektur Cloud & DevOps',
      author: 'Hendra Wijaya',
      price: 65000,
      categoryId: 'cat-tek',
      categoryName: 'Teknologi & AI',
      description: 'Sinopsis buku cloud...',
      ratingAvg: 4.9,
      salesCount: 42,
    ),
    CatalogEbook(
      id: 'eb-2',
      title: 'Prinsip Desain Interaksi',
      author: 'Maya Salsabila',
      price: 58000,
      categoryId: 'cat-des',
      categoryName: 'Desain UI/UX',
      description: 'Sinopsis buku desain...',
      ratingAvg: 4.7,
      salesCount: 35,
    ),
    CatalogEbook(
      id: 'eb-3',
      title: 'Finansial Bebas Hutang',
      author: 'Rian Adriansyah',
      price: 45000,
      categoryId: 'cat-bis',
      categoryName: 'Bisnis & Finansial',
      description: 'Sinopsis buku finansial...',
      ratingAvg: 4.6,
      salesCount: 120,
    ),
  ];

  group('Katalog & Filter E-book Mobile (Neubrutalism) Tests', () {
    testWidgets(
      '1. Merender seluruh komponen visual katalog sesuai Stitch & Docs',
      (tester) async {
        final repo = FakeCatalogRepository(
          mockCategories: testCategories,
          mockBooks: testBooks,
        );

        await tester.binding.setSurfaceSize(const Size(390, 884));
        await tester.pumpWidget(_buildTestableCatalogScreen(repository: repo));
        await tester.pumpAndSettle();

        // Header BUKUKITA
        expect(find.text('BUKUKITA'), findsOneWidget);

        // Search Bar & Filter Button
        expect(find.byType(CatalogSearchBar), findsOneWidget);
        expect(find.byKey(const Key('catalog_search_input')), findsOneWidget);
        expect(find.byKey(const Key('catalog_filter_button')), findsOneWidget);

        // Toolbar Urutkan & Toggle Grid/List
        expect(find.byType(CatalogToolbar), findsOneWidget);
        expect(
          find.byKey(const Key('catalog_sort_dropdown_button')),
          findsOneWidget,
        );
        expect(find.byKey(const Key('catalog_view_mode_grid')), findsOneWidget);
        expect(find.byKey(const Key('catalog_view_mode_list')), findsOneWidget);

        // Kategori Pills Bar
        expect(find.byType(CategoryPillsBar), findsOneWidget);
        expect(find.byKey(const Key('category_pill_all')), findsOneWidget);

        // Result Count & DATA SIMULASI Bar
        expect(find.byType(CatalogResultBar), findsOneWidget);
        expect(find.textContaining('HASIL:'), findsOneWidget);
        expect(find.text('DATA SIMULASI'), findsOneWidget);

        // E-Book Cards
        expect(find.byType(EbookCard), findsNWidgets(3));
        expect(find.text('Arsitektur Cloud & DevOps'), findsOneWidget);
        expect(find.text('Rp 65.000'), findsOneWidget);
        expect(find.text('Hendra Wijaya'), findsOneWidget);
      },
    );

    testWidgets('2. Menangani State Katalog Kosong (Empty State)', (
      tester,
    ) async {
      final repo = FakeCatalogRepository(
        mockCategories: testCategories,
        mockBooks: const [],
      );

      await tester.pumpWidget(_buildTestableCatalogScreen(repository: repo));
      await tester.pumpAndSettle();

      expect(find.byKey(const Key('catalog_empty_state')), findsOneWidget);
      expect(find.text('Belum Ada E-Book'), findsOneWidget);
    });

    testWidgets('3. Menangani State Error & Aksi Coba Lagi', (tester) async {
      final repo = FakeCatalogRepository(
        mockCategories: testCategories,
        mockBooks: testBooks,
        shouldFail: true,
      );

      await tester.pumpWidget(_buildTestableCatalogScreen(repository: repo));
      await tester.pumpAndSettle();

      expect(find.byKey(const Key('catalog_error_state')), findsOneWidget);
      expect(find.text('Gagal Memuat Katalog'), findsOneWidget);
      expect(
        find.byKey(const Key('catalog_error_retry_button')),
        findsOneWidget,
      );

      // Uji aksi coba lagi setelah pulih
      repo.shouldFail = false;
      await tester.tap(find.byKey(const Key('catalog_error_retry_button')));
      await tester.pumpAndSettle();

      expect(find.byKey(const Key('catalog_error_state')), findsNothing);
      expect(find.byType(EbookCard), findsNWidgets(3));
    });

    testWidgets('4. Pencarian Judul & Tombol Hapus Search', (tester) async {
      final repo = FakeCatalogRepository(
        mockCategories: testCategories,
        mockBooks: testBooks,
      );

      await tester.pumpWidget(_buildTestableCatalogScreen(repository: repo));
      await tester.pumpAndSettle();

      final searchField = find.byKey(const Key('catalog_search_input'));
      await tester.enterText(searchField, 'Cloud');
      await tester.pumpAndSettle();

      expect(find.byType(EbookCard), findsOneWidget);
      expect(find.text('Arsitektur Cloud & DevOps'), findsOneWidget);
      expect(find.text('Finansial Bebas Hutang'), findsNothing);

      // Tombol Clear Search
      final clearBtn = find.byKey(const Key('catalog_search_clear_button'));
      expect(clearBtn, findsOneWidget);
      await tester.tap(clearBtn);
      await tester.pumpAndSettle();

      expect(find.byType(EbookCard), findsNWidgets(3));
    });

    testWidgets('5. Pencarian Tidak Ada Hasil (No Result State) & Reset', (
      tester,
    ) async {
      final repo = FakeCatalogRepository(
        mockCategories: testCategories,
        mockBooks: testBooks,
      );

      await tester.pumpWidget(_buildTestableCatalogScreen(repository: repo));
      await tester.pumpAndSettle();

      final searchField = find.byKey(const Key('catalog_search_input'));
      await tester.enterText(searchField, 'Kuantum Relativitas');
      await tester.pumpAndSettle();

      expect(find.byKey(const Key('catalog_no_result_state')), findsOneWidget);
      expect(find.text('Tidak ada e-book yang cocok.'), findsOneWidget);

      // Tap reset
      await tester.tap(find.byKey(const Key('no_result_reset_button')));
      await tester.pumpAndSettle();

      expect(find.byType(EbookCard), findsNWidgets(3));
    });

    testWidgets('6. Filter Kategori lewat Pil Horizontal & Chip Aktif', (
      tester,
    ) async {
      final repo = FakeCatalogRepository(
        mockCategories: testCategories,
        mockBooks: testBooks,
      );

      await tester.pumpWidget(_buildTestableCatalogScreen(repository: repo));
      await tester.pumpAndSettle();

      // Pilih Kategori Teknologi
      final catBtn = find.byKey(const Key('category_pill_cat-tek'));
      expect(catBtn, findsOneWidget);
      await tester.tap(catBtn);
      await tester.pumpAndSettle();

      expect(find.byType(EbookCard), findsOneWidget);
      expect(find.text('Arsitektur Cloud & DevOps'), findsOneWidget);

      // Chip Filter Aktif muncul
      expect(find.byType(ActiveFilterChips), findsOneWidget);
      expect(find.byKey(const Key('chip_category')), findsOneWidget);

      // Hapus filter kategori via chip
      final deleteChip = find.descendant(
        of: find.byKey(const Key('chip_category')),
        matching: find.byIcon(Icons.close),
      );
      await tester.tap(deleteChip);
      await tester.pumpAndSettle();

      expect(find.byType(EbookCard), findsNWidgets(3));
    });

    testWidgets('7. Buka Bottom Sheet Filter, Rentang Harga & Reset Kriteria', (
      tester,
    ) async {
      final repo = FakeCatalogRepository(
        mockCategories: testCategories,
        mockBooks: testBooks,
      );

      await tester.pumpWidget(_buildTestableCatalogScreen(repository: repo));
      await tester.pumpAndSettle();

      // Buka bottom sheet
      await tester.tap(find.byKey(const Key('catalog_filter_button')));
      await tester.pumpAndSettle();

      expect(find.text('FILTER KATALOG'), findsOneWidget);
      expect(find.text('RENTANG HARGA'), findsOneWidget);
      expect(find.text('RATING MINIMUM'), findsOneWidget);

      // Pilih rating 4.5+
      await tester.tap(find.byKey(const Key('filter_rating_4.5')));
      await tester.pumpAndSettle();

      // Terapkan
      await tester.tap(find.byKey(const Key('filter_sheet_apply_button')));
      await tester.pumpAndSettle();

      // Buku rating >= 4.5
      expect(find.byType(EbookCard), findsNWidgets(3));
      expect(find.byKey(const Key('chip_rating')), findsOneWidget);
    });

    testWidgets('8. Toggle Tampilan Grid dan Baris (List Mode)', (
      tester,
    ) async {
      final repo = FakeCatalogRepository(
        mockCategories: testCategories,
        mockBooks: testBooks,
      );

      await tester.pumpWidget(_buildTestableCatalogScreen(repository: repo));
      await tester.pumpAndSettle();

      // Awalnya grid
      expect(find.byKey(const Key('ebook_card_eb-1')), findsOneWidget);

      // Toggle ke List mode
      await tester.tap(find.byKey(const Key('catalog_view_mode_list')));
      await tester.pumpAndSettle();

      expect(find.byKey(const Key('ebook_card_list_eb-1')), findsOneWidget);
    });

    testWidgets('9. Navigasi menuju Halaman Detail E-Book berbasis ID', (
      tester,
    ) async {
      final repo = FakeCatalogRepository(
        mockCategories: testCategories,
        mockBooks: testBooks,
      );

      await tester.pumpWidget(_buildTestableCatalogScreen(repository: repo));
      await tester.pumpAndSettle();

      // Tap kartu e-book pertama
      await tester.tap(find.byKey(const Key('ebook_card_eb-1')));
      await tester.pumpAndSettle();

      // Berpindah ke EbookDetailScreen
      expect(find.byType(EbookDetailScreen), findsOneWidget);
      expect(find.text('Detail E-Book'), findsOneWidget);
      expect(find.text('Arsitektur Cloud & DevOps'), findsOneWidget);
      expect(find.text('Penulis: Hendra Wijaya'), findsOneWidget);
      expect(find.text('Sinopsis buku cloud...'), findsOneWidget);

      // Tombol kembali
      await tester.tap(find.byKey(const Key('detail_back_button')));
      await tester.pumpAndSettle();

      expect(find.byType(CatalogScreen), findsOneWidget);
    });

    testWidgets(
      '10. Responsif pada berbagai ukuran layar mobile (320, 390, 430)',
      (tester) async {
        final repo = FakeCatalogRepository(
          mockCategories: testCategories,
          mockBooks: testBooks,
        );

        final sizes = [
          const Size(320, 640),
          const Size(390, 884),
          const Size(430, 932),
        ];

        for (final size in sizes) {
          await tester.binding.setSurfaceSize(size);
          await tester.pumpWidget(
            _buildTestableCatalogScreen(repository: repo, screenSize: size),
          );
          await tester.pumpAndSettle();

          expect(find.byType(CatalogScreen), findsOneWidget);
          expect(tester.takeException(), isNull);
        }
      },
    );

    testWidgets(
      '11. Menambahkan e-book ke keranjang dari kartu katalog dan counter header bertambah',
      (tester) async {
        final repo = FakeCatalogRepository(
          mockCategories: testCategories,
          mockBooks: testBooks,
        );

        await tester.binding.setSurfaceSize(const Size(390, 884));
        await tester.pumpWidget(_buildTestableCatalogScreen(repository: repo));
        await tester.pumpAndSettle();

        // Tombol + Keranjang pada kartu pertama
        final addCartBtn = find.byKey(const Key('ebook_card_add_eb-1'));
        expect(addCartBtn, findsOneWidget);

        await tester.tap(addCartBtn);
        await tester.pump();
        await tester.pump(const Duration(milliseconds: 300));

        // SnackBar konfirmasi muncul
        expect(find.text('BERHASIL DITAMBAHKAN'), findsOneWidget);

        // Buka bottom sheet keranjang lewat icon cart di HomeHeader
        final cartBtn = find.byKey(const Key('cart_button'));
        expect(cartBtn, findsOneWidget);

        await tester.tap(cartBtn);
        await tester.pumpAndSettle();

        // Modal keranjang belanja terbuka
        expect(find.text('KERANJANG BELANJA'), findsOneWidget);
        expect(find.text('Arsitektur Cloud & DevOps'), findsAtLeastNWidgets(1));

        // Tutup sheet
        await tester.tap(find.byKey(const Key('close_cart_sheet_button')));
        await tester.pumpAndSettle();

        expect(find.text('KERANJANG BELANJA'), findsNothing);
        expect(tester.takeException(), isNull);
      },
    );
  });
}
