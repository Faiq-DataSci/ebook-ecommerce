import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/utils/rupiah_formatter.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../../auth/presentation/pages/login_screen.dart';
import '../../../home/presentation/pages/home_screen.dart';
import '../../../home/presentation/widgets/home_bottom_navigation.dart';
import '../../../home/presentation/widgets/home_header.dart';
import '../../domain/entities/catalog_category.dart';
import '../../domain/entities/catalog_ebook.dart';
import '../providers/catalog_provider.dart';
import '../widgets/active_filter_chips.dart';
import '../widgets/catalog_result_bar.dart';
import '../widgets/catalog_search_bar.dart';
import '../widgets/catalog_state_views.dart';
import '../widgets/catalog_toolbar.dart';
import '../widgets/category_pills_bar.dart';
import '../widgets/ebook_card.dart';
import '../widgets/price_filter_sheet.dart';
import 'ebook_detail_screen.dart';

/// Halaman Katalog & Filter E-Book Mobile (Google Stitch Neubrutalism + design.md §8.4).
class CatalogScreen extends ConsumerStatefulWidget {
  const CatalogScreen({super.key});

  @override
  ConsumerState<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends ConsumerState<CatalogScreen> {
  late final TextEditingController _searchController;
  late final ScrollController _scrollController;

  @override
  void initState() {
    super.initState();
    _searchController = TextEditingController();
    _scrollController = ScrollController();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      ref.read(catalogProvider.notifier).loadMore();
    }
  }

