import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ebook_store/core/network/dio_client.dart';
import 'package:ebook_store/features/library/data/datasources/library_mock_datasource.dart';
import 'package:ebook_store/features/library/data/repositories/library_repository_impl.dart';
import 'package:ebook_store/features/library/domain/usecases/get_signed_access_url_usecase.dart';
import 'package:ebook_store/features/library/presentation/pages/in_app_pdf_reader_screen.dart';
import 'package:ebook_store/features/library/presentation/providers/library_provider.dart';
import 'package:ebook_store/features/library/presentation/widgets/access_denied_card.dart';
import 'package:ebook_store/features/library/presentation/widgets/in_app_pdf_reader_toolbar.dart';
import 'package:ebook_store/features/library/presentation/widgets/reader_page_view.dart';
import 'package:ebook_store/features/library/presentation/widgets/signed_url_recovery_banner.dart';

Widget _buildTestableReaderScreen({
  required String ebookId,
  String title = 'E-Book Digital',
  int totalPages = 48,
  bool startExpired = false,
  bool startRevoked = false,
  LibraryMockDataSource? mockDataSource,
}) {
  final ds = mockDataSource ?? LibraryMockDataSource();
  if (startExpired) {
    ds.forceExpire(ebookId);
  }
  if (startRevoked) {
    ds.forceRevoke(ebookId);
  }
  final repo = LibraryRepositoryImpl(remoteDataSource: ds);
  final useCase = GetSignedAccessUrlUseCase(repo);

  return ProviderScope(
    overrides: [
      libraryMockDataSourceProvider.overrideWithValue(ds),
      libraryRemoteDataSourceProvider.overrideWithValue(ds),
      libraryRepositoryProvider.overrideWithValue(repo),
      getSignedAccessUrlUseCaseProvider.overrideWithValue(useCase),
      dioClientProvider.overrideWithValue(Dio()),
    ],
    child: MaterialApp(
      home: InAppPdfReaderScreen(
        ebookId: ebookId,
        title: title,
        totalPages: totalPages,
      ),
    ),
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('In-App PDF Reader & SignedUrlRecoveryBanner Tests (design.md §5 & §8.9)', () {
    testWidgets(
      '6. Respons signed URL berhasil: memuat reader, Space Mono indicator, & tanpa tombol unduh',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        await tester.pumpWidget(
          _buildTestableReaderScreen(
            ebookId: '00000000-0000-0000-0000-000000000101',
            title: 'Pemrograman Flutter & Clean Architecture',
            totalPages: 50,
          ),
        );
        await tester.pumpAndSettle();

        // 1. Toolbar reader berhasil dimuat
        expect(find.byType(InAppPdfReaderToolbar), findsOneWidget);
        expect(find.text('IN-APP VIEWER // BUCKET PRIVAT'), findsOneWidget);

        // 2. Indikator halaman Space Mono: "Halaman 1 / 50"
        expect(find.text('Halaman 1 / 50'), findsOneWidget);

        // 3. Konten halaman reader
        expect(find.byType(ReaderPageView), findsOneWidget);
        expect(
          find.text('Bab 1: Prinsip & Implementasi Teknis'),
          findsOneWidget,
        );

        // 4. Banner pemulihan TIDAK muncul saat signed URL valid
        expect(find.byType(SignedUrlRecoveryBanner), findsNothing);

        // 5. TIDAK ADA tombol unduh publik atau ekspos file mentah (ADR-0006)
        expect(find.text('Download'), findsNothing);
        expect(find.text('Unduh'), findsNothing);
        expect(find.byIcon(Icons.download), findsNothing);
      },
    );

    testWidgets(
      '7. Error 403 (EBOOK_ACCESS_DENIED / Akses dicabut): menampilkan AccessDeniedCard tanpa membuka file',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        final mockDataSource = LibraryMockDataSource();
        const ebookId = '00000000-0000-0000-0000-000000000103';
        mockDataSource.forceRevoke(ebookId);

        await tester.pumpWidget(
          _buildTestableReaderScreen(
            ebookId: ebookId,
            title: 'Sistem Pendukung Keputusan SAW Terapan',
            startRevoked: true,
            mockDataSource: mockDataSource,
          ),
        );
        await tester.pumpAndSettle();

        // Wajib menampilkan AccessDeniedCard
        expect(find.byType(AccessDeniedCard), findsOneWidget);
        expect(find.text('AKSES E-BOOK DICABUT'), findsOneWidget);
        expect(
          find.text(
            'Anda tidak memiliki akses aktif untuk e-book ini atau hak akses telah dicabut.',
          ),
          findsOneWidget,
        );
        expect(
          find.byKey(const Key('reader_access_denied_back_button')),
          findsOneWidget,
        );

        // Halaman reader teks TIDAK BOLEH dibuka sama sekali
        expect(find.byType(ReaderPageView), findsNothing);
      },
    );

    testWidgets(
      '8. Pemulihan URL kedaluwarsa: tampilkan SignedUrlRecoveryBanner & tombol "Muat ulang tautan baca"',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        final mockDataSource = LibraryMockDataSource();
        const ebookId = '00000000-0000-0000-0000-000000000101';
        mockDataSource.forceExpire(ebookId);

        await tester.pumpWidget(
          _buildTestableReaderScreen(
            ebookId: ebookId,
            title: 'Pemrograman Flutter',
            startExpired: true,
            mockDataSource: mockDataSource,
          ),
        );
        await tester.pumpAndSettle();

        // Banner pemulihan wajib tampil
        expect(find.byType(SignedUrlRecoveryBanner), findsOneWidget);
        expect(find.text('TAUTAN BACA KEDALUWARSA'), findsOneWidget);
        expect(find.text('TTL 300s'), findsOneWidget);

        // Tombol "Muat ulang tautan baca"
        final refreshBtn = find.byKey(
          const Key('reader_refresh_signed_url_button'),
        );
        expect(refreshBtn, findsOneWidget);
        expect(find.text('Muat ulang tautan baca'), findsOneWidget);

        // Ketika tombol ditekan, meminta URL baru dari backend & banner hilang
        mockDataSource.restoreAccess(ebookId);
        await tester.tap(refreshBtn);
        await tester.pump();
        await tester.pumpAndSettle();

        expect(find.byType(SignedUrlRecoveryBanner), findsNothing);
        expect(find.byType(ReaderPageView), findsOneWidget);
      },
    );

    testWidgets(
      '9. Error 500 (Gagal membuat signed URL): menampilkan error state dan tombol coba lagi',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        final mockDataSource = LibraryMockDataSource();
        const ebookId = '00000000-0000-0000-0000-000000000101';
        mockDataSource.force500();

        await tester.pumpWidget(
          _buildTestableReaderScreen(
            ebookId: ebookId,
            mockDataSource: mockDataSource,
          ),
        );
        await tester.pumpAndSettle();

        expect(find.text('Gagal Menyiapkan Akses Baca'), findsOneWidget);
        expect(
          find.text('Gagal menyiapkan akses baca e-book sementara.'),
          findsOneWidget,
        );

        // Tombol coba lagi
        expect(find.text('COBA LAGI'), findsOneWidget);
      },
    );

    testWidgets('10. Navigasi halaman dan kontrol zoom reader', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));

      await tester.pumpWidget(
        _buildTestableReaderScreen(
          ebookId: '00000000-0000-0000-0000-000000000101',
          totalPages: 5,
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Halaman 1 / 5'), findsOneWidget);

      // Halaman berikutnya
      await tester.tap(find.byKey(const Key('reader_next_page_button')));
      await tester.pumpAndSettle();
      expect(find.text('Halaman 2 / 5'), findsOneWidget);

      // Halaman sebelumnya
      await tester.tap(find.byKey(const Key('reader_prev_page_button')));
      await tester.pumpAndSettle();
      expect(find.text('Halaman 1 / 5'), findsOneWidget);

      // Zoom kontrol
      expect(find.text('100%'), findsOneWidget);
      await tester.tap(find.byKey(const Key('reader_zoom_in_button')));
      await tester.pumpAndSettle();
      expect(find.text('110%'), findsOneWidget);

      await tester.tap(find.byKey(const Key('reader_zoom_out_button')));
      await tester.pumpAndSettle();
      expect(find.text('100%'), findsOneWidget);
    });
  });
}
