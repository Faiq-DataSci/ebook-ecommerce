import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/constants/app_assets.dart';
import '../../data/mock/home_mock_data.dart';
import '../../models/ebook.dart';
import '../../providers/home_provider.dart';
import '../../theme/app_colors.dart';
import '../../theme/app_theme.dart';
import '../../widgets/home/book_card.dart';
import '../../widgets/home/category_section.dart';
import '../../widgets/home/featured_books_section.dart';
import '../../widgets/home/flash_sale_section.dart';
import '../../widgets/home/home_banner.dart';
import '../../widgets/home/home_bottom_navigation.dart';
import '../../widgets/home/home_header.dart';
import '../../widgets/home/home_search_bar.dart';
import '../../widgets/home/section_header.dart';

/// Main Homepage Screen implementing Google Stitch `Beranda Mobile (Neubrutalism)`.
class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  late final TextEditingController _searchController;

  @override
  void initState() {
    super.initState();
    _searchController = TextEditingController();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _showNeubrutalistSnackBar(
    NbPalette palette,
    String message,
  ) {
    final messenger = ScaffoldMessenger.maybeOf(context);
    if (messenger == null) return;
    messenger.hideCurrentSnackBar();
    messenger.showSnackBar(
      SnackBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 2),
        content: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          decoration: AppTheme.brutalBox(
            color: palette.yellow,
            borderColor: palette.ink,
            borderWidth: AppTheme.borderDefault,
            shadowOffset: 3,
          ),
          child: Row(
            children: <Widget>[
              const Icon(
                Icons.check_box_outlined,
                size: 18,
                color: AppColors.nbBlack,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  message,
                  style: AppTheme.labelSm(AppColors.nbBlack, fontSize: 12),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showSawDecisionModal(NbPalette palette, Ebook book) {
    final saw = book.sawBreakdown;
    final matchPercentage = saw != null
        ? (saw.totalPreference * 100).round()
        : 94;
    showDialog<void>(
      context: context,
      builder: (dialogContext) {
        return Dialog(
          backgroundColor: Colors.transparent,
          insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: AppTheme.brutalBox(
              color: palette.surface,
              borderColor: palette.ink,
              borderWidth: AppTheme.borderMedium,
              shadowOffset: 5,
            ),
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      Flexible(
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 3,
                          ),
                          decoration: AppTheme.brutalBox(
                            color: palette.lavender,
                            borderColor: palette.ink,
                            borderWidth: AppTheme.borderDefault,
                            shadowOffset: 2,
                          ),
                          child: Text(
                            'REKOMENDASI TERKURASI',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: AppTheme.dataMono(
                              AppColors.nbBlack,
                              fontSize: 11,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      InkWell(
                        key: const Key('close_saw_modal_button'),
                        onTap: () => Navigator.of(dialogContext).pop(),
                        child: Container(
                          width: 36,
                          height: 36,
                          alignment: Alignment.center,
                          decoration: AppTheme.brutalBox(
                            color: palette.secondarySurface,
                            borderColor: palette.ink,
                            borderWidth: AppTheme.borderDefault,
                            shadowOffset: 2,
                          ),
                          child: Icon(
                            Icons.close,
                            size: 18,
                            color: palette.textPrimary,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    book.title,
                    style: AppTheme.headlineSmMobile(palette.textPrimary),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'E-book ini direkomendasikan khusus untukmu berdasarkan keseimbangan harga, rating pembaca, popularitas, dan kesesuaian topik.',
                    style: AppTheme.bodySm(palette.textMuted, fontSize: 12),
                  ),
                  if (saw != null) ...<Widget>[
                    const SizedBox(height: 12),
                    _buildCriterionRow(
                      palette: palette,
                      code: 'HARGA',
                      name: 'Harga Bersahabat (${book.formattedPrice})',
                      score: '${(saw.c1Score * 100).round()}%',
                      color: palette.yellow,
                    ),
                    const SizedBox(height: 6),
                    _buildCriterionRow(
                      palette: palette,
                      code: 'RATING',
                      name: 'Rating Pembaca (${book.rating.toStringAsFixed(1)}/5.0)',
                      score: '${(saw.c2Score * 100).round()}%',
                      color: palette.green,
                    ),
                    const SizedBox(height: 6),
                    _buildCriterionRow(
                      palette: palette,
                      code: 'POPULER',
                      name: 'Ulasan Positif (${book.reviewCount} ulasan)',
                      score: '${(saw.c3Score * 100).round()}%',
                      color: palette.blue,
                    ),
                    const SizedBox(height: 6),
                    _buildCriterionRow(
                      palette: palette,
                      code: 'TOPIK',
                      name: 'Kesesuaian Bidang (${book.category})',
                      score: '${(saw.c4Score * 100).round()}%',
                      color: palette.lavender,
                    ),
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: AppTheme.brutalBox(
                        color: palette.yellow,
                        borderColor: palette.ink,
                        borderWidth: AppTheme.borderDefault,
                        shadowOffset: 2,
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: <Widget>[
                          Flexible(
                            child: Text(
                              'TINGKAT KECOCOKAN',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: AppTheme.labelSm(
                                AppColors.nbBlack,
                                fontSize: 12,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            '$matchPercentage% COCOK',
                            style: AppTheme.dataMono(
                              AppColors.nbBlack,
                              fontSize: 15,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: palette.orange,
                      border: Border.all(
                        color: palette.ink,
                        width: AppTheme.borderThin,
                      ),
                    ),
                    child: Text(
                      '${HomeMockData.simulationLabel}: Endpoint /api/recommendations belum terhubung.',
                      style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 10),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildCriterionRow({
    required NbPalette palette,
    required String code,
    required String name,
    required String score,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: palette.secondarySurface,
        border: Border.all(
          color: palette.ink,
          width: AppTheme.borderThin,
        ),
      ),
      child: Row(
        children: <Widget>[
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
            decoration: BoxDecoration(
              color: color,
              border: Border.all(
                color: palette.ink,
                width: AppTheme.borderThin,
              ),
            ),
            child: Text(
              code,
              style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 10),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              name,
              style: AppTheme.bodySm(palette.textPrimary, fontSize: 12),
            ),
          ),
          Text(
            score,
            style: AppTheme.dataMono(palette.textPrimary, fontSize: 12),
          ),
        ],
      ),
    );
  }

  void _showBookDetailModal(NbPalette palette, Ebook book) {
    showDialog<void>(
      context: context,
      builder: (dialogContext) {
        return Dialog(
          backgroundColor: Colors.transparent,
          insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: AppTheme.brutalBox(
              color: palette.surface,
              borderColor: palette.ink,
              borderWidth: AppTheme.borderMedium,
              shadowOffset: 5,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Container(
                      width: 72,
                      height: 108,
                      decoration: AppTheme.brutalBox(
                        color: palette.coverPlaceholder,
                        borderColor: palette.ink,
                        borderWidth: AppTheme.borderDefault,
                        shadowOffset: 2,
                      ),
                      child: StitchBookCover(
                        assetKey: book.coverAssetKey,
                        title: book.title,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Text(
                            book.title,
                            style: AppTheme.headlineSmMobile(
                              palette.textPrimary,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Penulis: ${book.author}',
                            style: AppTheme.bodySm(
                              palette.textMuted,
                              fontSize: 13,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'ISBN: ${book.isbn}',
                            style: AppTheme.dataMono(
                              palette.textMuted,
                              fontSize: 11,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 3,
                            ),
                            decoration: AppTheme.brutalBox(
                              color: palette.yellow,
                              borderColor: palette.ink,
                              borderWidth: AppTheme.borderDefault,
                              shadowOffset: 2,
                            ),
                            child: Text(
                              book.formattedPrice,
                              style: AppTheme.dataMono(
                                AppColors.nbBlack,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                Row(
                  children: <Widget>[
                    Expanded(
                      child: InkWell(
                        onTap: () => Navigator.of(dialogContext).pop(),
                        child: Container(
                          height: 44,
                          alignment: Alignment.center,
                          decoration: AppTheme.brutalBox(
                            color: palette.secondarySurface,
                            borderColor: palette.ink,
                            borderWidth: AppTheme.borderDefault,
                            shadowOffset: 2,
                          ),
                          child: Text(
                            'TUTUP',
                            style: AppTheme.labelSm(
                              palette.textPrimary,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: InkWell(
                        onTap: () {
                          ref.read(homeProvider.notifier).addToCart();
                          Navigator.of(dialogContext).pop();
                          _showNeubrutalistSnackBar(
                            palette,
                            '${book.title} ditambahkan ke keranjang.',
                          );
                        },
                        child: Container(
                          height: 44,
                          alignment: Alignment.center,
                          decoration: AppTheme.brutalBox(
                            color: palette.yellow,
                            borderColor: palette.ink,
                            borderWidth: AppTheme.borderDefault,
                            shadowOffset: 2,
                          ),
                          child: Text(
                            '+ KERANJANG',
                            style: AppTheme.labelSm(
                              AppColors.nbBlack,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showFilterAndStateSheet(NbPalette palette, HomeState state) {
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (sheetContext) {
        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: palette.surface,
            border: Border(
              top: BorderSide(
                color: palette.ink,
                width: AppTheme.borderMedium,
              ),
            ),
          ),
          child: SafeArea(
            top: false,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  'FILTER & VERIFIKASI STATE UI',
                  style: AppTheme.headlineSmMobile(palette.textPrimary),
                ),
                const SizedBox(height: 4),
                Text(
                  'Uji keempat state wajib (Loaded, Loading, Empty, Error) sesuai aturan mobile/AGENTS.md:',
                  style: AppTheme.bodySm(palette.textMuted, fontSize: 12),
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: <Widget>[
                    _buildStateOptionButton(
                      sheetContext: sheetContext,
                      palette: palette,
                      keyName: 'state_btn_loaded',
                      label: 'STATE: LOADED',
                      isActive: state.status == HomeLoadStatus.loaded,
                      onTap: () => ref
                          .read(homeProvider.notifier)
                          .setLoadStatus(HomeLoadStatus.loaded),
                    ),
                    _buildStateOptionButton(
                      sheetContext: sheetContext,
                      palette: palette,
                      keyName: 'state_btn_loading',
                      label: 'STATE: LOADING',
                      isActive: state.status == HomeLoadStatus.loading,
                      onTap: () => ref
                          .read(homeProvider.notifier)
                          .setLoadStatus(HomeLoadStatus.loading),
                    ),
                    _buildStateOptionButton(
                      sheetContext: sheetContext,
                      palette: palette,
                      keyName: 'state_btn_empty',
                      label: 'STATE: EMPTY',
                      isActive: state.status == HomeLoadStatus.empty,
                      onTap: () => ref
                          .read(homeProvider.notifier)
                          .setLoadStatus(HomeLoadStatus.empty),
                    ),
                    _buildStateOptionButton(
                      sheetContext: sheetContext,
                      palette: palette,
                      keyName: 'state_btn_error',
                      label: 'STATE: ERROR',
                      isActive: state.status == HomeLoadStatus.error,
                      onTap: () => ref
                          .read(homeProvider.notifier)
                          .setLoadStatus(HomeLoadStatus.error),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildStateOptionButton({
    required BuildContext sheetContext,
    required NbPalette palette,
    required String keyName,
    required String label,
    required bool isActive,
    required VoidCallback onTap,
  }) {
    return InkWell(
      key: Key(keyName),
      onTap: () {
        onTap();
        Navigator.of(sheetContext).pop();
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: AppTheme.brutalBox(
          color: isActive ? palette.yellow : palette.secondarySurface,
          borderColor: palette.ink,
          borderWidth: AppTheme.borderDefault,
          shadowOffset: 2,
        ),
        child: Text(
          label,
          style: AppTheme.dataMono(
            isActive ? AppColors.nbBlack : palette.textPrimary,
            fontSize: 11,
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(homeProvider);
    final notifier = ref.read(homeProvider.notifier);
    final palette = NbPalette(isDark: state.isDarkMode);

    if (_searchController.text != state.searchQuery) {
      _searchController.value = TextEditingValue(
        text: state.searchQuery,
        selection: TextSelection.collapsed(offset: state.searchQuery.length),
      );
    }

    return Scaffold(
      backgroundColor: palette.background,
      body: SafeArea(
        bottom: false,
        child: Column(
          children: <Widget>[
            // Top Fixed Header (`BUKUKITA` + Theme + Cart + Avatar)
            HomeHeader(
              palette: palette,
              isDarkMode: false,
              cartCount: state.cartCount,
              onToggleTheme: () {
                notifier.toggleThemeMode();
                _showNeubrutalistSnackBar(
                  palette,
                  'Tema dikunci pada mode Terang Neubrutalism sesuai referensi Google Stitch.',
                );
              },
              onCartTap: () => _showNeubrutalistSnackBar(
                palette,
                'Keranjang Belanja: ${state.cartCount} item (${HomeMockData.simulationLabel}).',
              ),
              onProfileTap: () => _showNeubrutalistSnackBar(
                palette,
                'Masuk sebagai ${HomeMockData.greetingName} (${HomeMockData.simulationLabel}).',
              ),
            ),
            // Main Vertical Scrollable Content
            Expanded(
              child: SingleChildScrollView(
                key: const Key('home_scroll_view'),
                padding: const EdgeInsets.fromLTRB(
                  AppTheme.marginMobile,
                  16,
                  AppTheme.marginMobile,
                  24,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    // Section 1: Greeting & SAW Status Badge
                    _buildGreetingSection(palette),
                    const SizedBox(height: 16),
                    // Section 2: Search Bar & Filter Action
                    HomeSearchBar(
                      palette: palette,
                      controller: _searchController,
                      onChanged: notifier.updateSearchQuery,
                      onClear: () {
                        _searchController.clear();
                        notifier.resetFilters();
                      },
                      onFilterTap: () => _showFilterAndStateSheet(
                        palette,
                        state,
                      ),
                    ),
                    const SizedBox(height: 20),
                    // Conditional State Rendering (loading / error / empty / loaded)
                    if (state.status == HomeLoadStatus.loading)
                      _buildLoadingState(palette)
                    else if (state.status == HomeLoadStatus.error)
                      _buildErrorState(
                        palette: palette,
                        message: state.errorMessage ??
                            'Gagal memuat katalog dari server.',
                        onRetry: notifier.retryLoad,
                      )
                    else if (state.status == HomeLoadStatus.empty ||
                        (!state.isFeaturedVisible &&
                            state.filteredLatestReleases.isEmpty))
                      _buildEmptyState(
                        palette: palette,
                        onReset: () {
                          _searchController.clear();
                          notifier.retryLoad();
                        },
                      )
                    else ...<Widget>[
                      // Section 3: Hero Banner (Zona A)
                      HomeBanner(
                        palette: palette,
                        onCalculateSawTap: () => _showSawDecisionModal(
                          palette,
                          state.featuredSawBook,
                        ),
                      ),
                      const SizedBox(height: 24),
                      // Section 4: Kategori Pilihan
                      CategorySection(
                        categories: state.categories,
                        selectedCategoryId: state.selectedCategoryId,
                        palette: palette,
                        onSelectCategory: notifier.selectCategory,
                      ),
                      const SizedBox(height: 24),
                      // Section 5: Top Rekomendasi SAW (Zona B)
                      if (state.isFeaturedVisible) ...<Widget>[
                        FeaturedBooksSection(
                          book: state.featuredSawBook,
                          palette: palette,
                          onDetailTap: () => _showSawDecisionModal(
                            palette,
                            state.featuredSawBook,
                          ),
                          onAddToCartTap: () {
                            notifier.addToCart();
                            _showNeubrutalistSnackBar(
                              palette,
                              '${state.featuredSawBook.title} ditambahkan ke keranjang.',
                            );
                          },
                        ),
                        const SizedBox(height: 24),
                      ],
                      // Section 6: Rilisan Terbaru (2-Column Catalog Grid)
                      _buildLatestReleasesSection(
                        palette: palette,
                        books: state.filteredLatestReleases,
                        onResetFilters: notifier.resetFilters,
                        onAddBookToCart: (book) {
                          notifier.addToCart();
                          _showNeubrutalistSnackBar(
                            palette,
                            '${book.title} ditambahkan ke keranjang.',
                          );
                        },
                      ),
                      const SizedBox(height: 24),
                      // Section 7: Flash Sale & Bundel Hemat + DATA SIMULASI Badge
                      FlashSaleSection(
                        bundles: state.bundles,
                        palette: palette,
                        onClaimBundle: (bundle) {
                          notifier.addToCart();
                          _showNeubrutalistSnackBar(
                            palette,
                            '${bundle.title} berhasil diklaim ke keranjang.',
                          );
                        },
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: HomeBottomNavigation(
        currentIndex: state.selectedNavIndex,
        palette: palette,
        onTap: (index) {
          notifier.selectNavIndex(index);
          if (index != 0) {
            const labels = <String>['Beranda', 'Katalog', 'Pustaka', 'Profil'];
            _showNeubrutalistSnackBar(
              palette,
              'Tab ${labels[index]} masih dalam rencana pengembangan (${HomeMockData.simulationLabel}).',
            );
          }
        },
      ),
    );
  }

  Widget _buildGreetingSection(NbPalette palette) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Row(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  Flexible(
                    child: Text(
                      'Halo, ${HomeMockData.greetingName}',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: AppTheme.headlineMdMobile(palette.textPrimary),
                    ),
                  ),
                  const SizedBox(width: 6),
                  const Text(
                    '\u{1F44B}',
                    style: TextStyle(fontSize: 20),
                  ),
                ],
              ),
              const SizedBox(height: 2),
              Text(
                HomeMockData.greetingSubtitle,
                style: AppTheme.bodySm(palette.textMuted, fontSize: 14),
              ),
            ],
          ),
        ),
        const SizedBox(width: 8),
        // SAW ONLINE Status Badge
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: AppTheme.brutalBox(
            color: palette.surface,
            borderColor: palette.ink,
            borderWidth: AppTheme.borderDefault,
            shadowOffset: 2,
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(
                  color: palette.green,
                  border: Border.all(
                    color: palette.ink,
                    width: AppTheme.borderThin,
                  ),
                ),
              ),
              const SizedBox(width: 6),
              Text(
                HomeMockData.sawStatusText,
                style: AppTheme.dataMono(palette.textPrimary, fontSize: 11),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildLatestReleasesSection({
    required NbPalette palette,
    required List<Ebook> books,
    required VoidCallback onResetFilters,
    required ValueChanged<Ebook> onAddBookToCart,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        SectionHeader(
          title: 'Rilisan Terbaru',
          palette: palette,
          actionLabel: 'Lihat Semua',
          onActionTap: onResetFilters,
        ),
        const SizedBox(height: 12),
        if (books.isEmpty)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: AppTheme.brutalBox(
              color: palette.surface,
              borderColor: palette.ink,
              borderWidth: AppTheme.borderDefault,
              shadowOffset: 3,
            ),
            child: Text(
              'Belum ada rilisan terbaru pada kategori ini.',
              style: AppTheme.bodySm(palette.textMuted, fontSize: 13),
            ),
          )
        else
          _buildTwoColumnGrid(
            palette: palette,
            books: books,
            onAddBookToCart: onAddBookToCart,
          ),
      ],
    );
  }

  Widget _buildTwoColumnGrid({
    required NbPalette palette,
    required List<Ebook> books,
    required ValueChanged<Ebook> onAddBookToCart,
  }) {
    final rows = <Widget>[];
    for (int i = 0; i < books.length; i += 2) {
      if (i > 0) {
        rows.add(const SizedBox(height: 12));
      }
      final first = books[i];
      final second = (i + 1 < books.length) ? books[i + 1] : null;
      rows.add(
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Expanded(
              child: BookCard(
                book: first,
                palette: palette,
                onCardTap: () => _showBookDetailModal(palette, first),
                onAddToCartTap: () => onAddBookToCart(first),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: second != null
                  ? BookCard(
                      book: second,
                      palette: palette,
                      onCardTap: () => _showBookDetailModal(palette, second),
                      onAddToCartTap: () => onAddBookToCart(second),
                    )
                  : const SizedBox.shrink(),
            ),
          ],
        ),
      );
    }
    return Column(children: rows);
  }

  Widget _buildLoadingState(NbPalette palette) {
    return Container(
      key: const Key('home_loading_state'),
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: AppTheme.brutalBox(
        color: palette.surface,
        borderColor: palette.ink,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 4,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: AppTheme.brutalBox(
              color: palette.yellow,
              borderColor: palette.ink,
              borderWidth: AppTheme.borderThin,
              shadowOffset: 1,
            ),
            child: Text(
              'MEMUAT DATA...',
              style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 11),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Menyinkronkan katalog & rekomendasi e-book...',
            style: AppTheme.labelMd(palette.textPrimary),
          ),
          const SizedBox(height: 12),
          LinearProgressIndicator(
            backgroundColor: palette.mutedSurface,
            color: palette.ink,
            minHeight: 8,
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState({
    required NbPalette palette,
    required VoidCallback onReset,
  }) {
    return Container(
      key: const Key('home_empty_state'),
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: AppTheme.brutalBox(
        color: palette.surface,
        borderColor: palette.ink,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 4,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: AppTheme.brutalBox(
              color: palette.lavender,
              borderColor: palette.ink,
              borderWidth: AppTheme.borderThin,
              shadowOffset: 1,
            ),
            child: Text(
              'HASIL KOSONG',
              style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 11),
            ),
          ),
          const SizedBox(height: 10),
          Text(
            'E-Book Tidak Ditemukan',
            style: AppTheme.headlineSmMobile(palette.textPrimary),
          ),
          const SizedBox(height: 4),
          Text(
            'Tidak ada judul, penulis, atau ISBN yang cocok dengan filter saat ini.',
            style: AppTheme.bodySm(palette.textMuted, fontSize: 13),
          ),
          const SizedBox(height: 14),
          InkWell(
            key: const Key('empty_reset_button'),
            onTap: onReset,
            child: Container(
              height: 44,
              padding: const EdgeInsets.symmetric(horizontal: 14),
              alignment: Alignment.center,
              decoration: AppTheme.brutalBox(
                color: palette.yellow,
                borderColor: palette.ink,
                borderWidth: AppTheme.borderDefault,
                shadowOffset: 2,
              ),
              child: Text(
                'RESET PENCARIAN & FILTER',
                style: AppTheme.labelSm(AppColors.nbBlack, fontSize: 12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState({
    required NbPalette palette,
    required String message,
    required VoidCallback onRetry,
  }) {
    return Container(
      key: const Key('home_error_state'),
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: AppTheme.brutalBox(
        color: palette.surface,
        borderColor: palette.ink,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 4,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: AppTheme.brutalBox(
              color: palette.pink,
              borderColor: palette.ink,
              borderWidth: AppTheme.borderThin,
              shadowOffset: 1,
            ),
            child: Text(
              'GANGGUAN JARINGAN',
              style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 11),
            ),
          ),
          const SizedBox(height: 10),
          Text(
            'Gagal Memuat Beranda',
            style: AppTheme.headlineSmMobile(palette.textPrimary),
          ),
          const SizedBox(height: 4),
          Text(
            message,
            style: AppTheme.bodySm(palette.textMuted, fontSize: 13),
          ),
          const SizedBox(height: 14),
          InkWell(
            key: const Key('error_retry_button'),
            onTap: onRetry,
            child: Container(
              height: 44,
              padding: const EdgeInsets.symmetric(horizontal: 14),
              alignment: Alignment.center,
              decoration: AppTheme.brutalBox(
                color: palette.yellow,
                borderColor: palette.ink,
                borderWidth: AppTheme.borderDefault,
                shadowOffset: 2,
              ),
              child: Text(
                'COBA LAGI',
                style: AppTheme.labelSm(AppColors.nbBlack, fontSize: 12),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