  void _showFilterSheet(BuildContext context, CatalogState state) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) {
        return PriceFilterSheet(
          initialFilter: state.filter,
          categories: state.categories,
          previewBookCount: state.totalCount,
          onApply: (newFilter) {
            ref.read(catalogProvider.notifier).applyFilter(newFilter);
          },
          onReset: () {
            ref.read(catalogProvider.notifier).resetFiltersOnly();
          },
        );
      },
    );
  }

  void _handleAddToCart(CatalogEbook book) {
    ref.read(catalogProvider.notifier).addToCart(book);
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
            color: AppColors.nbGreen,
            borderColor: AppColors.nbBlack,
            borderWidth: AppTheme.borderDefault,
            shadowOffset: 3,
          ),
          child: Row(
            children: <Widget>[
              Container(
                width: 26,
                height: 26,
                decoration: BoxDecoration(
                  color: AppColors.nbBlack,
                  border: Border.all(color: AppColors.nbBlack),
                ),
                alignment: Alignment.center,
                child: const Icon(
                  Icons.check,
                  color: AppColors.nbWhite,
                  size: 16,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    Text(
                      'BERHASIL DITAMBAHKAN',
                      style: AppTheme.labelSm(AppColors.nbBlack, fontSize: 10),
                    ),
                    Text(
                      book.title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: AppTheme.bodySm(AppColors.nbBlack, fontSize: 12),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showCartBottomSheet(BuildContext context, CatalogState state) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(ctx).size.height * 0.75,
          ),
          decoration: const BoxDecoration(
            color: AppColors.nbPaper,
            border: Border(
              top: BorderSide(
                color: AppColors.nbBlack,
                width: AppTheme.borderDefault,
              ),
              left: BorderSide(
                color: AppColors.nbBlack,
                width: AppTheme.borderDefault,
              ),
              right: BorderSide(
                color: AppColors.nbBlack,
                width: AppTheme.borderDefault,
              ),
            ),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              // Header Sheet
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: const BoxDecoration(
                  border: Border(
                    bottom: BorderSide(
                      color: AppColors.nbBlack,
                      width: AppTheme.borderDefault,
                    ),
                  ),
                ),
                child: Row(
                  children: <Widget>[
                    const Icon(
                      Icons.shopping_cart_outlined,
                      size: 22,
                      color: AppColors.nbBlack,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'KERANJANG BELANJA',
                        overflow: TextOverflow.ellipsis,
                        style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: AppTheme.brutalBox(
                        color: AppColors.nbYellow,
                        borderColor: AppColors.nbBlack,
                        borderWidth: AppTheme.borderThin,
                        shadowOffset: 1,
                      ),
                      child: Text(
                        '${state.cartCount} ITEM',
                        style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 11),
                      ),
                    ),
                    const SizedBox(width: 8),
                    InkWell(
                      key: const Key('close_cart_sheet_button'),
                      onTap: () => Navigator.of(ctx).pop(),
                      child: Container(
                        width: 32,
                        height: 32,
                        alignment: Alignment.center,
                        decoration: AppTheme.brutalBox(
                          color: AppColors.nbWhite,
                          borderColor: AppColors.nbBlack,
                          borderWidth: AppTheme.borderThin,
                          shadowOffset: 1,
                        ),
                        child: const Icon(
                          Icons.close,
                          size: 16,
                          color: AppColors.nbBlack,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Daftar Item Keranjang
              if (state.cartItems.isEmpty)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 24),
                  child: Column(
                    children: <Widget>[
                      const Icon(
                        Icons.remove_shopping_cart_outlined,
                        size: 48,
                        color: AppColors.nbDisabledText,
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Keranjang Belanja Kosong',
                        style: AppTheme.labelMd(AppColors.nbBlack),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Pilih e-book menarik dari katalog dan klik "+ Keranjang" untuk mulai berbelanja.',
                        textAlign: TextAlign.center,
                        style: AppTheme.bodySm(AppColors.nbTextMuted),
                      ),
                    ],
                  ),
                )
              else
                Flexible(
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    shrinkWrap: true,
                    itemCount: state.cartItems.length,
                    separatorBuilder: (context, index) => const SizedBox(height: 10),
                    itemBuilder: (context, index) {
                      final item = state.cartItems[index];
                      return Container(
                        padding: const EdgeInsets.all(10),
                        decoration: AppTheme.brutalBox(
                          color: AppColors.nbWhite,
                          borderColor: AppColors.nbBlack,
                          borderWidth: AppTheme.borderThin,
                          shadowOffset: 2,
                        ),
                        child: Row(
                          children: <Widget>[
                            Container(
                              width: 38,
                              height: 52,
                              color: AppColors.nbMuted,
                              alignment: Alignment.center,
                              child: Text(
                                item.title.isNotEmpty ? item.title[0] : 'B',
                                style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: <Widget>[
                                  Text(
                                    item.title,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: AppTheme.labelSm(AppColors.nbBlack, fontSize: 13),
                                  ),
                                  Text(
                                    item.author,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: AppTheme.bodySm(AppColors.nbTextMuted, fontSize: 11),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    item.formattedPrice,
                                    style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 12),
                                  ),
                                ],
                              ),
                            ),
                            InkWell(
                              key: Key('remove_cart_item_${item.id}_$index'),
                              onTap: () {
                                ref.read(catalogProvider.notifier).removeFromCart(item.id);
                              },
                              child: Container(
                                padding: const EdgeInsets.all(6),
                                decoration: BoxDecoration(
                                  color: AppColors.nbPink.withValues(alpha: 0.15),
                                  border: Border.all(color: AppColors.nbBlack),
                                ),
                                child: const Icon(
                                  Icons.delete_outline,
                                  size: 16,
                                  color: AppColors.nbPink,
                                ),
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),

              // Footer Sheet
              if (state.cartItems.isNotEmpty)
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: const BoxDecoration(
                    color: AppColors.nbWhite,
                    border: Border(
                      top: BorderSide(
                        color: AppColors.nbBlack,
                        width: AppTheme.borderDefault,
                      ),
                    ),
                  ),
                  child: Column(
                    children: <Widget>[
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: <Widget>[
                          Text(
                            'TOTAL ESTIMASI',
                            style: AppTheme.labelSm(AppColors.nbTextMuted),
                          ),
                          Text(
                            formatRupiah(state.cartItems.fold<int>(
                              0,
                              (sum, item) => sum + item.price,
                            )),
                            style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Semantics(
                        button: true,
                        label: 'Lanjutkan ke pembayaran pesanan',
                        child: InkWell(
                          key: const Key('checkout_cart_button'),
                          onTap: () {
                            Navigator.of(ctx).pop();
                            _showNeubrutalistSnackBar(
                              'Fitur pembayaran pesanan sedang dalam proses pengembangan.',
                            );
                          },
                          child: Container(
                            width: double.infinity,
                            height: 44,
                            alignment: Alignment.center,
                            decoration: AppTheme.brutalBox(
                              color: AppColors.nbYellow,
                              borderColor: AppColors.nbBlack,
                              borderWidth: AppTheme.borderDefault,
                              shadowOffset: 2,
                            ),
                            child: FittedBox(
                              fit: BoxFit.scaleDown,
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: <Widget>[
                                  const Icon(
                                    Icons.payment,
                                    size: 18,
                                    color: AppColors.nbBlack,
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    'LANJUTKAN KE PEMBAYARAN',
                                    style: AppTheme.labelMd(AppColors.nbBlack),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        );
      },
    );
  }

  void _navigateToDetail(String ebookId) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => EbookDetailScreen(ebookId: ebookId),
      ),
    );
  }

  void _showNeubrutalistSnackBar(String message) {
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
            color: AppColors.nbYellow,
            borderColor: AppColors.nbBlack,
            borderWidth: AppTheme.borderDefault,
            shadowOffset: 3,
          ),
          child: Row(
            children: <Widget>[
              const Icon(
                Icons.info_outline,
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

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(catalogProvider);
    final notifier = ref.read(catalogProvider.notifier);
    const palette = NbPalette(isDark: false);

    if (_searchController.text != state.filter.searchQuery) {
      _searchController.value = TextEditingValue(
        text: state.filter.searchQuery,
        selection:
            TextSelection.collapsed(offset: state.filter.searchQuery.length),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.nbPaper,
      body: SafeArea(
        bottom: false,
        child: Column(
          children: <Widget>[
            // 1. Header BUKUKITA (sama seperti Beranda)
            HomeHeader(
              palette: palette,
              isDarkMode: false,
              cartCount: state.cartCount,
              onToggleTheme: () {
                _showNeubrutalistSnackBar(
                  'Tema dikunci pada mode Terang Neubrutalism sesuai Stitch.',
                );
              },
              onCartTap: () => _showCartBottomSheet(context, state),
              onProfileTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                );
              },
            ),

            // 2. Konten Utama
            Expanded(
              child: SingleChildScrollView(
                controller: _scrollController,
                padding: const EdgeInsets.fromLTRB(
                  AppTheme.marginMobile,
                  12,
                  AppTheme.marginMobile,
                  24,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    // A. Sticky Zone B: Search Bar + Filter Trigger
                    CatalogSearchBar(
                      controller: _searchController,
                      onChanged: notifier.setSearchQuery,
                      onClear: () {
                        _searchController.clear();
                        notifier.setSearchQuery('');
                      },
                      onFilterTap: () => _showFilterSheet(context, state),
                      activeFilterCount: state.filter.activeFilterCount,
                    ),
                    const SizedBox(height: 10),

                    // B. Secondary Row: Urutkan + Grid/List Toggle
                    CatalogToolbar(
                      currentSort: state.filter.sort,
                      onSortChanged: notifier.setSortOption,
                      currentViewMode: state.viewMode,
                      onViewModeChanged: notifier.setViewMode,
                    ),
                    const SizedBox(height: 12),

                    // C. Active Filter Chips Row (design.md §5.9)
                    if (state.filter.hasActiveFilters) ...<Widget>[
                      ActiveFilterChips(
                        filter: state.filter,
                        onRemoveCategory: notifier.removeCategoryFilter,
                        onRemoveAuthor: notifier.removeAuthorFilter,
                        onRemovePrice: notifier.removePriceFilter,
                        onRemoveRating: notifier.removeRatingFilter,
                        onResetFilters: notifier.resetFiltersOnly,
                      ),
                      const SizedBox(height: 12),
                    ],

                    // D. Category Pills Horizontal Scroll
                    CategoryPillsBar(
                      categories: state.categories,
                      selectedCategoryId: state.filter.categoryId,
                      onSelectCategory: (CatalogCategory? cat) {
                        notifier.selectCategory(cat?.id, cat?.name);
                      },
                    ),
                    const SizedBox(height: 12),

                    // E. Results Count + DATA SIMULASI Bar
                    CatalogResultBar(
                      totalCount: state.totalCount,
                      isMock: state.isMock,
                    ),
                    const SizedBox(height: 14),

                    // F. State-Driven Catalog List / Grid
                    if (state.status == CatalogStatus.loading)
                      CatalogStateViews.buildLoadingSkeleton()
                    else if (state.status == CatalogStatus.error)
                      CatalogStateViews.buildError(
                        message: state.errorMessage ??
                            'Gagal memuat katalog e-book dari server.',
                        onRetry: notifier.loadInitial,
                      )
                    else if (state.status == CatalogStatus.empty)
                      CatalogStateViews.buildEmptyCatalog()
                    else if (state.isNoResult)
                      CatalogStateViews.buildNoResult(
                        onResetFilter: () {
                          _searchController.clear();
                          notifier.resetAll();
                        },
                      )
                    else ...<Widget>[
                      if (state.viewMode == CatalogViewMode.grid)
                        _buildTwoColumnGrid(state.ebooks)
                      else
                        _buildListColumn(state.ebooks),

                      // Footer Infinite Scroll
                      CatalogStateViews.buildInfiniteScrollFooter(
                        isLoadingMore: state.isLoadingMore,
                        hasMore: state.hasMore,
                        loadMoreError: state.loadMoreError,
                        onRetryLoadMore: notifier.loadMore,
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
        currentIndex: 1, // 1 = Katalog aktif
        palette: palette,
        onTap: (index) {
          if (index == 0) {
            // Beranda
            Navigator.of(context).pushReplacement(
              MaterialPageRoute(builder: (_) => const HomeScreen()),
            );
          } else if (index == 1) {
            // Sudah di Katalog, scroll ke atas
            _scrollController.animateTo(
              0,
              duration: const Duration(milliseconds: 300),
              curve: Curves.easeOut,
            );
          } else if (index == 3) {
            // Profil
            Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const LoginScreen()),
            );
          } else {
            _showNeubrutalistSnackBar(
              'Tab Pustaka masih dalam rencana pengembangan.',
            );
          }
        },
      ),
    );
  }

  Widget _buildTwoColumnGrid(List<CatalogEbook> books) {
    final rows = <Widget>[];
    for (var i = 0; i < books.length; i += 2) {
      if (i > 0) {
        rows.add(const SizedBox(height: 14));
      }
      final first = books[i];
      final second = (i + 1 < books.length) ? books[i + 1] : null;

      rows.add(
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Expanded(
              child: EbookCard(
                book: first,
                mode: CatalogViewMode.grid,
                onTap: () => _navigateToDetail(first.id),
                onAddToCartTap: () => _handleAddToCart(first),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: second != null
                  ? EbookCard(
                      book: second,
                      mode: CatalogViewMode.grid,
                      onTap: () => _navigateToDetail(second.id),
                      onAddToCartTap: () => _handleAddToCart(second),
                    )
                  : const SizedBox.shrink(),
            ),
          ],
        ),
      );
    }

    return Column(children: rows);
  }

  Widget _buildListColumn(List<CatalogEbook> books) {
    return Column(
      children: [
        for (final book in books) ...[
          EbookCard(
            book: book,
            mode: CatalogViewMode.list,
            onTap: () => _navigateToDetail(book.id),
            onAddToCartTap: () => _handleAddToCart(book),
          ),
          const SizedBox(height: 12),
        ],
      ],
    );
  }
}
