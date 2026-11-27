// ignore_for_file: prefer_initializing_formals
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/config/api_config.dart';
import '../../../../core/constants/app_assets.dart';
import '../../../../core/network/dio_client.dart';
import '../../../catalog/domain/entities/catalog_filter.dart';
import '../../../catalog/domain/repositories/catalog_repository.dart';
import '../../../catalog/presentation/providers/catalog_provider.dart';
import '../../data/datasources/recommendation_remote_datasource.dart';
import '../../data/mock/home_mock_data.dart';
import '../../data/repositories/recommendation_repository_impl.dart';
import '../../domain/models/category.dart';
import '../../domain/models/ebook.dart';
import '../../domain/repositories/recommendation_repository.dart';

/// UI loading/data states required by `mobile/AGENTS.md` and `antislop` R-27.
enum HomeLoadStatus { loaded, loading, empty, error }

/// Immutable state for `Beranda Mobile (Neubrutalism)`.
class HomeState {
  final HomeLoadStatus status;
  final String searchQuery;
  final String selectedCategoryId;
  final int selectedNavIndex;
  final int cartCount;
  final List<Category> categories;
  final Ebook featuredSawBook;
  final List<Ebook> latestReleases;
  final List<EbookBundle> bundles;
  final String? errorMessage;

  const HomeState({
    this.status = HomeLoadStatus.loaded,
    this.searchQuery = '',
    this.selectedCategoryId = 'semua',
    this.selectedNavIndex = 0,
    this.cartCount = 2,
    this.categories = HomeMockData.categories,
    this.featuredSawBook = HomeMockData.featuredSawBook,
    this.latestReleases = HomeMockData.latestReleases,
    this.bundles = HomeMockData.bundles,
    this.errorMessage,
  });

  List<Ebook> get filteredLatestReleases {
    final query = searchQuery.trim().toLowerCase();
    return latestReleases.where((book) {
      final matchesCategory =
          selectedCategoryId == 'semua' ||
          _matchesCategory(book.category, selectedCategoryId, categories);
      final matchesQuery =
          query.isEmpty ||
          book.title.toLowerCase().contains(query) ||
          book.author.toLowerCase().contains(query) ||
          book.isbn.toLowerCase().contains(query) ||
          book.badgeLabel.toLowerCase().contains(query);
      return matchesCategory && matchesQuery;
    }).toList();
  }

  bool get isFeaturedVisible {
    final query = searchQuery.trim().toLowerCase();
    final matchesCategory =
        selectedCategoryId == 'semua' ||
        _matchesCategory(
          featuredSawBook.category,
          selectedCategoryId,
          categories,
        );
    final matchesQuery =
        query.isEmpty ||
        featuredSawBook.title.toLowerCase().contains(query) ||
        featuredSawBook.author.toLowerCase().contains(query) ||
        featuredSawBook.isbn.toLowerCase().contains(query) ||
        featuredSawBook.badgeLabel.toLowerCase().contains(query);
    return matchesCategory && matchesQuery;
  }

  static bool _matchesCategory(
    String bookCategory,
    String selectedId,
    List<Category> availableCategories,
  ) {
    final selected = availableCategories
        .where((c) => c.id == selectedId)
        .firstOrNull;
    if (selected == null) return true;
    return bookCategory.toLowerCase() == selected.label.toLowerCase();
  }

  HomeState copyWith({
    HomeLoadStatus? status,
    String? searchQuery,
    String? selectedCategoryId,
    int? selectedNavIndex,
    int? cartCount,
    List<Category>? categories,
    Ebook? featuredSawBook,
    List<Ebook>? latestReleases,
    List<EbookBundle>? bundles,
    String? errorMessage,
  }) {
    return HomeState(
      status: status ?? this.status,
      searchQuery: searchQuery ?? this.searchQuery,
      selectedCategoryId: selectedCategoryId ?? this.selectedCategoryId,
      selectedNavIndex: selectedNavIndex ?? this.selectedNavIndex,
      cartCount: cartCount ?? this.cartCount,
      categories: categories ?? this.categories,
      featuredSawBook: featuredSawBook ?? this.featuredSawBook,
      latestReleases: latestReleases ?? this.latestReleases,
      bundles: bundles ?? this.bundles,
      errorMessage: errorMessage,
    );
  }
}

// ---------------------------------------------------------------------------
// Dependency Injection Providers
// ---------------------------------------------------------------------------

final recommendationRemoteDataSourceProvider =
    Provider<RecommendationRemoteDataSource>((ref) {
      final dio = ref.watch(dioClientProvider);
      return RecommendationRemoteDataSourceImpl(dio: dio);
    });

final recommendationRepositoryProvider = Provider<RecommendationRepository>((
  ref,
) {
  final remote = ref.watch(recommendationRemoteDataSourceProvider);
  return RecommendationRepositoryImpl(
    remoteDataSource: remote,
    useRemote: ApiConfig.useRemoteRecommendation,
  );
});

