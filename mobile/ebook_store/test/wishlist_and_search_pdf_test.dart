import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ebook_store/core/network/dio_client.dart';
import 'package:ebook_store/features/catalog/data/datasources/wishlist_local_datasource.dart';
import 'package:ebook_store/features/catalog/domain/entities/catalog_ebook.dart';
import 'package:ebook_store/features/catalog/presentation/pages/ebook_detail_screen.dart';
import 'package:ebook_store/features/catalog/presentation/providers/catalog_provider.dart';
import 'package:ebook_store/features/catalog/presentation/providers/wishlist_provider.dart';
import 'package:ebook_store/features/library/data/datasources/library_mock_datasource.dart';
import 'package:ebook_store/features/library/data/repositories/library_repository_impl.dart';
import 'package:ebook_store/features/library/domain/usecases/get_signed_access_url_usecase.dart';
import 'package:ebook_store/features/library/presentation/pages/in_app_pdf_reader_screen.dart';
import 'package:ebook_store/features/library/presentation/providers/library_provider.dart';
import 'package:ebook_store/features/library/presentation/widgets/in_app_pdf_reader_toolbar.dart';
import 'package:ebook_store/features/library/presentation/widgets/pdf_document_view.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  const dummyDetail = CatalogEbook(
    id: 'ebook-test-01',
    title: 'Clean Architecture Flutter',
    author: 'Uncle Bob',
    description: 'Buku panduan arsitektur bersih mobile.',
    price: 150000,
    coverUrl: 'https://example.com/cover.jpg',
    categoryName: 'Teknologi & Software',
    publishedYear: 2024,
    ratingAvg: 4.8,
    salesCount: 140,
    pageCount: 280,
  );

  group('P3.2 Wishlist Feature Tests', () {
    test('WishlistNotifier toggles IDs in and out correctly', () {
      final mockDs = WishlistLocalDataSourceImpl();
      final notifier = WishlistNotifier(
        localDataSource: mockDs,
        initialWishlist: const <String>{},
        autoLoad: false,
      );

      expect(notifier.isWishlisted('ebook-test-01'), isFalse);

      final added = notifier.toggleWishlist('ebook-test-01');
      expect(added, isTrue);
      expect(notifier.isWishlisted('ebook-test-01'), isTrue);
      expect(notifier.state.contains('ebook-test-01'), isTrue);

      final removed = notifier.toggleWishlist('ebook-test-01');
      expect(removed, isFalse);
      expect(notifier.isWishlisted('ebook-test-01'), isFalse);
    });

    testWidgets(
      'EbookDetailScreen toggles bookmark button and shows SnackBar feedback',
      (WidgetTester tester) async {
        tester.view.physicalSize = const Size(400, 900);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() => tester.view.resetPhysicalSize());

        final mockDs = WishlistLocalDataSourceImpl();
        final notifier = WishlistNotifier(
          localDataSource: mockDs,
          initialWishlist: const <String>{},
          autoLoad: false,
        );

        await tester.pumpWidget(
          ProviderScope(
            overrides: [
              ebookDetailProvider(
                'ebook-test-01',
              ).overrideWith((ref) => dummyDetail),
              wishlistProvider.overrideWith((ref) => notifier),
            ],
            child: const MaterialApp(
              home: Scaffold(body: EbookDetailScreen(ebookId: 'ebook-test-01')),
            ),
          ),
        );

        await tester.pumpAndSettle();

        final wishlistBtn = find.byKey(
          const Key('ebook_detail_wishlist_button'),
        );
        expect(wishlistBtn, findsOneWidget);

        // Tap bookmark button -> Added
        await tester.tap(wishlistBtn);
        await tester.pumpAndSettle();

        expect(find.text('E-book ditambahkan ke Wishlist!'), findsOneWidget);
        expect(notifier.isWishlisted('ebook-test-01'), isTrue);

        // Tap bookmark button again -> Removed
        await tester.tap(wishlistBtn);
        await tester.pumpAndSettle();

        expect(find.text('E-book dihapus dari Wishlist.'), findsOneWidget);
        expect(notifier.isWishlisted('ebook-test-01'), isFalse);
      },
    );
  });

  group('P3.2 PDF Reader In-App Search Text Tests', () {
    testWidgets(
      'InAppPdfReaderToolbar toggles search panel and cycles matches',
      (WidgetTester tester) async {
        tester.view.physicalSize = const Size(400, 900);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() => tester.view.resetPhysicalSize());

        bool isSearching = false;
        String searchQuery = '';
        int currentMatch = 0;
        int totalMatches = 0;
        final controller = TextEditingController();

        await tester.pumpWidget(
          StatefulBuilder(
            builder: (context, setState) {
              return MaterialApp(
                home: Scaffold(
                  body: InAppPdfReaderToolbar(
                    title: 'Clean Architecture Flutter',
                    currentPage: 1,
                    totalPages: 50,
                    zoomLevel: 1.0,
                    onPreviousPage: () {},
                    onNextPage: () {},
                    onZoomIn: () {},
                    onZoomOut: () {},
                    onClose: () {},
                    isSearching: isSearching,
                    searchController: controller,
                    currentMatchIndex: currentMatch,
                    totalMatches: totalMatches,
                    onToggleSearch: () {
                      setState(() {
                        isSearching = !isSearching;
                        if (!isSearching) {
                          controller.clear();
                          currentMatch = 0;
                          totalMatches = 0;
                        }
                      });
                    },
                    onSearchChanged: (val) {
                      setState(() {
                        searchQuery = val;
                        if (val.isEmpty) {
                          currentMatch = 0;
                          totalMatches = 0;
                        } else {
                          totalMatches = 3;
                          currentMatch = 1;
                        }
                      });
                    },
                    onSearchNext: () {
                      setState(() {
                        if (currentMatch < totalMatches) {
                          currentMatch++;
                        } else {
                          currentMatch = 1;
                        }
                      });
                    },
                    onSearchPrevious: () {
                      setState(() {
                        if (currentMatch > 1) {
                          currentMatch--;
                        } else {
                          currentMatch = totalMatches;
                        }
                      });
                    },
                  ),
                ),
              );
            },
          ),
        );

        await tester.pumpAndSettle();

        // Initially search panel should not be visible
        expect(find.byKey(const Key('reader_search_panel')), findsNothing);

        // Tap toggle search button
        final toggleBtn = find.byKey(const Key('reader_toggle_search_button'));
        expect(toggleBtn, findsOneWidget);
        await tester.tap(toggleBtn);
        await tester.pumpAndSettle();

        // Search panel should now appear
        expect(find.byKey(const Key('reader_search_panel')), findsOneWidget);
        expect(find.byKey(const Key('reader_search_input')), findsOneWidget);

        // Enter search term
        await tester.enterText(
          find.byKey(const Key('reader_search_input')),
          'arsitektur',
        );
        await tester.pumpAndSettle();

        expect(searchQuery, 'arsitektur');
        expect(find.text('1 / 3'), findsOneWidget);

        // Tap next match
        final nextBtn = find.byKey(const Key('reader_search_next_button'));
        await tester.tap(nextBtn);
        await tester.pumpAndSettle();
        expect(find.text('2 / 3'), findsOneWidget);

        // Tap prev match
        final prevBtn = find.byKey(const Key('reader_search_prev_button'));
        await tester.tap(prevBtn);
        await tester.pumpAndSettle();
        expect(find.text('1 / 3'), findsOneWidget);

        // Close search panel
        final closeBtn = find.byKey(const Key('reader_search_close_button'));
        await tester.tap(closeBtn);
        await tester.pumpAndSettle();

        expect(find.byKey(const Key('reader_search_panel')), findsNothing);
      },
    );

    testWidgets(
      'InAppPdfReaderScreen integrates search panel and controls properly',
      (WidgetTester tester) async {
        tester.view.physicalSize = const Size(400, 900);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() => tester.view.resetPhysicalSize());

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
              dioClientProvider.overrideWithValue(Dio()),
              pdfDocumentViewBuilderProvider.overrideWithValue(
                (context, props) => Container(
                  key: const Key('mock_pdf_view'),
                  child: const Text('Mock PDF Content'),
                ),
              ),
            ],
            child: const MaterialApp(
              home: InAppPdfReaderScreen(
                ebookId: 'test-doc-01',
                title: 'Buku Uji Integrasi',
                totalPages: 30,
              ),
            ),
          ),
        );

        await tester.pumpAndSettle();

        // Toggle search in screen
        final toggleBtn = find.byKey(const Key('reader_toggle_search_button'));
        expect(toggleBtn, findsOneWidget);
        await tester.tap(toggleBtn);
        await tester.pumpAndSettle();

        // Panel exists
        expect(find.byKey(const Key('reader_search_panel')), findsOneWidget);

        // Type query
        await tester.enterText(
          find.byKey(const Key('reader_search_input')),
          'bab 1',
        );
        await tester.pumpAndSettle();

        // Match indicator exists
        expect(
          find.byKey(const Key('reader_search_next_button')),
          findsOneWidget,
        );

        // Tap next
        await tester.tap(find.byKey(const Key('reader_search_next_button')));
        await tester.pumpAndSettle();

        // Close search
        await tester.tap(find.byKey(const Key('reader_search_close_button')));
        await tester.pumpAndSettle();

        expect(find.byKey(const Key('reader_search_panel')), findsNothing);
      },
    );
  });
}
