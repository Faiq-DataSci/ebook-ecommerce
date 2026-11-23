import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ebook_store/core/network/dio_client.dart';
import 'package:ebook_store/features/catalog/presentation/pages/catalog_screen.dart';
import 'package:ebook_store/features/home/presentation/pages/home_screen.dart';
import 'package:ebook_store/features/library/data/datasources/library_mock_datasource.dart';
import 'package:ebook_store/features/library/data/datasources/library_remote_datasource.dart';
import 'package:ebook_store/features/library/data/models/ebook_access_model.dart';
import 'package:ebook_store/features/library/data/models/signed_url_model.dart';
import 'package:ebook_store/features/library/data/repositories/library_repository_impl.dart';
import 'package:ebook_store/features/library/domain/usecases/get_my_library_usecase.dart';
import 'package:ebook_store/features/library/presentation/pages/in_app_pdf_reader_screen.dart';
import 'package:ebook_store/features/library/presentation/pages/library_screen.dart';
import 'package:ebook_store/features/library/presentation/providers/library_provider.dart';
import 'package:ebook_store/features/library/presentation/widgets/library_book_card.dart';
import 'package:ebook_store/features/library/presentation/widgets/library_empty_state.dart';
import 'package:ebook_store/features/library/presentation/widgets/pdf_document_view.dart';

class ErrorLibraryMockDataSource implements LibraryRemoteDataSource {
  int callCount = 0;

  @override
  Future<List<EbookAccessModel>> getMyLibrary() async {
    callCount++;
    if (callCount == 1) {
      throw Exception('Gagal menghubungi server database');
    }
    return <EbookAccessModel>[
      EbookAccessModel(
        id: 'acc-recovered',
        ebookId: '00000000-0000-0000-0000-000000000101',
        title: 'Pemrograman Flutter & Clean Architecture',
        author: 'Raden Saleh',
        grantedAt: DateTime.now(),
        isRevoked: false,
      ),
    ];
  }

  @override
  Future<SignedUrlModel> getSignedAccessUrl(String ebookId) async =>
      throw UnimplementedError();

  @override
  Future<bool> checkOwnership(String ebookId) async => false;
}

class EmptyLibraryMockDataSource implements LibraryRemoteDataSource {
  @override
  Future<List<EbookAccessModel>> getMyLibrary() async => <EbookAccessModel>[];

  @override
  Future<SignedUrlModel> getSignedAccessUrl(String ebookId) async =>
      throw UnimplementedError();

  @override
  Future<bool> checkOwnership(String ebookId) async => false;
}

