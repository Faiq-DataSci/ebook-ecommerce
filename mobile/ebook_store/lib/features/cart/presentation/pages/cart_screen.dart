import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../../catalog/presentation/pages/catalog_screen.dart';
import '../../../catalog/presentation/pages/ebook_detail_screen.dart';
import '../../../checkout/presentation/pages/checkout_screen.dart';
import '../../../home/presentation/providers/home_provider.dart';
import '../../data/datasources/cart_mock_datasource.dart';
import '../../domain/entities/cart_item.dart';
import '../providers/cart_provider.dart';
import '../widgets/cart_bottom_checkout_bar.dart';
import '../widgets/cart_bulk_selection_bar.dart';
import '../widgets/cart_digital_notice.dart';
import '../widgets/cart_header.dart';
import '../widgets/cart_item_card.dart';
import '../widgets/cart_promo_section.dart';
import '../widgets/cart_state_views.dart';
import '../widgets/cart_summary_section.dart';

class CartScreen extends ConsumerStatefulWidget {
  const CartScreen({super.key});

  @override
  ConsumerState<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends ConsumerState<CartScreen> {
  late final TextEditingController _promoController;

  @override
  void initState() {
    super.initState();
    final initialPromo = ref.read(cartProvider).promoInput;
    _promoController = TextEditingController(text: initialPromo);
  }

  @override
  void dispose() {
    _promoController.dispose();
    super.dispose();
  }

  void _syncHomeCartCount(int count) {
    final homeState = ref.read(homeProvider);
    if (homeState.cartCount != count) {
      ref.read(homeProvider.notifier).setCartCount(count);
    }
  }

  void _showNeubrutalistSnackBar(
    String message, {
    Color backgroundColor = AppColors.nbYellow,
    IconData icon = Icons.check_box_outlined,
  }) {
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
            color: backgroundColor,
            borderColor: AppColors.nbBlack,
            borderWidth: AppTheme.borderDefault,
            shadowOffset: 3,
          ),
          child: Row(
            children: <Widget>[
              Icon(icon, size: 18, color: AppColors.nbBlack),
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

  void _openBookDetail(String ebookId) {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => EbookDetailScreen(ebookId: ebookId)),
    );
  }

  void _showClearCartConfirmationDialog(CartState state) {
    if (state.items.isEmpty) {
      _showNeubrutalistSnackBar(
        'Keranjang belanja sudah kosong.',
        backgroundColor: AppColors.nbOrange,
        icon: Icons.info_outline,
      );
      return;
    }

    showDialog<void>(
      context: context,
      builder: (dialogContext) {
        return Dialog(
          backgroundColor: Colors.transparent,
          insetPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 24,
          ),
          child: Container(
            key: const Key('cart_clear_confirm_dialog'),
            padding: const EdgeInsets.all(16),
            decoration: AppTheme.brutalBox(
              color: AppColors.nbWhite,
              borderColor: AppColors.nbBlack,
              borderWidth: AppTheme.borderMedium,
              shadowOffset: 5,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 3,
                  ),
                  decoration: AppTheme.brutalBox(
                    color: AppColors.nbPink,
                    borderColor: AppColors.nbBlack,
                    borderWidth: AppTheme.borderDefault,
                    shadowOffset: 2,
                  ),
                  child: Text(
                    'KONFIRMASI HAPUS KERANJANG',
                    style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 11),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'Kosongkan seluruh e-book dari keranjang?',
                  style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                ),
                const SizedBox(height: 6),
                Text(
                  'Semua ${state.totalItemsCount} e-book di keranjang akan dihapus. Kamu tetap bisa menambahkannya kembali dari katalog.',
                  style: AppTheme.bodySm(AppColors.nbTextMuted, fontSize: 13),
                ),
                const SizedBox(height: 16),
                Row(
                  children: <Widget>[
                    Expanded(
                      child: Semantics(
                        button: true,
                        label: 'Batal kosongkan keranjang',
                        child: InkWell(
                          key: const Key('cart_clear_cancel_button'),
                          onTap: () => Navigator.of(dialogContext).pop(),
                          child: Container(
                            height: 44,
                            alignment: Alignment.center,
                            decoration: AppTheme.brutalBox(
                              color: AppColors.nbWhite,
                              borderColor: AppColors.nbBlack,
                              borderWidth: AppTheme.borderDefault,
                              shadowOffset: 2,
                            ),
                            child: Text(
                              'BATAL',
                              style: AppTheme.labelMd(AppColors.nbBlack),
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Semantics(
                        button: true,
                        label: 'Kosongkan Keranjang',
                        child: InkWell(
                          key: const Key('cart_clear_confirm_button'),
                          onTap: () {
                            Navigator.of(dialogContext).pop();
                            ref.read(cartProvider.notifier).clearCart();
                            _syncHomeCartCount(0);
                            _showNeubrutalistSnackBar(
                              'Seluruh item keranjang belanja telah dikosongkan.',
                              backgroundColor: AppColors.nbPink,
                              icon: Icons.delete_outline,
                            );
                          },
                          child: Container(
                            height: 44,
                            alignment: Alignment.center,
                            decoration: AppTheme.brutalBox(
                              color: AppColors.nbPink,
                              borderColor: AppColors.nbBlack,
                              borderWidth: AppTheme.borderDefault,
                              shadowOffset: 2,
                            ),
                            child: Text(
                              'HAPUS SEMUA',
                              style: AppTheme.labelMd(AppColors.nbBlack),
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

  void _showCloudFeeInfoDialog() {
    showDialog<void>(
      context: context,
      builder: (dialogContext) {
        return Dialog(
          backgroundColor: Colors.transparent,
          insetPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 24,
          ),
          child: Container(
            key: const Key('cart_cloud_fee_dialog'),
            padding: const EdgeInsets.all(16),
            decoration: AppTheme.brutalBox(
              color: AppColors.nbWhite,
              borderColor: AppColors.nbBlack,
              borderWidth: AppTheme.borderMedium,
              shadowOffset: 5,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 3,
                  ),
                  decoration: AppTheme.brutalBox(
                    color: AppColors.nbBlue,
                    borderColor: AppColors.nbBlack,
                    borderWidth: AppTheme.borderDefault,
                    shadowOffset: 2,
                  ),
                  child: Text(
                    'BIAYA SINKRONISASI CLOUD',
                    style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 11),
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  'Lisensi Digital & Penyimpanan Privat',
                  style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                ),
                const SizedBox(height: 6),
                Text(
                  'Biaya tetap Rp 1.000 per transaksi mencakup aktivasi lisensi baca personal, penyediaan tautan baca terproteksi (signed URL), serta sinkronisasi marka buku lintas perangkat.',
                  style: AppTheme.bodySm(AppColors.nbTextMuted, fontSize: 13),
                ),
                const SizedBox(height: 14),
                Semantics(
                  button: true,
                  label: 'Tutup penjelasan biaya cloud',
                  child: InkWell(
                    key: const Key('cart_close_cloud_fee_dialog_button'),
                    onTap: () => Navigator.of(dialogContext).pop(),
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
                      child: Text(
                        'MENGERTI',
                        style: AppTheme.labelMd(AppColors.nbBlack),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showCheckoutSimulationModal(CartState state) {
    if (state.selectedCount == 0) {
      _showNeubrutalistSnackBar(
        'Pilih minimal 1 e-book terlebih dahulu sebelum checkout.',
        backgroundColor: AppColors.nbOrange,
        icon: Icons.warning_amber_outlined,
      );
      return;
    }

    showDialog<void>(
      context: context,
      builder: (dialogContext) {
        return Dialog(
          backgroundColor: Colors.transparent,
          insetPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 24,
          ),
          child: Container(
            key: const Key('cart_checkout_modal'),
            padding: const EdgeInsets.all(16),
            decoration: AppTheme.brutalBox(
              color: AppColors.nbWhite,
              borderColor: AppColors.nbBlack,
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
                            color: AppColors.nbOrange,
                            borderColor: AppColors.nbBlack,
                            borderWidth: AppTheme.borderDefault,
                            shadowOffset: 2,
                          ),
                          child: Text(
                            'CHECKOUT (${CartMockDataSourceImpl.simulationBadge})',
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
                        key: const Key('cart_close_checkout_modal_button'),
                        onTap: () => Navigator.of(dialogContext).pop(),
                        child: Container(
                          width: 36,
                          height: 36,
                          alignment: Alignment.center,
                          decoration: AppTheme.brutalBox(
                            color: AppColors.nbPaper,
                            borderColor: AppColors.nbBlack,
                            borderWidth: AppTheme.borderDefault,
                            shadowOffset: 2,
                          ),
                          child: const Icon(
                            Icons.close,
                            size: 18,
                            color: AppColors.nbBlack,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Ringkasan Pesanan Digital',
                    style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${state.selectedCount} e-book siap diproses menuju pembayaran (${CartMockDataSourceImpl.transactionMatrixCode}):',
                    style: AppTheme.bodySm(AppColors.nbTextMuted, fontSize: 13),
                  ),
                  const SizedBox(height: 10),
                  for (final item in state.selectedItems) ...<Widget>[
                    Container(
                      margin: const EdgeInsets.only(bottom: 6),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.nbPaper,
                        border: Border.all(
                          color: AppColors.nbBlack,
                          width: AppTheme.borderThin,
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: <Widget>[
                          Expanded(
                            child: Text(
                              item.title,
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
                            item.formattedPrice,
                            style: AppTheme.dataMono(
                              AppColors.nbBlack,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: AppTheme.brutalBox(
                      color: AppColors.nbYellow,
                      borderColor: AppColors.nbBlack,
                      borderWidth: AppTheme.borderDefault,
                      shadowOffset: 2,
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: <Widget>[
                        Text(
                          'TOTAL BAYAR',
                          style: AppTheme.labelSm(
                            AppColors.nbBlack,
                            fontSize: 12,
                          ),
                        ),
                        Text(
                          state.formattedTotalPayable,
                          style: AppTheme.dataMono(
                            AppColors.nbBlack,
                            fontSize: 15,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.nbOrange,
                      border: Border.all(
                        color: AppColors.nbBlack,
                        width: AppTheme.borderThin,
                      ),
                    ),
                    child: Text(
                      '${CartMockDataSourceImpl.simulationBadge}: Endpoint /api/v1/orders dan payment gateway backend siap diuji melalui Checkout Stepper.',
                      style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 10),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Semantics(
                    button: true,
                    label: 'Lanjutkan ke Halaman Checkout & Pembayaran',
                    child: InkWell(
                      key: const Key('cart_proceed_to_checkout_stepper_button'),
                      onTap: () {
                        Navigator.of(dialogContext).pop();
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => CheckoutScreen(
                              checkoutItems: state.selectedItems,
                            ),
                          ),
                        );
                      },
                      child: Container(
                        height: 48,
                        alignment: Alignment.center,
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        decoration: AppTheme.brutalBox(
                          color: AppColors.nbYellow,
                          borderColor: AppColors.nbBlack,
                          borderWidth: AppTheme.borderDefault,
                          shadowOffset: 3,
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
                              const SizedBox(width: 6),
                              Text(
                                'LANJUT KE CHECKOUT',
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
          ),
        );
      },
    );
  }

  void _showStateVerificationSheet(CartState state) {
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (sheetContext) {
        return Container(
          padding: const EdgeInsets.all(16),
          decoration: const BoxDecoration(
            color: AppColors.nbWhite,
            border: Border(
              top: BorderSide(
                color: AppColors.nbBlack,
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
                  'VERIFIKASI STATE KERANJANG (ZONA C)',
                  style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                ),
                const SizedBox(height: 4),
                Text(
                  'Uji keempat state wajib (Loaded, Loading, Empty, Error) sesuai aturan mobile/AGENTS.md:',
                  style: AppTheme.bodySm(AppColors.nbTextMuted, fontSize: 12),
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: <Widget>[
                    _buildStateOptionButton(
                      sheetContext: sheetContext,
                      keyName: 'cart_state_btn_loaded',
                      label: 'STATE: LOADED',
                      isActive: state.status == CartStatus.loaded,
                      onTap: () {
                        ref
                            .read(cartProvider.notifier)
                            .setLoadStatus(CartStatus.loaded);
                        _syncHomeCartCount(
                          ref.read(cartProvider).totalItemsCount,
                        );
                      },
                    ),
                    _buildStateOptionButton(
                      sheetContext: sheetContext,
                      keyName: 'cart_state_btn_loading',
                      label: 'STATE: LOADING',
                      isActive: state.status == CartStatus.loading,
                      onTap: () => ref
                          .read(cartProvider.notifier)
                          .setLoadStatus(CartStatus.loading),
                    ),
                    _buildStateOptionButton(
                      sheetContext: sheetContext,
                      keyName: 'cart_state_btn_empty',
                      label: 'STATE: EMPTY',
                      isActive: state.status == CartStatus.empty,
                      onTap: () {
                        ref
                            .read(cartProvider.notifier)
                            .setLoadStatus(CartStatus.empty);
                        _syncHomeCartCount(0);
                      },
                    ),
                    _buildStateOptionButton(
                      sheetContext: sheetContext,
                      keyName: 'cart_state_btn_error',
                      label: 'STATE: ERROR',
                      isActive: state.status == CartStatus.error,
                      onTap: () => ref
                          .read(cartProvider.notifier)
                          .setLoadStatus(CartStatus.error),
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
          color: isActive ? AppColors.nbYellow : AppColors.nbPaper,
          borderColor: AppColors.nbBlack,
          borderWidth: AppTheme.borderDefault,
          shadowOffset: 2,
        ),
        child: Text(
          label,
          style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 11),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    ref.listen<CartState>(cartProvider, (previous, next) {
      if (_promoController.text != next.promoInput) {
        _promoController.value = TextEditingValue(
          text: next.promoInput,
          selection: TextSelection.collapsed(offset: next.promoInput.length),
        );
      }
    });

    final state = ref.watch(cartProvider);
    final notifier = ref.read(cartProvider.notifier);

    final showStickyCheckoutBar =
        state.status == CartStatus.loaded && state.items.isNotEmpty;

    return Scaffold(
      backgroundColor: AppColors.nbPaper,
      body: SafeArea(
        bottom: false,
        child: Column(
          children: <Widget>[
            // Top Fixed Header (`Keranjang Belanja` + State Verify + Clear Cart)
            CartHeader(
              onBackTap: () {
                if (Navigator.of(context).canPop()) {
                  Navigator.of(context).pop();
                } else {
                  _showNeubrutalistSnackBar(
                    'Halaman utama Keranjang Belanja Mobile (Zona C).',
                    icon: Icons.info_outline,
                  );
                }
              },
              onClearCartTap: () => _showClearCartConfirmationDialog(state),
              onStateDebugTap: () => _showStateVerificationSheet(state),
            ),

            // Main Scrollable Content
            Expanded(
              child: SingleChildScrollView(
                key: const Key('cart_scroll_view'),
                padding: EdgeInsets.fromLTRB(
                  AppTheme.marginMobile,
                  8,
                  AppTheme.marginMobile,
                  showStickyCheckoutBar ? 28 : 24,
                ),
                child: _buildBodyContent(state, notifier),
              ),
            ),

            if (showStickyCheckoutBar)
              CartBottomCheckoutBar(
                selectedCount: state.selectedCount,
                formattedTotalPayable: state.formattedTotalPayable,
                appliedDiscount: state.appliedDiscount,
                formattedDiscount: state.formattedDiscount,
                onCheckoutTap: () => _showCheckoutSimulationModal(state),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildBodyContent(CartState state, CartNotifier notifier) {
    if (state.status == CartStatus.loading) {
      return CartStateViews.buildLoadingSkeleton();
    }

    if (state.status == CartStatus.error) {
      return CartStateViews.buildErrorState(
        message:
            state.errorMessage ??
            'Gagal memuat keranjang belanja dari server. Periksa koneksi internet dan coba lagi.',
        onRetry: () async {
          await notifier.retryLoad();
          _syncHomeCartCount(ref.read(cartProvider).totalItemsCount);
        },
      );
    }

    if (state.status == CartStatus.empty || state.items.isEmpty) {
      return CartStateViews.buildEmptyState(
        recommendedItems: state.recommendedItems,
        onExploreCatalogTap: () {
          Navigator.of(
            context,
          ).push(MaterialPageRoute(builder: (_) => const CatalogScreen()));
        },
        onViewSawRecommendationsTap: () async {
          await notifier.retryLoad();
          _syncHomeCartCount(ref.read(cartProvider).totalItemsCount);
          _showNeubrutalistSnackBar(
            'Menampilkan rekomendasi teratas SPK SAW di keranjang.',
            backgroundColor: AppColors.nbLavender,
          );
        },
        onQuickAddRecommendation: (CartItem item) {
          notifier.addItem(item);
          _syncHomeCartCount(ref.read(cartProvider).totalItemsCount);
          _showNeubrutalistSnackBar(
            '${item.title} ditambahkan ke keranjang belanja.',
            backgroundColor: AppColors.nbGreen,
          );
        },
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        // 1. Top Notice / Digital Integrity Notice
        CartDigitalNotice(isMock: state.isMock),
        const SizedBox(height: AppTheme.spaceMd),

        // 2. Bulk Selection Header Bar
        CartBulkSelectionBar(
          totalItems: state.totalItemsCount,
          selectedCount: state.selectedCount,
          isAllSelected: state.isAllSelected,
          onToggleSelectAll: notifier.toggleSelectAll,
          onDeleteSelected: () {
            if (state.selectedCount == 0) {
              _showNeubrutalistSnackBar(
                'Pilih minimal 1 e-book yang ingin dihapus.',
                backgroundColor: AppColors.nbOrange,
                icon: Icons.info_outline,
              );
              return;
            }
            final removedCount = state.selectedCount;
            notifier.removeSelectedItems();
            _syncHomeCartCount(ref.read(cartProvider).totalItemsCount);
            _showNeubrutalistSnackBar(
              '$removedCount e-book terpilih dihapus dari keranjang.',
              backgroundColor: AppColors.nbPink,
              icon: Icons.delete_sweep_outlined,
            );
          },
        ),
        const SizedBox(height: AppTheme.spaceMd),

        // 3. Cart Items List
        for (int i = 0; i < state.items.length; i++) ...<Widget>[
          if (i > 0) const SizedBox(height: AppTheme.spaceMd),
          CartItemCard(
            item: state.items[i],
            onToggleSelect: () =>
                notifier.toggleItemSelection(state.items[i].id),
            onDelete: () {
              final removedTitle = state.items[i].title;
              notifier.removeItem(state.items[i].id);
              _syncHomeCartCount(ref.read(cartProvider).totalItemsCount);
              _showNeubrutalistSnackBar(
                '$removedTitle dihapus dari keranjang.',
                backgroundColor: AppColors.nbPink,
                icon: Icons.delete_outline,
              );
            },
            onTapDetail: () => _openBookDetail(state.items[i].id),
          ),
        ],
        const SizedBox(height: AppTheme.spaceLg),

        // 4. Kode Promo / Voucher Kupon Section
        CartPromoSection(
          controller: _promoController,
          activePromo: state.activePromo,
          promoError: state.promoError,
          onChanged: notifier.updatePromoInput,
          onApplyTap: () async {
            final ok = await notifier.applyPromoCode(_promoController.text);
            if (ok && mounted) {
              final promo = ref.read(cartProvider).activePromo;
              _showNeubrutalistSnackBar(
                'Kupon ${promo?.code ?? ''} berhasil diterapkan (-${promo?.formattedDiscount ?? ''}).',
                backgroundColor: AppColors.nbGreen,
              );
            }
          },
          onRemovePromoTap: () {
            final removedCode = state.activePromo?.code ?? '';
            notifier.removeActivePromo();
            _showNeubrutalistSnackBar(
              'Kupon $removedCode dihapus.',
              backgroundColor: AppColors.nbOrange,
              icon: Icons.info_outline,
            );
          },
        ),
        const SizedBox(height: AppTheme.spaceMd),

        // 5. Ringkasan Transaksi (Zone C Data Matrix)
        CartSummarySection(
          selectedCount: state.selectedCount,
          formattedSubtotal: state.formattedSubtotal,
          activePromo: state.activePromo,
          appliedDiscount: state.appliedDiscount,
          formattedDiscount: state.formattedDiscount,
          formattedCloudFee: state.formattedCloudFee,
          formattedTotalPayable: state.formattedTotalPayable,
          onCloudFeeHelpTap: _showCloudFeeInfoDialog,
        ),
      ],
    );
  }
}
