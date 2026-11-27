import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ebook_store/theme/app_colors.dart';
import 'package:ebook_store/features/cart/presentation/providers/cart_provider.dart';
import 'package:ebook_store/features/home/data/models/saw_recommendation_model.dart';
import 'package:ebook_store/features/home/domain/models/ebook.dart';
import 'package:ebook_store/features/home/domain/repositories/recommendation_repository.dart';
import 'package:ebook_store/features/home/presentation/providers/home_provider.dart';
import 'package:ebook_store/features/home/presentation/widgets/featured_books_section.dart';
import 'package:ebook_store/features/recommendations/presentation/pages/saw_ranking_screen.dart';
import 'package:ebook_store/features/recommendations/presentation/providers/saw_ranking_provider.dart';

class FakeRecommendationRepositoryForRanking
    implements RecommendationRepository {
  final List<SawRecommendationModel> mockRankings;
  final List<SawCriterionModel> mockCriteria;

  FakeRecommendationRepositoryForRanking(
    this.mockRankings, {
    this.mockCriteria = SawCriterionModel.defaultCriteria,
  });

  @override
  Future<Ebook> getFeaturedSawBook({String? categoryId}) async {
    throw UnimplementedError();
  }

  @override
  Future<List<SawRecommendationModel>> getSawRankingList({
    String? categoryId,
    int limit = 10,
  }) async {
    final res = await getSawRankingWithCriteria(
      categoryId: categoryId,
      limit: limit,
    );
    return res.items;
  }

  @override
  Future<SawRankingResponse> getSawRankingWithCriteria({
    String? categoryId,
    int limit = 10,
  }) async {
    final filtered =
        (categoryId != null && categoryId.isNotEmpty && categoryId != 'semua')
        ? mockRankings
              .where(
                (e) =>
                    e.categoryName?.toLowerCase().contains(
                      categoryId.toLowerCase(),
                    ) ??
                    false,
              )
              .toList()
        : mockRankings;
    return SawRankingResponse(
      items: filtered,
      activeCriteria: mockCriteria,
      isRemote: false,
    );
  }
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  final sampleRankings = [
    const SawRecommendationModel(
      rank: 1,
      ebookId: 'eb-007',
      title: 'Desain Sistem Modern',
      author: 'Ahmad Fauzi',
      price: '68000',
      categoryName: 'Teknologi & AI',
      sawScore: 0.942,
      displayScore: '0.942',
      rawValues: {'C1': 68000, 'C2': 4.8, 'C3': 1450},
      normalizedValues: {'C1': 0.809, 'C2': 0.980, 'C3': 1.000},
    ),
    const SawRecommendationModel(
      rank: 2,
      ebookId: 'eb-008',
      title: 'Algoritma & Struktur Data',
      author: 'Budi Santoso',
      price: '55000',
      categoryName: 'Teknologi & AI',
      sawScore: 0.895,
      displayScore: '0.895',
      rawValues: {'C1': 55000, 'C2': 4.6, 'C3': 1200},
      normalizedValues: {'C1': 1.000, 'C2': 0.939, 'C3': 0.828},
    ),
    const SawRecommendationModel(
      rank: 3,
      ebookId: 'eb-009',
      title: 'Psikologi Produk Digital',
      author: 'Sarah Utami',
      price: '49000',
      categoryName: 'Desain & UI/UX',
      sawScore: 0.864,
      displayScore: '0.864',
      rawValues: {'C1': 49000, 'C2': 4.9, 'C3': 980},
      normalizedValues: {'C1': 1.000, 'C2': 1.000, 'C3': 0.676},
    ),
  ];

  Widget buildTestableScreen({
    List<SawRecommendationModel>? rankings,
    bool isRemote = false,
  }) {
    final fakeRepo = FakeRecommendationRepositoryForRanking(
      rankings ?? sampleRankings,
    );

    return ProviderScope(
      overrides: [
        recommendationRepositoryProvider.overrideWithValue(fakeRepo),
        sawRankingProvider.overrideWith(
          (ref) => SawRankingNotifier(
            repository: fakeRepo,
            isRemote: isRemote,
            autoFetch: true,
          ),
        ),
      ],
      child: const MaterialApp(home: SawRankingScreen()),
    );
  }

  group('P3.1 Halaman Khusus Rekomendasi SAW Tests', () {
    testWidgets(
      '1. Merender header SPK SAW, kartu bobot kriteria, filter kategori, dan kartu peringkat Top-N',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        await tester.pumpWidget(buildTestableScreen(isRemote: true));
        await tester.pumpAndSettle();

        // 1. Header
        expect(find.text('SPK REKOMENDASI SAW'), findsOneWidget);
        expect(find.text('SPK AKTIF'), findsOneWidget);

        // 2. Info Kriteria
        expect(find.byKey(const Key('saw_criteria_info_card')), findsOneWidget);
        expect(find.text('C1: Harga'), findsOneWidget);
        expect(find.text('C2: Rating'), findsOneWidget);
        expect(find.text('C3: Terjual'), findsOneWidget);

        // 3. Daftar peringkat Top-N
        expect(find.byKey(const Key('saw_rank_card_1')), findsOneWidget);
        expect(find.text('Desain Sistem Modern'), findsOneWidget);
        expect(find.text('0.942'), findsWidgets);

        expect(find.byKey(const Key('saw_rank_card_2')), findsOneWidget);
        expect(find.text('Algoritma & Struktur Data'), findsOneWidget);

        expect(find.byKey(const Key('saw_rank_card_3')), findsOneWidget);
        expect(find.text('Psikologi Produk Digital'), findsOneWidget);
      },
    );

    testWidgets(
      '2. Menekan tombol "Lihat Matriks Normalisasi" membuka dekonstruksi nilai matriks keputusan',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        await tester.pumpWidget(buildTestableScreen());
        await tester.pumpAndSettle();

        // Awalnya tabel matriks belum dibuka
        expect(find.byKey(const Key('matrix_table_1')), findsNothing);

        // Tap toggle matriks pada rank 1
        await tester.tap(find.byKey(const Key('toggle_matrix_button_1')));
        await tester.pumpAndSettle();

        // Tabel dekonstruksi matriks muncul dengan nilai normalisasi dan kontribusi bobot
        expect(find.byKey(const Key('matrix_table_1')), findsOneWidget);
        expect(
          find.text('DEKONSTRUKSI MATRIKS KEPUTUSAN & NORMALISASI:'),
          findsOneWidget,
        );
        expect(find.text('Total Nilai Preferensi (V_i):'), findsOneWidget);

        // Tutup kembali
        await tester.tap(find.byKey(const Key('toggle_matrix_button_1')));
        await tester.pumpAndSettle();
        expect(find.byKey(const Key('matrix_table_1')), findsNothing);
      },
    );

    testWidgets(
      '3. Interaksi filter kategori memperbarui daftar peringkat e-book',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        await tester.pumpWidget(buildTestableScreen());
        await tester.pumpAndSettle();

        expect(find.text('Desain Sistem Modern'), findsOneWidget);
        expect(find.text('Psikologi Produk Digital'), findsOneWidget);

        // Filter ke Desain & UI/UX
        final filterChip = find.byKey(const Key('filter_category_desain'));
        await tester.ensureVisible(filterChip);
        await tester.pumpAndSettle();
        await tester.tap(filterChip);
        await tester.pumpAndSettle();

        // Hanya e-book Desain yang muncul
        expect(find.text('Desain Sistem Modern'), findsNothing);
        expect(find.text('Psikologi Produk Digital'), findsOneWidget);
      },
    );

    testWidgets(
      '4. Menekan tombol "+ BELI" menambahkan e-book ke keranjang belanja',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        late WidgetRef capturedRef;

        await tester.pumpWidget(
          ProviderScope(
            overrides: [
              recommendationRepositoryProvider.overrideWithValue(
                FakeRecommendationRepositoryForRanking(sampleRankings),
              ),
              sawRankingProvider.overrideWith(
                (ref) => SawRankingNotifier(
                  repository: FakeRecommendationRepositoryForRanking(
                    sampleRankings,
                  ),
                  isRemote: false,
                  autoFetch: true,
                ),
              ),
            ],
            child: Consumer(
              builder: (context, ref, child) {
                capturedRef = ref;
                return const MaterialApp(home: SawRankingScreen());
              },
            ),
          ),
        );
        await tester.pumpAndSettle();

        // Bersihkan keranjang awal
        capturedRef.read(cartProvider.notifier).clearCart();
        expect(capturedRef.read(cartProvider).items, isEmpty);

        // Tap tombol + BELI pada rank 1
        await tester.tap(find.byKey(const Key('saw_add_cart_btn_1')));
        await tester.pump();

        // Item masuk ke cart
        expect(capturedRef.read(cartProvider).items.length, 1);
        expect(
          capturedRef.read(cartProvider).items.first.title,
          'Desain Sistem Modern',
        );
      },
    );

    testWidgets(
      '5. FeaturedBooksSection memiliki tombol tautan menuju SawRankingScreen',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        const dummyBook = Ebook(
          id: 'eb-007',
          title: 'Desain Sistem Modern',
          author: 'Ahmad Fauzi',
          category: 'Teknologi & AI',
          badgeLabel: 'TEKNOLOGI & AI',
          coverAsset: '',
          price: 68000,
          rating: 4.8,
          reviewCount: 52,
          isbn: '978-623-001-101-4',
        );

        await tester.pumpWidget(
          ProviderScope(
            overrides: [
              recommendationRepositoryProvider.overrideWithValue(
                FakeRecommendationRepositoryForRanking(sampleRankings),
              ),
            ],
            child: MaterialApp(
              home: Scaffold(
                body: SingleChildScrollView(
                  child: FeaturedBooksSection(
                    book: dummyBook,
                    palette: const NbPalette(),
                    onDetailTap: () {},
                    onAddToCartTap: () {},
                  ),
                ),
              ),
            ),
          ),
        );
        await tester.pumpAndSettle();

        // Tombol menuju layar peringkat lengkap ada dan dapat ditekan
        expect(
          find.byKey(const Key('featured_view_all_saw_button')),
          findsOneWidget,
        );
        expect(
          find.text('LIHAT PERINGKAT LENGKAP TOP-N SAW →'),
          findsOneWidget,
        );

        await tester.tap(find.byKey(const Key('featured_view_all_saw_button')));
        await tester.pumpAndSettle();

        // Navigasi ke SawRankingScreen berhasil
        expect(find.byType(SawRankingScreen), findsOneWidget);
        expect(find.text('SPK REKOMENDASI SAW'), findsOneWidget);
      },
    );

    testWidgets(
      '6. Merender kriteria dinamis dari backend (misal 4 kriteria termasuk C4: Halaman)',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        const dynamicCriteria = [
          SawCriterionModel(
            id: 'C1',
            name: 'Harga',
            field: 'price',
            type: 'COST',
            weight: 0.30,
          ),
          SawCriterionModel(
            id: 'C2',
            name: 'Rating',
            field: 'ratingAvg',
            type: 'BENEFIT',
            weight: 0.30,
          ),
          SawCriterionModel(
            id: 'C3',
            name: 'Terjual',
            field: 'salesCount',
            type: 'BENEFIT',
            weight: 0.25,
          ),
          SawCriterionModel(
            id: 'C4',
            name: 'Halaman',
            field: 'pageCount',
            type: 'BENEFIT',
            weight: 0.15,
          ),
        ];

        final dynamicRankings = [
          const SawRecommendationModel(
            rank: 1,
            ebookId: 'eb-dyn-1',
            title: 'Arsitektur Cloud Modern',
            author: 'Raka Pratama',
            price: '80000',
            categoryName: 'Teknologi & AI',
            sawScore: 0.960,
            displayScore: '0.960',
            rawValues: {'C1': 80000, 'C2': 4.9, 'C3': 350, 'C4': 420},
            normalizedValues: {'C1': 1.0, 'C2': 1.0, 'C3': 0.9, 'C4': 1.0},
          ),
        ];

        final fakeRepo = FakeRecommendationRepositoryForRanking(
          dynamicRankings,
          mockCriteria: dynamicCriteria,
        );

        await tester.pumpWidget(
          ProviderScope(
            overrides: [
              recommendationRepositoryProvider.overrideWithValue(fakeRepo),
              sawRankingProvider.overrideWith(
                (ref) => SawRankingNotifier(
                  repository: fakeRepo,
                  isRemote: true,
                  autoFetch: true,
                ),
              ),
            ],
            child: const MaterialApp(home: SawRankingScreen()),
          ),
        );
        await tester.pumpAndSettle();

        expect(find.text('C4: Halaman'), findsOneWidget);
        expect(find.text('(BENEFIT 15%)'), findsOneWidget);

        await tester.tap(find.byKey(const Key('toggle_matrix_button_1')));
        await tester.pumpAndSettle();

        expect(find.byKey(const Key('matrix_table_1')), findsOneWidget);
        expect(find.text('420'), findsOneWidget);
        expect(find.text('0.15'), findsOneWidget);
      },
    );
  });
}