Widget _buildTestableLibraryScreen({
  LibraryRemoteDataSource? dataSource,
  LibraryNotifier? customNotifier,
}) {
  final ds = dataSource ?? LibraryMockDataSource();
  final repo = LibraryRepositoryImpl(remoteDataSource: ds);
  final useCase = GetMyLibraryUseCase(repo);

  return ProviderScope(
    overrides: [
      libraryMockDataSourceProvider.overrideWithValue(
        ds is LibraryMockDataSource ? ds : LibraryMockDataSource(),
      ),
      libraryRemoteDataSourceProvider.overrideWithValue(ds),
      libraryRepositoryProvider.overrideWithValue(repo),
      getMyLibraryUseCaseProvider.overrideWithValue(useCase),
      if (customNotifier != null)
        libraryProvider.overrideWith((ref) => customNotifier),
      dioClientProvider.overrideWithValue(Dio()),
      pdfDocumentViewBuilderProvider.overrideWithValue(
        (context, props) =>
            const SizedBox.shrink(key: Key('pdf_document_view')),
      ),
    ],
    child: const MaterialApp(home: LibraryScreen()),
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Perpustakaan Digital Mobile (Zona B — design.md §8.9 & QA Checklist)', () {
    testWidgets(
      '1. Loading koleksi: menampilkan indikator loading saat memuat data',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        final mockDataSource = LibraryMockDataSource(
          simulatedDelay: const Duration(seconds: 2),
        );

        await tester.pumpWidget(
          _buildTestableLibraryScreen(dataSource: mockDataSource),
        );
        await tester.pump(); // Render first frame (loading state)

        expect(find.text('MEMUAT PERPUSTAKAAN...'), findsOneWidget);
        expect(find.byType(CircularProgressIndicator), findsOneWidget);

        await tester.pump(const Duration(seconds: 2));
        await tester.pumpAndSettle();
      },
    );

    testWidgets(
      '2. Pustaka kosong: menampilkan pesan dan tombol jelajahi katalog',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        await tester.pumpWidget(
          _buildTestableLibraryScreen(dataSource: EmptyLibraryMockDataSource()),
        );
        await tester.pumpAndSettle();

        // Verifikasi empty state teks persis sesuai design.md
        expect(find.byType(LibraryEmptyState), findsOneWidget);
        expect(
          find.text(
            'Perpustakaanmu masih kosong. Jelajahi katalog untuk menemukan buku pertamamu.',
          ),
          findsOneWidget,
        );

        final exploreBtn = find.byKey(
          const Key('library_explore_catalog_button'),
        );
        expect(exploreBtn, findsOneWidget);
        expect(find.text('Jelajahi katalog'), findsOneWidget);

        await tester.tap(exploreBtn);
        await tester.pumpAndSettle();

        expect(find.byType(CatalogScreen), findsOneWidget);
      },
    );

    testWidgets(
      '3. Error dan tombol coba lagi: menampilkan error & aksi retry berhasil memuat data',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        final errorDataSource = ErrorLibraryMockDataSource();
        await tester.pumpWidget(
          _buildTestableLibraryScreen(dataSource: errorDataSource),
        );
        await tester.pumpAndSettle();

        expect(find.text('Gagal Memuat Perpustakaan'), findsOneWidget);
        expect(find.text('Gagal menghubungi server database'), findsOneWidget);

        final retryBtn = find.byKey(const Key('library_retry_button'));
        expect(retryBtn, findsOneWidget);

        await tester.tap(retryBtn);
        await tester.pumpAndSettle();

        // Setelah coba lagi, data berhasil dimuat
        expect(find.byType(LibraryBookCard), findsOneWidget);
        expect(
          find.text('Pemrograman Flutter & Clean Architecture'),
          findsOneWidget,
        );
      },
    );

    testWidgets(
      '4. Kartu akses aktif: merender kartu dengan badge AKTIF dan tombol BACA',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        await tester.pumpWidget(_buildTestableLibraryScreen());
        await tester.pumpAndSettle();

        expect(find.text('PERPUSTAKAAN DIGITAL'), findsOneWidget);
        expect(find.text('ZONA B'), findsOneWidget);
        expect(find.byType(LibraryBookCard), findsNWidgets(3));

        // Akses aktif memiliki badge AKSES AKTIF dan tombol BACA
        expect(find.text('AKSES AKTIF'), findsNWidgets(2));
        expect(find.text('BACA'), findsNWidgets(2));

        // Tapping BACA membuka InAppPdfReaderScreen
        final readBtn = find.byKey(
          const Key('library_read_button_00000000-0000-0000-0000-000000000101'),
        );
        expect(readBtn, findsOneWidget);

        await tester.tap(readBtn);
        await tester.pumpAndSettle();

        expect(find.byType(InAppPdfReaderScreen), findsOneWidget);
      },
    );

    testWidgets(
      '5. Akses dicabut tidak membuka reader dan menjelaskan statusnya',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        await tester.pumpWidget(_buildTestableLibraryScreen());
        await tester.pumpAndSettle();

        // Buku ketiga (acc-003) disimulasikan dicabut
        expect(
          find.text('AKSES DICABUT'),
          findsNWidgets(2),
        ); // Badge + Text Tombol
        expect(
          find.text('Akses e-book ini dicabut oleh Administrator.'),
          findsOneWidget,
        );

        final revokedBtn = find.byKey(
          const Key('library_read_button_00000000-0000-0000-0000-000000000103'),
        );
        expect(revokedBtn, findsOneWidget);

        // Pastikan widget terlihat di viewport sebelum tap
        await tester.ensureVisible(revokedBtn);
        await tester.pumpAndSettle();

        // Tap pada tombol yang dicabut tidak boleh membuka InAppPdfReaderScreen
        await tester.tap(revokedBtn);
        await tester.pumpAndSettle();

        expect(find.byType(InAppPdfReaderScreen), findsNothing);
        expect(find.byType(LibraryScreen), findsOneWidget);
      },
    );

    testWidgets(
      '6. Mode Embed (isEmbedded: true): merender rak pustaka langsung tanpa Scaffold/AppBar',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        await tester.pumpWidget(
          ProviderScope(
            overrides: [
              libraryMockDataSourceProvider.overrideWithValue(
                LibraryMockDataSource(),
              ),
              libraryRemoteDataSourceProvider.overrideWithValue(
                LibraryMockDataSource(),
              ),
              libraryRepositoryProvider.overrideWithValue(
                LibraryRepositoryImpl(
                  remoteDataSource: LibraryMockDataSource(),
                ),
              ),
              getMyLibraryUseCaseProvider.overrideWithValue(
                GetMyLibraryUseCase(
                  LibraryRepositoryImpl(
                    remoteDataSource: LibraryMockDataSource(),
                  ),
                ),
              ),
              dioClientProvider.overrideWithValue(Dio()),
            ],
            child: const MaterialApp(
              home: Scaffold(body: LibraryScreen(isEmbedded: true)),
            ),
          ),
        );
        await tester.pumpAndSettle();

        // Tidak memiliki tombol back mandiri karena terintegrasi dalam navigasi utama
        expect(find.byKey(const Key('library_back_button')), findsNothing);

        // Konten rak buku digital tetap lengkap & menarik
        expect(find.text('PERPUSTAKAAN DIGITAL'), findsOneWidget);
        expect(find.text('ZONA B'), findsOneWidget);
        expect(find.byType(LibraryBookCard), findsNWidgets(3));
      },
    );

    testWidgets(
      '7. Navigasi Pustaka pada navigasi utama beralih langsung tanpa membuat layer/route baru',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        await tester.pumpWidget(
          const ProviderScope(child: MaterialApp(home: HomeScreen())),
        );
        await tester.pumpAndSettle();

        // 1. Awalnya berada di Beranda (home_scroll_view tampil)
        expect(find.byKey(const Key('home_scroll_view')), findsOneWidget);

        // 2. Ketuk item navigasi "Pustaka" di bottom navigation
        final pustakaNav = find.text('Pustaka');
        expect(pustakaNav, findsOneWidget);
        await tester.tap(pustakaNav);
        await tester.pumpAndSettle();

        // 3. Konten Pustaka Digital tampil langsung di layar utama (tanpa route layer baru / tanpa back button)
        expect(find.byType(LibraryScreen), findsOneWidget);
        expect(
          find.byKey(const Key('library_books_list_view')),
          findsOneWidget,
        );
        expect(find.byKey(const Key('library_back_button')), findsNothing);

        // 4. Navigasi bawah tetap ada dan dapat beralih kembali ke Beranda
        final berandaNav = find.text('Beranda');
        await tester.tap(berandaNav);
        await tester.pumpAndSettle();

        expect(find.byKey(const Key('home_scroll_view')), findsOneWidget);
        expect(find.byKey(const Key('library_books_list_view')), findsNothing);
      },
    );

    testWidgets(
      '8. Filter chips koleksi: menyaring e-book berdasarkan status baca dan tombol reset',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        await tester.pumpWidget(_buildTestableLibraryScreen());
        await tester.pumpAndSettle();

        // 1. Secara default chip "Semua (3)" aktif, seluruh 3 e-book tampil
        expect(find.text('Semua (3)'), findsOneWidget);
        expect(find.byType(LibraryBookCard), findsNWidgets(3));

        // 2. Ketuk filter "Sedang Dibaca" (2 buku aktif sedang dibaca)
        final readingChip = find.textContaining('Sedang Dibaca');
        expect(readingChip, findsOneWidget);
        await tester.tap(readingChip);
        await tester.pumpAndSettle();

        expect(find.byType(LibraryBookCard), findsNWidgets(2));

        // 3. Ketuk filter "Selesai" (belum ada yang 100% selesai)
        final completedChip = find.textContaining('Selesai');
        expect(completedChip, findsOneWidget);
        await tester.tap(completedChip);
        await tester.pumpAndSettle();

        expect(find.text('Belum ada buku dalam kategori ini.'), findsOneWidget);
        final resetBtn = find.text('TAMPILKAN SEMUA');
        expect(resetBtn, findsOneWidget);

        // 4. Reset filter mengembalikan tampilan ke "Semua"
        await tester.tap(resetBtn);
        await tester.pumpAndSettle();

        expect(find.byType(LibraryBookCard), findsNWidgets(3));
      },
    );
  });
}
