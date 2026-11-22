import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../../cart/domain/entities/cart_item.dart';
import '../../../cart/presentation/providers/cart_provider.dart';
import '../providers/checkout_provider.dart';
import '../providers/checkout_state.dart';
import '../widgets/checkout_error_state.dart';
import '../widgets/checkout_loading_state.dart';
import '../widgets/checkout_stepper.dart';
import '../widgets/order_status_badge.dart';
import '../widgets/order_summary_card.dart';
import '../widgets/payment_gateway_card.dart';
import '../widgets/payment_gateway_pending_card.dart';
import 'order_history_screen.dart';

class CheckoutScreen extends ConsumerStatefulWidget {
  final List<CartItem> checkoutItems;

  const CheckoutScreen({super.key, required this.checkoutItems});

  @override
  ConsumerState<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends ConsumerState<CheckoutScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(checkoutProvider.notifier).initialize(widget.checkoutItems);
    });
  }

  void _showFeedbackSnackBar(
    String message, {
    Color color = AppColors.nbYellow,
    IconData icon = Icons.info_outline,
  }) {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        content: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          decoration: AppTheme.brutalBox(
            color: color,
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

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(checkoutProvider);
    final notifier = ref.read(checkoutProvider.notifier);

    return Scaffold(
      backgroundColor: AppColors.nbPaper,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(60),
        child: Container(
          decoration: const BoxDecoration(
            color: AppColors.nbPaper,
            border: Border(
              bottom: BorderSide(
                color: AppColors.nbBlack,
                width: AppTheme.borderDefault,
              ),
            ),
          ),
          child: SafeArea(
            bottom: false,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: <Widget>[
                  Semantics(
                    button: true,
                    label: 'Kembali',
                    child: InkWell(
                      key: const Key('checkout_back_button'),
                      onTap: () {
                        if (state.currentStep == CheckoutStep.payment) {
                          notifier.goToStep(CheckoutStep.review);
                        } else {
                          Navigator.of(context).pop();
                        }
                      },
                      child: Container(
                        width: 36,
                        height: 36,
                        alignment: Alignment.center,
                        decoration: AppTheme.brutalBox(
                          color: AppColors.nbWhite,
                          borderColor: AppColors.nbBlack,
                          borderWidth: AppTheme.borderDefault,
                          shadowOffset: 2,
                        ),
                        child: const Icon(
                          Icons.arrow_back,
                          size: 18,
                          color: AppColors.nbBlack,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Text(
                          'CHECKOUT & PEMBAYARAN',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: AppTheme.labelSm(
                            AppColors.nbBlack,
                            fontSize: 13,
                          ),
                        ),
                        Text(
                          'ZONA C \u2022 TRANSAKSI DIGITAL',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: AppTheme.dataMono(
                            AppColors.nbTextMuted,
                            fontSize: 9.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (state.isMock)
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: AppTheme.brutalBox(
                        color: AppColors.nbOrange,
                        borderColor: AppColors.nbBlack,
                        borderWidth: AppTheme.borderThin,
                        shadowOffset: 1,
                      ),
                      child: Text(
                        'DATA SIMULASI',
                        style: AppTheme.dataMono(
                          AppColors.nbBlack,
                          fontSize: 9,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
      body: Column(
        children: <Widget>[
          // Stepper: Tinjau -> Bayar -> Selesai
          CheckoutStepper(currentStep: state.currentStep),

          // Konten Utama
          Expanded(
            child: SingleChildScrollView(
              key: const Key('checkout_scroll_view'),
              padding: const EdgeInsets.all(16),
              child: _buildStepContent(state, notifier),
            ),
          ),

          // Bottom Bar Aksi
          if (state.currentStep != CheckoutStep.completed)
            _buildBottomActionBar(state, notifier),
        ],
      ),
    );
  }

  Widget _buildStepContent(CheckoutState state, CheckoutNotifier notifier) {
    if (state.status == CheckoutStatus.loading && state.items.isEmpty) {
      return const CheckoutLoadingState(
        message: 'Menyiapkan transaksi pesanan Anda...',
      );
    }

    if (state.errorMessage != null && state.status == CheckoutStatus.error) {
      return CheckoutErrorState(
        errorMessage: state.errorMessage!,
        onRetry: () {
          if (state.currentStep == CheckoutStep.review) {
            notifier.proceedToPaymentStep();
          } else {
            notifier.confirmPayment();
          }
        },
        onBackToCart: () => Navigator.of(context).pop(),
      );
    }

    switch (state.currentStep) {
      case CheckoutStep.review:
        return _buildReviewStep(state);
      case CheckoutStep.payment:
        return _buildPaymentStep(state, notifier);
      case CheckoutStep.completed:
        return _buildCompletedStep(state, notifier);
    }
  }

  Widget _buildReviewStep(CheckoutState state) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        // Banner Produk Digital
        Container(
          padding: const EdgeInsets.all(12),
          decoration: AppTheme.brutalBox(
            color: AppColors.nbBlue,
            borderColor: AppColors.nbBlack,
            borderWidth: AppTheme.borderDefault,
            shadowOffset: 2,
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              const Icon(
                Icons.info_outline,
                size: 20,
                color: AppColors.nbBlack,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      'INFORMASI PRODUK DIGITAL',
                      style: AppTheme.labelSm(AppColors.nbBlack, fontSize: 11),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Seluruh e-book merupakan lisensi digital 1 pengguna. Akses file PDF dijamin aman dan dapat langsung dibaca melalui aplikasi.',
                      style: AppTheme.bodySm(AppColors.nbBlack, fontSize: 12),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Ringkasan Pesanan
        OrderSummaryCard(cartItems: state.items),
        const SizedBox(height: 16),

        // Ketentuan Tambahan
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppColors.nbWhite,
            border: Border.all(
              color: AppColors.nbBlack,
              width: AppTheme.borderThin,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                'KETENTUAN TRANSAKSI',
                style: AppTheme.labelSm(AppColors.nbBlack, fontSize: 11),
              ),
              const SizedBox(height: 4),
              Text(
                '\u2022 Harga dan total tagihan dikonfirmasi secara ketat oleh sistem backend.\n'
                '\u2022 Pembelian e-book yang sudah Anda miliki otomatis dicegah oleh server.\n'
                '\u2022 Batas waktu penyelesaian pembayaran adalah 24 jam setelah pesanan dibuat.',
                style: AppTheme.bodySm(AppColors.nbTextMuted, fontSize: 11.5),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildPaymentStep(CheckoutState state, CheckoutNotifier notifier) {
    final order = state.currentOrder;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        if (order != null) ...[
          // Kartu Informasi Nomor Pesanan
          Container(
            padding: const EdgeInsets.all(12),
            decoration: AppTheme.brutalBox(
              color: AppColors.nbWhite,
              borderColor: AppColors.nbBlack,
              borderWidth: AppTheme.borderDefault,
              shadowOffset: 2,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text(
                        'NOMOR PESANAN',
                        style: AppTheme.labelSm(
                          AppColors.nbTextMuted,
                          fontSize: 10,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        order.orderNumber,
                        key: const Key('checkout_order_number_text'),
                        style: AppTheme.dataMono(
                          AppColors.nbBlack,
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                OrderStatusBadge(orderStatus: order.status),
              ],
            ),
          ),
          const SizedBox(height: 16),
        ],

        // Pemilih Metode Pembayaran
        PaymentGatewayCard(
          selectedMethod: state.selectedPaymentMethod,
          onSelectMethod: notifier.selectPaymentMethod,
        ),
        const SizedBox(height: 16),

        // Ringkasan Tagihan dari Server
        OrderSummaryCard(order: order, cartItems: state.items),
      ],
    );
  }

  Widget _buildCompletedStep(CheckoutState state, CheckoutNotifier notifier) {
    final order = state.currentOrder;
    if (order == null) {
      return const Center(child: Text('Data pesanan tidak ditemukan.'));
    }

    if (order.isPaid) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          // Sukses Lunas Banner
          Container(
            key: const Key('checkout_success_card'),
            padding: const EdgeInsets.all(20),
            decoration: AppTheme.brutalBox(
              color: AppColors.nbGreen,
              borderColor: AppColors.nbBlack,
              borderWidth: AppTheme.borderDefault,
              shadowOffset: 4,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Row(
                  children: <Widget>[
                    const Icon(
                      Icons.check_circle,
                      size: 28,
                      color: AppColors.nbBlack,
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'PEMBAYARAN TERVERIFIKASI!',
                        style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  'Pesanan #${order.orderNumber} telah lunas. Hak akses EbookAccess telah aktif di sistem backend.',
                  style: AppTheme.bodySm(AppColors.nbBlack, fontSize: 13),
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.nbWhite,
                    border: Border.all(color: AppColors.nbBlack, width: 1.5),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      Expanded(
                        child: Text(
                          'TOTAL DIBAYAR:',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: AppTheme.labelSm(
                            AppColors.nbBlack,
                            fontSize: 11,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        order.formattedTotalAmount,
                        style: AppTheme.dataMono(
                          AppColors.nbBlack,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Detail E-book yang Diperoleh
          OrderSummaryCard(order: order),
          const SizedBox(height: 20),

          // Tombol Buka Pustaka
          InkWell(
            key: const Key('checkout_goto_library_button'),
            onTap: () {
              // Kosongkan keranjang belanja setelah checkout sukses
              ref.read(cartProvider.notifier).clearCart();
              _showFeedbackSnackBar(
                'E-Book siap dibaca di Pustaka Digital Anda!',
                color: AppColors.nbGreen,
                icon: Icons.auto_stories,
              );
              Navigator.of(context).pop();
            },
            child: Container(
              height: 48,
              alignment: Alignment.center,
              decoration: AppTheme.brutalBox(
                color: AppColors.nbYellow,
                borderColor: AppColors.nbBlack,
                borderWidth: AppTheme.borderDefault,
                shadowOffset: 3,
              ),
              child: Text(
                'BUKA PERPUSTAKAAN DIGITAL',
                style: AppTheme.labelMd(AppColors.nbBlack),
              ),
            ),
          ),
          const SizedBox(height: 10),

          // Tombol Lihat Riwayat Pesanan
          InkWell(
            key: const Key('checkout_goto_orders_button'),
            onTap: () {
              ref.read(cartProvider.notifier).clearCart();
              Navigator.of(context).pushReplacement(
                MaterialPageRoute(builder: (_) => const OrderHistoryScreen()),
              );
            },
            child: Container(
              height: 48,
              alignment: Alignment.center,
              decoration: AppTheme.brutalBox(
                color: AppColors.nbWhite,
                borderColor: AppColors.nbBlack,
                borderWidth: AppTheme.borderDefault,
                shadowOffset: 2,
              ),
              child: Text(
                'LIHAT RIWAYAT PESANAN',
                style: AppTheme.labelMd(AppColors.nbBlack),
              ),
            ),
          ),
        ],
      );
    }

    if (order.isPending) {
      return PaymentGatewayPendingCard(
        order: order,
        isCheckingStatus: state.isSubmitting,
        isMock: state.isMock,
        onCheckStatus: () => notifier.refreshOrderStatus(),
        onSimulatePay: () => notifier.simulatePaymentVerification(),
      );
    }

    // Status Failed / Expired
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Container(
          padding: const EdgeInsets.all(16),
          decoration: AppTheme.brutalBox(
            color: AppColors.nbPink,
            borderColor: AppColors.nbBlack,
            borderWidth: AppTheme.borderDefault,
            shadowOffset: 4,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Row(
                children: <Widget>[
                  const Icon(
                    Icons.cancel_outlined,
                    size: 24,
                    color: AppColors.nbBlack,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'PESANAN TIDAK DAPAT DIPROSES',
                    style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'Status pesanan saat ini adalah ${order.status.label}. Transaksi tidak dapat diselesaikan atau batas waktu telah berakhir.',
                style: AppTheme.bodySm(AppColors.nbBlack, fontSize: 13),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        InkWell(
          key: const Key('checkout_failed_back_button'),
          onTap: () => Navigator.of(context).pop(),
          child: Container(
            height: 48,
            alignment: Alignment.center,
            decoration: AppTheme.brutalBox(
              color: AppColors.nbYellow,
              borderColor: AppColors.nbBlack,
              borderWidth: AppTheme.borderDefault,
              shadowOffset: 3,
            ),
            child: Text(
              'KEMBALI KE KERANJANG',
              style: AppTheme.labelMd(AppColors.nbBlack),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildBottomActionBar(CheckoutState state, CheckoutNotifier notifier) {
    final isReview = state.currentStep == CheckoutStep.review;
    final isSubmitting = state.isSubmitting;
    final canProceed = isReview ? state.canProceedToPay : (!isSubmitting);

    final String buttonText = isReview
        ? 'LANJUT KE PEMBAYARAN'
        : (isSubmitting ? 'MEMPROSES PESANAN...' : 'BAYAR SEKARANG');

    final VoidCallback? onTapAction = isSubmitting
        ? null
        : (isReview
              ? () => notifier.proceedToPaymentStep()
              : () => notifier.confirmPayment());

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: const BoxDecoration(
        color: AppColors.nbPaper,
        border: Border(
          top: BorderSide(
            color: AppColors.nbBlack,
            width: AppTheme.borderThick,
          ),
        ),
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: <Widget>[
            Expanded(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    'TOTAL TAGIHAN',
                    style: AppTheme.labelSm(
                      AppColors.nbTextMuted,
                      fontSize: 11,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    state.currentOrder?.formattedTotalAmount ??
                        (widget.checkoutItems.isNotEmpty
                            ? widget.checkoutItems.first.formattedPrice
                            : 'Rp 0'),
                    key: const Key('checkout_bottom_total_text'),
                    style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 16),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              flex: 2,
              child: Semantics(
                button: true,
                enabled: canProceed,
                label: buttonText,
                child: InkWell(
                  key: isReview
                      ? const Key('checkout_proceed_to_pay_button')
                      : const Key('checkout_pay_button'),
                  onTap: canProceed ? onTapAction : null,
                  child: Container(
                    height: 48,
                    alignment: Alignment.center,
                    decoration: AppTheme.brutalBox(
                      color: canProceed
                          ? AppColors.nbYellow
                          : AppColors.nbMuted,
                      borderColor: canProceed
                          ? AppColors.nbBlack
                          : AppColors.nbDisabledText,
                      borderWidth: AppTheme.borderDefault,
                      shadowOffset: canProceed ? 3 : 0,
                    ),
                    child: isSubmitting
                        ? Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              const SizedBox(
                                width: 16,
                                height: 16,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: AppColors.nbBlack,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'MEMPROSES...',
                                style: AppTheme.labelSm(AppColors.nbBlack),
                              ),
                            ],
                          )
                        : Text(
                            buttonText,
                            style: AppTheme.labelMd(
                              canProceed
                                  ? AppColors.nbBlack
                                  : AppColors.nbDisabledText,
                            ),
                          ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
