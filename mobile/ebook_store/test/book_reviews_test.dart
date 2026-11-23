import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ebook_store/features/catalog/domain/entities/catalog_category.dart';
import 'package:ebook_store/features/catalog/domain/entities/catalog_ebook.dart';
import 'package:ebook_store/features/catalog/domain/entities/catalog_filter.dart';
import 'package:ebook_store/features/catalog/domain/entities/catalog_page.dart';
import 'package:ebook_store/features/catalog/domain/repositories/catalog_repository.dart';
import 'package:ebook_store/features/catalog/presentation/pages/ebook_detail_screen.dart';
import 'package:ebook_store/features/catalog/presentation/providers/catalog_provider.dart';
import 'package:ebook_store/features/catalog/presentation/widgets/book_reviews_section.dart';
import 'package:ebook_store/features/library/presentation/providers/library_provider.dart';

class FakeCatalogRepositoryForReviews implements CatalogRepository {
  final CatalogEbook mockBook;

  FakeCatalogRepositoryForReviews(this.mockBook);

  @override
  Future<List<CatalogCategory>> getCategories() async => [];

  @override
  Future<CatalogPage> getEbooks({
    required CatalogFilter filter,
    int page = 1,
    int limit = 6,
  }) async {
    return CatalogPage(
      items: [mockBook],
      total: 1,
      page: page,
      limit: limit,
      totalPages: 1,
    );
  }

  @override
  Future<CatalogEbook> getEbookById(String id) async => mockBook;
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  final testBook = CatalogEbook(
    id: '00000000-0000-4000-8000-000000000001',
    title: 'DATA SIMULASI - Pemrograman Flutter Modern',
    author: 'Raden Saleh',
    price: 95000,
    categoryName: 'Teknologi',
    description: 'Buku panduan arsitektur Flutter.',
    ratingAvg: 4.8,
    salesCount: 120,
    pageCount: 350,
    publishedYear: 2026,
  );

  Widget createTestWidget({required CatalogEbook book, bool isOwned = false}) {
    final repo = FakeCatalogRepositoryForReviews(book);
    return ProviderScope(
      overrides: [
        catalogRepositoryProvider.overrideWithValue(repo),
        ebookDetailProvider(book.id).overrideWith((ref) => Future.value(book)),
        userOwnershipProvider(
          book.id,
        ).overrideWith((ref) => Future.value(isOwned)),
      ],
      child: MaterialApp(home: EbookDetailScreen(ebookId: book.id)),
    );
  }

  group('Ulasan & Penilaian Pembaca pada Detail E-Book (design.md §5.9 & §8.5)', () {
    final mainScrollable = find.byType(Scrollable).first;

    testWidgets(
      '1. Merender seksi ulasan, ringkasan rating, dan kartu ulasan pembaca',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        await tester.pumpWidget(
          createTestWidget(book: testBook, isOwned: false),
        );
        await tester.pumpAndSettle();

        // Scroll ke bawah menuju seksi ulasan
        final reviewsHeader = find.text('Ulasan & Penilaian Pembaca');
        await tester.scrollUntilVisible(
          reviewsHeader,
          300,
          scrollable: mainScrollable,
        );
        await tester.pumpAndSettle();

        expect(reviewsHeader, findsOneWidget);
        expect(find.byType(BookReviewsSection), findsOneWidget);
        expect(
          find.byKey(const Key('reviews_rating_summary_card')),
          findsOneWidget,
        );

        // Verifikasi kartu ulasan tampil
        expect(find.text('Rizky Pratama'), findsOneWidget);
        expect(find.text('Mahasiswa Sistem Informasi'), findsOneWidget);
        expect(find.text('TERVERIFIKASI'), findsWidgets);
        expect(find.textContaining('Bermanfaat (24)'), findsOneWidget);
      },
    );

    testWidgets('2. Interaksi filter chips ulasan menyaring daftar ulasan', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));

      await tester.pumpWidget(createTestWidget(book: testBook, isOwned: false));
      await tester.pumpAndSettle();

      final chip4Star = find.byKey(const Key('review_filter_chip_four'));
      await tester.scrollUntilVisible(
        chip4Star,
        300,
        scrollable: mainScrollable,
      );
      await tester.pumpAndSettle();

      // Ketuk filter 4 Bintang
      await tester.tap(chip4Star);
      await tester.pumpAndSettle();

