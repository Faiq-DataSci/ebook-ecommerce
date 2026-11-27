import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ebook_store/features/home/data/datasources/recommendation_remote_datasource.dart';
import 'package:ebook_store/features/home/data/mock/home_mock_data.dart';
import 'package:ebook_store/features/home/data/models/saw_recommendation_model.dart';
import 'package:ebook_store/features/home/data/repositories/recommendation_repository_impl.dart';
import 'package:ebook_store/features/home/domain/models/ebook.dart';
import 'package:ebook_store/features/home/presentation/pages/home_screen.dart';
import 'package:ebook_store/features/home/presentation/providers/home_provider.dart';

class FakeRemoteDataSource implements RecommendationRemoteDataSource {
  final Ebook? responseBook;
  final bool shouldThrow;

  FakeRemoteDataSource({this.responseBook, this.shouldThrow = false});

  @override
  Future<Ebook> getTopSawRecommendation({String? categoryId}) async {
    if (shouldThrow) {
      throw DioException(
        requestOptions: RequestOptions(path: '/recommendations/saw'),
        type: DioExceptionType.connectionError,
        error: 'Koneksi gagal',
      );
    }
    return responseBook!;
  }

  @override
  Future<List<SawRecommendationModel>> getSawRankingList({
    String? categoryId,
    int limit = 10,
  }) async {
    if (shouldThrow) {
      throw DioException(
        requestOptions: RequestOptions(path: '/recommendations/saw'),
        type: DioExceptionType.connectionError,
        error: 'Koneksi gagal',
      );
    }
    return [
      SawRecommendationModel(
        rank: 1,
        ebookId: responseBook?.id ?? 'eb-007',
        title: responseBook?.title ?? 'Test Book',
        sawScore: 0.942,
        displayScore: '0.942',
      ),
    ];
  }

  @override
  Future<SawRankingResponse> getSawRankingWithCriteria({
    String? categoryId,
    int limit = 10,
  }) async {
    final items = await getSawRankingList(categoryId: categoryId, limit: limit);
    return SawRankingResponse(
      items: items,
      activeCriteria: SawCriterionModel.defaultCriteria,
      isRemote: true,
    );
  }
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  final mockRemoteBook = Ebook(
    id: '00000000-0000-4000-8000-000000000003',
    title: 'DATA SIMULASI - Pemrograman Cloud & Microservices',
    author: 'Prof. Budi Raharjo',
    category: 'Teknologi & AI',
    badgeLabel: 'TEKNOLOGI & AI',
    coverAsset: '',
    price: 85000,
    rating: 4.9,
    reviewCount: 140,
    isbn: '978-623-001-999-9',
    isRemoteSource: true,
    sawBreakdown: const SawCriteriaBreakdown(
      c1PriceWeight: 0.30,
      c2RatingWeight: 0.50,
      c3PopularityWeight: 0.20,
      c4CategoryWeight: 0.20,
      totalPreferenceScore: 0.985,
      rank: 1,
    ),
  );

