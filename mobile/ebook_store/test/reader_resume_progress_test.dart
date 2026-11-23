import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ebook_store/core/network/dio_client.dart';
import 'package:ebook_store/features/library/data/datasources/library_mock_datasource.dart';
import 'package:ebook_store/features/library/data/datasources/reader_local_datasource.dart';
import 'package:ebook_store/features/library/data/repositories/library_repository_impl.dart';
import 'package:ebook_store/features/library/domain/usecases/get_signed_access_url_usecase.dart';
import 'package:ebook_store/features/library/presentation/pages/in_app_pdf_reader_screen.dart';
import 'package:ebook_store/features/library/presentation/providers/library_provider.dart';
import 'package:ebook_store/features/library/presentation/providers/reader_provider.dart';
import 'package:ebook_store/features/library/presentation/widgets/pdf_document_view.dart';

class FakeReaderLocalDataSource implements ReaderLocalDataSource {
  final Map<String, int> store = {};

  @override
  Future<int?> getLastPage(String ebookId) async => store[ebookId];

  @override
  Future<void> saveLastPage(String ebookId, int page) async {
    store[ebookId] = page;
  }

  @override
  Future<void> clearProgress(String ebookId) async {
    store.remove(ebookId);
  }
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  const testEbookId = 'ebook-resume-test-001';

  group('P2.1 Resume Reading Page Tests', () {
    test(
      '1. ReaderNotifier memulihkan progress bacaan terakhir dari local storage',
      () async {
        final fakeLocal = FakeReaderLocalDataSource();
        fakeLocal.store[testEbookId] = 14;

        final ds = LibraryMockDataSource();
        final repo = LibraryRepositoryImpl(remoteDataSource: ds);
        final useCase = GetSignedAccessUrlUseCase(repo);

        final notifier = ReaderNotifier(
          getSignedAccessUrlUseCase: useCase,
          localDataSource: fakeLocal,
          ebookId: testEbookId,
          title: 'Buku Uji Resume',
          totalPages: 60,
        );

        // Tunggu inisialisasi loadAccessUrl() selesai
        await Future<void>.delayed(const Duration(milliseconds: 50));

        expect(notifier.state.currentPage, 14);
        expect(notifier.state.initialSavedPage, 14);
        expect(notifier.state.showResumeNotice, isTrue);

        // Saat berpindah halaman, disimpan ke storage
        notifier.setCurrentPage(18);
        expect(notifier.state.currentPage, 18);
        expect(fakeLocal.store[testEbookId], 18);

        // Reset progress kembali ke halaman 1
        await notifier.resetProgressToBeginning();
        expect(notifier.state.currentPage, 1);
        expect(notifier.state.showResumeNotice, isFalse);
        expect(fakeLocal.store[testEbookId], 1);
      },
    );

    testWidgets(
      '2. InAppPdfReaderScreen menampilkan banner resume dan tombol Mulai Hal 1',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        final fakeLocal = FakeReaderLocalDataSource();
        fakeLocal.store[testEbookId] = 22;

        final ds = LibraryMockDataSource();
        final repo = LibraryRepositoryImpl(remoteDataSource: ds);
        final useCase = GetSignedAccessUrlUseCase(repo);

        await tester.pumpWidget(
          ProviderScope(
            overrides: [
              libraryMockDataSourceProvider.overrideWithValue(ds),
              libraryRemoteDataSourceProvider.overrideWithValue(ds),
              libraryRepositoryProvider.overrideWithValue(repo),
              getSignedAccessUrlUseCaseProvider.overrideWithValue(useCase),
              readerLocalDataSourceProvider.overrideWithValue(fakeLocal),
              dioClientProvider.overrideWithValue(Dio()),
              pdfDocumentViewBuilderProvider.overrideWithValue(
                (context, props) => Container(
                  key: const Key('pdf_document_view'),
                  alignment: Alignment.center,
                  child: const Text('PDF TEST'),
                ),
              ),
            ],
            child: const MaterialApp(
              home: InAppPdfReaderScreen(
                ebookId: testEbookId,
                title: 'Buku Uji Resume Screen',
                totalPages: 50,
              ),
            ),
          ),
        );

        await tester.pumpAndSettle();

        // Banner resume membaca muncul
        expect(find.byKey(const Key('resume_reading_banner')), findsOneWidget);
        expect(find.text('Melanjutkan dari Halaman 22'), findsOneWidget);
        expect(find.byKey(const Key('restart_page_button')), findsOneWidget);

        // Menekan tombol "Mulai Hal 1"
        await tester.tap(find.byKey(const Key('restart_page_button')));
        await tester.pumpAndSettle();

        // Banner hilang dan halaman kembali ke 1
        expect(find.byKey(const Key('resume_reading_banner')), findsNothing);
        expect(find.text('Halaman 1 / 50'), findsOneWidget);
        expect(fakeLocal.store[testEbookId], 1);
      },
    );

    testWidgets(
      '3. Tombol dismiss menyembunyikan banner tanpa mereset nomor halaman',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        final fakeLocal = FakeReaderLocalDataSource();
        fakeLocal.store[testEbookId] = 17;

        final ds = LibraryMockDataSource();
        final repo = LibraryRepositoryImpl(remoteDataSource: ds);
        final useCase = GetSignedAccessUrlUseCase(repo);

        await tester.pumpWidget(
          ProviderScope(
            overrides: [
              libraryMockDataSourceProvider.overrideWithValue(ds),
              libraryRemoteDataSourceProvider.overrideWithValue(ds),
              libraryRepositoryProvider.overrideWithValue(repo),
              getSignedAccessUrlUseCaseProvider.overrideWithValue(useCase),
              readerLocalDataSourceProvider.overrideWithValue(fakeLocal),
              dioClientProvider.overrideWithValue(Dio()),
              pdfDocumentViewBuilderProvider.overrideWithValue(
                (context, props) => const SizedBox(),
              ),
            ],
            child: const MaterialApp(
              home: InAppPdfReaderScreen(
                ebookId: testEbookId,
                title: 'Buku Uji Dismiss Screen',
                totalPages: 50,
              ),
            ),
          ),
        );

        await tester.pumpAndSettle();

        expect(find.byKey(const Key('resume_reading_banner')), findsOneWidget);

        // Tap tombol dismiss
        await tester.tap(find.byKey(const Key('dismiss_resume_notice_button')));
        await tester.pumpAndSettle();

        // Banner hilang tetapi posisi halaman tetap 17
        expect(find.byKey(const Key('resume_reading_banner')), findsNothing);
        expect(find.text('Halaman 17 / 50'), findsOneWidget);
      },
    );
  });
}
