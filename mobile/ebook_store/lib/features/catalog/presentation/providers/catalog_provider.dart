// ignore_for_file: prefer_initializing_formals
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/config/api_config.dart';
import '../../../../core/network/dio_client.dart';
import '../../data/datasources/catalog_mock_datasource.dart';
import '../../data/datasources/catalog_remote_datasource.dart';
import '../../data/repositories/catalog_repository_impl.dart';
import '../../domain/entities/catalog_category.dart';
import '../../domain/entities/catalog_ebook.dart';
import '../../domain/entities/catalog_failure.dart';
import '../../domain/entities/catalog_filter.dart';
import '../../domain/repositories/catalog_repository.dart';

enum CatalogViewMode { grid, list }

enum CatalogStatus {
  initial,
  loading,
  loaded,
  empty,
  error,
}

class CatalogState {
  final CatalogStatus status;
  final List<CatalogEbook> ebooks;
  final List<CatalogCategory> categories;
  final CatalogFilter filter;
  final int page;
  final int totalCount;
  final bool hasMore;
  final bool isLoadingMore;
  final String? loadMoreError;
  final String? errorMessage;
  final CatalogViewMode viewMode;
  final int cartCount;
  final List<CatalogEbook> cartItems;
  final bool isMock;

  const CatalogState({
    this.status = CatalogStatus.initial,
    this.ebooks = const [],
    this.categories = const [],
    this.filter = const CatalogFilter(),
    this.page = 1,
    this.totalCount = 0,
    this.hasMore = false,
    this.isLoadingMore = false,
    this.loadMoreError,
    this.errorMessage,
    this.viewMode = CatalogViewMode.grid,
    this.cartCount = 0,
    this.cartItems = const [],
    this.isMock = true,
  });

  /// Menunjukkan apakah hasil pencarian/filter kosong saat katalog induk ada isinya.
  bool get isNoResult =>
      status == CatalogStatus.loaded &&
      ebooks.isEmpty &&
      (filter.hasActiveFilters || filter.hasSearchQuery);

  CatalogState copyWith({
    CatalogStatus? status,
    List<CatalogEbook>? ebooks,
    List<CatalogCategory>? categories,
    CatalogFilter? filter,
    int? page,
    int? totalCount,
    bool? hasMore,
    bool? isLoadingMore,
    String? loadMoreError,
    bool clearLoadMoreError = false,
    String? errorMessage,
    bool clearErrorMessage = false,
    CatalogViewMode? viewMode,
    int? cartCount,
    List<CatalogEbook>? cartItems,
    bool? isMock,
  }) {
    return CatalogState(
      status: status ?? this.status,
      ebooks: ebooks ?? this.ebooks,
      categories: categories ?? this.categories,
      filter: filter ?? this.filter,
      page: page ?? this.page,
      totalCount: totalCount ?? this.totalCount,
      hasMore: hasMore ?? this.hasMore,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
      loadMoreError: clearLoadMoreError
          ? null
          : (loadMoreError ?? this.loadMoreError),
      errorMessage:
          clearErrorMessage ? null : (errorMessage ?? this.errorMessage),
      viewMode: viewMode ?? this.viewMode,
      cartCount: cartCount ?? this.cartCount,
      cartItems: cartItems ?? this.cartItems,
      isMock: isMock ?? this.isMock,
    );
  }
}

// ---------------------------------------------------------------------------
// Dependecy Injection Providers
// ---------------------------------------------------------------------------

final catalogRemoteDataSourceProvider =
    Provider<CatalogRemoteDataSource>((ref) {
  final dio = ref.watch(dioClientProvider);
  return CatalogRemoteDataSourceImpl(dio: dio);
});

final catalogMockDataSourceProvider = Provider<CatalogMockDataSource>((ref) {
  return CatalogMockDataSourceImpl();
});

final catalogRepositoryProvider = Provider<CatalogRepository>((ref) {
  final remote = ref.watch(catalogRemoteDataSourceProvider);
  final mock = ref.watch(catalogMockDataSourceProvider);
  return CatalogRepositoryImpl(
    remoteDataSource: remote,
    mockDataSource: mock,
    useRemote: ApiConfig.useRemoteCatalog,
  );
});

