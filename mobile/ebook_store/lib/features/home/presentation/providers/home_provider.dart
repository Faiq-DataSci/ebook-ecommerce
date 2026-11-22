import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/mock/home_mock_data.dart';
import '../../domain/models/category.dart';
import '../../domain/models/ebook.dart';

/// UI loading/data states required by `mobile/AGENTS.md` and `antislop` R-27.
enum HomeLoadStatus { loaded, loading, empty, error }

/// Immutable state for `Beranda Mobile (Neubrutalism)`.
class HomeState {
  final HomeLoadStatus status;
  final bool isDarkMode;
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
    this.isDarkMode = false,
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
          _matchesCategory(book.category, selectedCategoryId);
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
        _matchesCategory(featuredSawBook.category, selectedCategoryId);
    final matchesQuery =
        query.isEmpty ||
        featuredSawBook.title.toLowerCase().contains(query) ||
        featuredSawBook.author.toLowerCase().contains(query) ||
        featuredSawBook.isbn.toLowerCase().contains(query) ||
        featuredSawBook.badgeLabel.toLowerCase().contains(query);
    return matchesCategory && matchesQuery;
  }

  static bool _matchesCategory(String bookCategory, String selectedId) {
    final selected = HomeMockData.categories
        .where((c) => c.id == selectedId)
        .firstOrNull;
    if (selected == null) return true;
    return bookCategory.toLowerCase() == selected.label.toLowerCase();
  }

  HomeState copyWith({
    HomeLoadStatus? status,
    bool? isDarkMode,
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
      isDarkMode: isDarkMode ?? this.isDarkMode,
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

class HomeNotifier extends StateNotifier<HomeState> {
  HomeNotifier() : super(const HomeState());

  void toggleThemeMode() {
    state = state.copyWith(isDarkMode: !state.isDarkMode);
  }

  void updateSearchQuery(String query) {
    state = state.copyWith(searchQuery: query, status: HomeLoadStatus.loaded);
  }

  void selectCategory(String categoryId) {
    state = state.copyWith(
      selectedCategoryId: categoryId,
      status: HomeLoadStatus.loaded,
    );
  }

  void resetFilters() {
    state = state.copyWith(
      searchQuery: '',
      selectedCategoryId: 'semua',
      status: HomeLoadStatus.loaded,
    );
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
  }
}

final homeProvider = StateNotifierProvider<HomeNotifier, HomeState>((ref) {
  return HomeNotifier();
});