      // Hanya ulasan Arif Budiman (bintang 4) yang tampil
      expect(find.text('Arif Budiman'), findsOneWidget);
      expect(find.text('Rizky Pratama'), findsNothing);

      // Kembalikan ke Semua
      final chipAll = find.byKey(const Key('review_filter_chip_all'));
      await tester.tap(chipAll);
      await tester.pumpAndSettle();

      expect(find.text('Rizky Pratama'), findsOneWidget);
      expect(find.text('Arif Budiman'), findsOneWidget);
    });

    testWidgets(
      '3. Interaksi tombol Bermanfaat menambah hitungan secara responsif',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        await tester.pumpWidget(
          createTestWidget(book: testBook, isOwned: false),
        );
        await tester.pumpAndSettle();

        final helpfulBtn = find.byKey(
          Key('review_helpful_button_${testBook.id}-rev-1'),
        );
        await tester.scrollUntilVisible(
          helpfulBtn,
          300,
          scrollable: mainScrollable,
        );
        await tester.pumpAndSettle();

        expect(find.text('Bermanfaat (24)'), findsOneWidget);

        // Ketuk tombol bermanfaat
        await tester.tap(helpfulBtn);
        await tester.pumpAndSettle();

        expect(find.text('Bermanfaat (25)'), findsOneWidget);

        // Ketuk lagi untuk membatalkan
        await tester.tap(helpfulBtn);
        await tester.pumpAndSettle();

        expect(find.text('Bermanfaat (24)'), findsOneWidget);
      },
    );

    testWidgets(
      '4. Pengguna belum memiliki buku melihat notice hak akses ulasan',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        await tester.pumpWidget(
          createTestWidget(book: testBook, isOwned: false),
        );
        await tester.pumpAndSettle();

        final notice = find.text(
          'Hanya pembeli terverifikasi yang dapat menulis ulasan e-book ini.',
        );
        await tester.scrollUntilVisible(
          notice,
          300,
          scrollable: mainScrollable,
        );
        await tester.pumpAndSettle();

        expect(notice, findsOneWidget);
        expect(
          find.byKey(const Key('reviews_toggle_form_button')),
          findsNothing,
        );
      },
    );

    testWidgets(
      '5. Pembeli terverifikasi dapat membuka formulir dan mengirim ulasan baru',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        await tester.pumpWidget(
          createTestWidget(book: testBook, isOwned: true),
        );
        await tester.pumpAndSettle();

        final toggleFormBtn = find.byKey(
          const Key('reviews_toggle_form_button'),
        );
        await tester.scrollUntilVisible(
          toggleFormBtn,
          300,
          scrollable: mainScrollable,
        );
        await tester.pumpAndSettle();

        expect(toggleFormBtn, findsOneWidget);
        expect(find.text('+ TULIS ULASAN E-BOOK'), findsOneWidget);

        // Buka form
        await tester.tap(toggleFormBtn);
        await tester.pumpAndSettle();

        expect(find.text('Pilih Nilai Rating:'), findsOneWidget);
        expect(find.byKey(const Key('review_title_input')), findsOneWidget);
        expect(find.byKey(const Key('review_comment_input')), findsOneWidget);

        // Isi input form
        await tester.enterText(
          find.byKey(const Key('review_title_input')),
          'Ulasan Baru yang Sangat Membantu',
        );
        await tester.enterText(
          find.byKey(const Key('review_comment_input')),
          'Isi buku ini luar biasa lengkap dan terstruktur dengan sangat rapi.',
        );
        await tester.pumpAndSettle();

        // Kirim ulasan
        final submitBtn = find.byKey(const Key('review_submit_button'));
        await tester.scrollUntilVisible(
          submitBtn,
          200,
          scrollable: mainScrollable,
        );
        await tester.tap(submitBtn);
        await tester.pumpAndSettle();

        // Ulasan baru langsung muncul di daftar
        expect(find.text('Ulasan Baru yang Sangat Membantu'), findsOneWidget);
        expect(
          find.text(
            'Isi buku ini luar biasa lengkap dan terstruktur dengan sangat rapi.',
          ),
          findsOneWidget,
        );
        expect(find.text('Ulasan Anda berhasil dikirim!'), findsOneWidget);
      },
    );
  });
}