// ---------------------------------------------------------------------------
// State Notifier & Controller
// ---------------------------------------------------------------------------

class CatalogNotifier extends StateNotifier<CatalogState> {
  final CatalogRepository _repository;

  CatalogNotifier({
    required CatalogRepository repository,
    bool isMock = true,
  })  : _repository = repository,
        super(CatalogState(isMock: isMock)) {
    loadInitial();
  }

  /// Memuat kategori dan halaman pertama e-book
  Future<void> loadInitial() async {
    state = state.copyWith(
      status: CatalogStatus.loading,
      clearErrorMessage: true,
      page: 1,
    );

    try {
      // 1. Muat kategori aktif
      final categories = await _repository.getCategories();

      // 2. Muat e-book halaman 1
      final catalogPage = await _repository.getEbooks(
        filter: state.filter,
        page: 1,
        limit: 6,
      );

      final nextStatus =
          catalogPage.total == 0 && !state.filter.hasActiveFilters && !state.filter.hasSearchQuery
              ? CatalogStatus.empty
              : CatalogStatus.loaded;

      state = state.copyWith(
        status: nextStatus,
        categories: categories,
        ebooks: catalogPage.items,
        page: catalogPage.page,
        totalCount: catalogPage.total,
        hasMore: catalogPage.hasMore,
        clearErrorMessage: true,
      );
    } on CatalogFailure catch (e) {
      state = state.copyWith(
        status: CatalogStatus.error,
        errorMessage: e.message,
      );
    } catch (_) {
      state = state.copyWith(
        status: CatalogStatus.error,
        errorMessage: 'Katalog gagal dimuat. Periksa koneksi dan coba lagi.',
      );
    }
  }

  /// Memperbarui kata kunci pencarian (FR-C04)
  Future<void> setSearchQuery(String query) async {
    if (state.filter.searchQuery == query) return;
    final newFilter = state.filter.copyWith(searchQuery: query);
    await _applyFilterInternal(newFilter);
  }

  /// Memilih kategori lewat pill horizontal atau modal
  Future<void> selectCategory(String? categoryId, [String? categoryName]) async {
    final cleanId = (categoryId == null || categoryId == 'semua') ? null : categoryId;
    final newFilter = state.filter.copyWith(
      categoryId: cleanId,
      clearCategoryId: cleanId == null,
      categoryName: categoryName,
      clearCategoryName: cleanId == null,
    );
    await _applyFilterInternal(newFilter);
  }

  /// Menghapus satu filter kriteria secara granular dari chip row (design.md §5.9)
  Future<void> removeCategoryFilter() async {
    final newFilter = state.filter.copyWith(
      clearCategoryId: true,
      clearCategoryName: true,
    );
    await _applyFilterInternal(newFilter);
  }

  Future<void> removeAuthorFilter() async {
    final newFilter = state.filter.copyWith(clearAuthor: true);
    await _applyFilterInternal(newFilter);
  }

  Future<void> removePriceFilter() async {
    final newFilter = state.filter.copyWith(
      clearMinPrice: true,
      clearMaxPrice: true,
    );
    await _applyFilterInternal(newFilter);
  }

  Future<void> removeRatingFilter() async {
    final newFilter = state.filter.copyWith(clearMinRating: true);
    await _applyFilterInternal(newFilter);
  }

  /// Menerapkan filter gabungan dari bottom sheet
  Future<void> applyFilter(CatalogFilter filter) async {
    await _applyFilterInternal(filter);
  }

  /// Mengubah urutan (design.md §8.4)
  Future<void> setSortOption(CatalogSortOption sort) async {
    if (state.filter.sort == sort) return;
    final newFilter = state.filter.copyWith(sort: sort);
    await _applyFilterInternal(newFilter);
  }