  group('SAW Recommendation Remote Provider Integration', () {
    test(
      '1. SawRecommendationModel accurately parses backend JSON envelope into Ebook',
      () {
        final sampleJson = <String, dynamic>{
          'rank': 1,
          'ebookId': '00000000-0000-4000-8000-000000000003',
          'title': 'DATA SIMULASI - Ebook Alternatif 3',
          'sawScore': 0.942,
          'displayScore': '0.942',
          'author': 'Penulis Tiga',
          'price': '40000',
          'coverUrl': 'https://example.com/cover3.png',
          'category': {
            'id': '00000000-0000-4000-8000-000000000100',
            'name': 'Teknologi',
            'slug': 'teknologi',
          },
          'rawValues': {'C1': 40000, 'C2': 4.8, 'C3': 200},
          'normalizedValues': {'C1': 1.0, 'C2': 0.96, 'C3': 1.0},
        };

        final model = SawRecommendationModel.fromJson(sampleJson);
        expect(model.rank, 1);
        expect(model.ebookId, '00000000-0000-4000-8000-000000000003');
        expect(model.sawScore, 0.942);
        expect(model.categoryName, 'Teknologi');

        final ebook = model.toEbook();
        expect(ebook.title, 'DATA SIMULASI - Ebook Alternatif 3');
        expect(ebook.price, 40000);
        expect(ebook.rating, 4.8);
        expect(ebook.reviewCount, 200);
        expect(ebook.sawBreakdown, isNotNull);
        expect(ebook.sawBreakdown!.totalPreference, 0.942);
        expect(ebook.sawBreakdown!.rank, 1);
      },
    );

    test(
      '2. RecommendationRepositoryImpl returns remote book when remote is enabled',
      () async {
        final fakeDataSource = FakeRemoteDataSource(
          responseBook: mockRemoteBook,
        );
        final repo = RecommendationRepositoryImpl(
          remoteDataSource: fakeDataSource,
          useRemote: true,
        );

        final book = await repo.getFeaturedSawBook();
        expect(book.id, mockRemoteBook.id);
        expect(book.title, mockRemoteBook.title);
        expect(book.sawBreakdown?.totalPreferenceScore, 0.985);
      },
    );

    test(
      '3. RecommendationRepositoryImpl gracefully falls back to simulation data on network error',
      () async {
        final failingDataSource = FakeRemoteDataSource(shouldThrow: true);
        final repo = RecommendationRepositoryImpl(
          remoteDataSource: failingDataSource,
          useRemote: true,
        );

        final book = await repo.getFeaturedSawBook();
        // Harus jatuh ke data simulasi default (mobile/AGENTS.md)
        expect(book.id, HomeMockData.featuredSawBook.id);
        expect(book.title, HomeMockData.featuredSawBook.title);
      },
    );

    test(
      '4. HomeNotifier dynamically updates state when remote recommendation is loaded',
      () async {
        final fakeRepo = RecommendationRepositoryImpl(
          remoteDataSource: FakeRemoteDataSource(responseBook: mockRemoteBook),
          useRemote: true,
        );

        final notifier = HomeNotifier(
          recommendationRepository: fakeRepo,
          autoLoad: false,
        );

        expect(
          notifier.state.featuredSawBook.id,
          HomeMockData.featuredSawBook.id,
        );

        await notifier.loadSawRecommendation();

        expect(notifier.state.featuredSawBook.id, mockRemoteBook.id);
        expect(notifier.state.featuredSawBook.title, mockRemoteBook.title);
        expect(notifier.state.featuredSawBook.price, 85000);
        expect(notifier.state.featuredSawBook.sawBreakdown?.rank, 1);
      },
    );

    testWidgets(
      '5. HomeScreen renders remote SAW recommendation dynamically on UI',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        final fakeRepo = RecommendationRepositoryImpl(
          remoteDataSource: FakeRemoteDataSource(responseBook: mockRemoteBook),
          useRemote: true,
        );

        await tester.pumpWidget(
          ProviderScope(
            overrides: [
              recommendationRepositoryProvider.overrideWithValue(fakeRepo),
            ],
            child: const MaterialApp(home: HomeScreen()),
          ),
        );

        await tester.pumpAndSettle();

        // Verifikasi bahwa judul buku rekomendasi remote tampil di beranda
        expect(
          find.text('DATA SIMULASI - Pemrograman Cloud & Microservices'),
          findsOneWidget,
        );
        expect(find.text('Prof. Budi Raharjo'), findsOneWidget);
        expect(find.text('Rp 85.000'), findsOneWidget);
        expect(find.text('SPK SAW AKTIF'), findsOneWidget);
        expect(find.text('#1 PILIHAN TERBAIK'), findsOneWidget);
        expect(find.text('99% COCOK'), findsOneWidget);
      },
    );
  });
}