// ---------------------------------------------------------------------------
// State Notifier & Controller
// ---------------------------------------------------------------------------

class HomeNotifier extends StateNotifier<HomeState> {
  final RecommendationRepository? _recommendationRepository;
  final CatalogRepository? _catalogRepository;

  HomeNotifier({
    RecommendationRepository? recommendationRepository,
    CatalogRepository? catalogRepository,
    bool autoLoad = true,
  }) : _recommendationRepository = recommendationRepository,
       _catalogRepository = catalogRepository,
       super(const HomeState()) {
    if (autoLoad) {
      if (_recommendationRepository != null) {
        loadSawRecommendation();
      }
      if (_catalogRepository != null && ApiConfig.useRemoteCatalog) {
        loadRemoteCatalog();
      }
    }
  }

  /// Memuat kategori & rilisan e-book terbaru dari backend (saat mode remote)
  Future<void> loadRemoteCatalog() async {
    final catalogRepo = _catalogRepository;
    if (catalogRepo == null || !ApiConfig.useRemoteCatalog) return;
    try {
      final remoteCategories = await catalogRepo.getCategories();
      final remotePage = await catalogRepo.getEbooks(
        filter: const CatalogFilter(),
        page: 1,
        limit: 10,
      );

      final mappedCategories = <Category>[
        const Category(id: 'semua', label: 'Semua'),
        ...remoteCategories.map((c) => Category(id: c.id, label: c.name)),
      ];

      final mappedBooks = remotePage.items.map((item) {
        final catName = item.categoryName ?? 'Umum';
        return Ebook(
          id: item.id,
          title: item.title,
          author: item.author,
          category: catName,
          badgeLabel: catName.toUpperCase(),
          coverAsset: (item.coverUrl != null && item.coverUrl!.isNotEmpty)
              ? item.coverUrl!
              : AppAssets.coverDesainSistemModern,
          price: item.price,
          rating: item.ratingAvg,
          reviewCount: item.salesCount,
          isbn: '978-623-000-000-0',
          isRemoteSource: true,
        );
      }).toList();

      state = state.copyWith(
        categories: mappedCategories.length > 1
            ? mappedCategories
            : state.categories,
        latestReleases: mappedBooks.isNotEmpty
            ? mappedBooks
            : state.latestReleases,
      );
    } catch (_) {
      // Fallback aman ke data simulasi bila backend tidak terjangkau
    }
  }

  /// Memuat rekomendasi e-book SAW dari backend secara asinkron
  Future<void> loadSawRecommendation() async {
    final repo = _recommendationRepository;
    if (repo == null) return;
    try {
      final categoryId = state.selectedCategoryId == 'semua'
          ? null
          : state.selectedCategoryId;
      final book = await repo.getFeaturedSawBook(categoryId: categoryId);
      state = state.copyWith(featuredSawBook: book);
    } catch (_) {
      // Tetap menggunakan fallback aman data simulasi
    }
  }

  /// Memuat ulang data rekomendasi & katalog (pull-to-refresh / app resume)
  Future<void> refresh() async {
    await Future.wait([loadSawRecommendation(), loadRemoteCatalog()]);
  }

  void updateSearchQuery(String query) {
    state = state.copyWith(searchQuery: query, status: HomeLoadStatus.loaded);
  }

  void selectCategory(String categoryId) {
    state = state.copyWith(
      selectedCategoryId: categoryId,
      status: HomeLoadStatus.loaded,
    );
    loadSawRecommendation();
  }

  void resetFilters() {
    state = state.copyWith(
      searchQuery: '',
      selectedCategoryId: 'semua',
      status: HomeLoadStatus.loaded,
    );
    loadSawRecommendation();
  }

  void selectNavIndex(int index) {
    state = state.copyWith(selectedNavIndex: index);
  }

  void addToCart() {
    state = state.copyWith(cartCount: state.cartCount + 1);
  }

  void setCartCount(int count) {
    state = state.copyWith(cartCount: count.clamp(0, 999));
  }

  void setLoadStatus(HomeLoadStatus status) {
    state = state.copyWith(
      status: status,
      errorMessage: status == HomeLoadStatus.error
          ? 'Gagal memuat katalog dari server. Menampilkan mode simulasi.'
          : null,
    );
  }

  void retryLoad() {
    state = state.copyWith(
      status: HomeLoadStatus.loaded,
      searchQuery: '',
      selectedCategoryId: 'semua',
      errorMessage: null,
    );
    loadSawRecommendation();
  }
}

final homeProvider = StateNotifierProvider<HomeNotifier, HomeState>((ref) {
  final repo = ref.watch(recommendationRepositoryProvider);
  final catalogRepo = ref.watch(catalogRepositoryProvider);
  return HomeNotifier(
    recommendationRepository: repo,
    catalogRepository: catalogRepo,
  );
});