  /// Menambahkan e-book ke keranjang belanja
  void addToCart(CatalogEbook ebook) {
    final updated = List<CatalogEbook>.from(state.cartItems)..add(ebook);
    state = state.copyWith(
      cartCount: state.cartCount + 1,
      cartItems: updated,
    );
  }

  /// Menghapus e-book dari keranjang berdasarkan ID
  void removeFromCart(String ebookId) {
    final updated = List<CatalogEbook>.from(state.cartItems)
      ..removeWhere((item) => item.id == ebookId);
    state = state.copyWith(
      cartCount: updated.length,
      cartItems: updated,
    );
  }

  /// Mengosongkan keranjang belanja
  void clearCart() {
    state = state.copyWith(
      cartCount: 0,
      cartItems: const [],
    );
  }

  /// Mengganti tampilan Grid vs List (design.md §6)
  void setViewMode(CatalogViewMode mode) {
    state = state.copyWith(viewMode: mode);
  }

  void toggleViewMode() {
    state = state.copyWith(
      viewMode: state.viewMode == CatalogViewMode.grid
          ? CatalogViewMode.list
          : CatalogViewMode.grid,
    );
  }

  /// Reset kriteria filter (MEMPERTAHANKAN kata kunci search per ketentuan prompt §7D)
  Future<void> resetFiltersOnly() async {
    final newFilter = state.filter.resetFiltersOnly();
    await _applyFilterInternal(newFilter);
  }

  /// Reset total kriteria dan pencarian
  Future<void> resetAll() async {
    final newFilter = state.filter.resetAll();
    await _applyFilterInternal(newFilter);
  }

  /// Infinite scroll: memuat halaman berikutnya (design.md §8.4)
  Future<void> loadMore() async {
    if (state.isLoadingMore || !state.hasMore || state.status != CatalogStatus.loaded) {
      return;
    }

    state = state.copyWith(
      isLoadingMore: true,
      clearLoadMoreError: true,
    );

    try {
      final nextPage = state.page + 1;
      final catalogPage = await _repository.getEbooks(
        filter: state.filter,
        page: nextPage,
        limit: 6,
      );

      final combined = List<CatalogEbook>.from(state.ebooks)
        ..addAll(catalogPage.items);

      state = state.copyWith(
        ebooks: combined,
        page: catalogPage.page,
        totalCount: catalogPage.total,
        hasMore: catalogPage.hasMore,
        isLoadingMore: false,
        clearLoadMoreError: true,
      );
    } catch (_) {
      state = state.copyWith(
        isLoadingMore: false,
        loadMoreError: 'Gagal memuat halaman berikutnya.',
      );
    }
  }

  Future<void> _applyFilterInternal(CatalogFilter newFilter) async {
    state = state.copyWith(
      filter: newFilter,
      status: CatalogStatus.loading,
      page: 1,
      clearErrorMessage: true,
    );

    try {
      final catalogPage = await _repository.getEbooks(
        filter: newFilter,
        page: 1,
        limit: 6,
      );

      state = state.copyWith(
        status: CatalogStatus.loaded,
        ebooks: catalogPage.items,
        page: catalogPage.page,
        totalCount: catalogPage.total,
        hasMore: catalogPage.hasMore,
        clearErrorMessage: true,
      );
    } on CatalogFailure catch (e) {
      state = state.copyWith(
        status: CatalogStatus.error,
        errorMessage: e.message,
      );
    } catch (_) {
      state = state.copyWith(
        status: CatalogStatus.error,
        errorMessage: 'Gagal menyaring katalog. Silakan coba lagi.',
      );
    }
  }
}

final catalogProvider =
    StateNotifierProvider<CatalogNotifier, CatalogState>((ref) {
  final repo = ref.watch(catalogRepositoryProvider);
  return CatalogNotifier(
    repository: repo,
    isMock: !ApiConfig.useRemoteCatalog,
  );
});

final ebookDetailProvider =
    FutureProvider.family<CatalogEbook, String>((ref, ebookId) async {
  final repo = ref.watch(catalogRepositoryProvider);
  return await repo.getEbookById(ebookId);
});
