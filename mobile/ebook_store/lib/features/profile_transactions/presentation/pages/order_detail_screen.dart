import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/utils/date_formatter.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../../checkout/domain/entities/order_entity.dart';
import '../../../checkout/presentation/pages/checkout_screen.dart';
import '../../../checkout/presentation/widgets/order_status_badge.dart';
import '../../../library/presentation/pages/library_screen.dart';
import '../providers/profile_transactions_providers.dart';
import '../widgets/profile_app_bar.dart';
import '../widgets/profile_error_state.dart';
import '../widgets/pt_controls.dart';

class OrderDetailScreen extends ConsumerWidget {
  final String orderId;
  final OrderEntity? initialOrder;

  const OrderDetailScreen({
    super.key,
    required this.orderId,
    this.initialOrder,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final detailAsync = ref.watch(orderDetailProvider(orderId));

    return Scaffold(
      backgroundColor: AppColors.nbPaper,
      appBar: const ProfileAppBar(title: 'Detail Pesanan'),
      body: detailAsync.when(
        data: (order) => _buildContent(context, order),
        loading: () => initialOrder != null
            ? _buildContent(context, initialOrder!)
            : const Center(
                child: CircularProgressIndicator(
                  color: AppColors.nbBlack,
                  strokeWidth: 3,
                ),
              ),
        error: (err, _) => Padding(
          padding: const EdgeInsets.all(AppTheme.marginMobile),
          child: ProfileErrorState(
            message: describeFailure(err).message,
            onRetry: () => ref.refresh(orderDetailProvider(orderId)),
          ),
        ),
      ),
    );
  }

  Widget _buildContent(BuildContext context, OrderEntity order) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppTheme.marginMobile),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          // 1. Header Ringkasan Pesanan
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: AppTheme.brutalBox(
              color: AppColors.nbWhite,
              borderColor: AppColors.nbBlack,
              borderWidth: AppTheme.borderDefault,
              shadowOffset: 4,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    const Text(
                      'STATUS PESANAN',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 11,
                        fontWeight: FontWeight.w900,
                        color: AppColors.nbBlack,
                        letterSpacing: 0.5,
                      ),
                    ),
                    OrderStatusBadge(orderStatus: order.status),
                  ],
                ),
                const SizedBox(height: 10),
                Text(
                  '#${order.orderNumber}',
                  key: const Key('detail_order_number'),
                  style: const TextStyle(
                    fontFamily: 'SpaceMono',
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppColors.nbBlack,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: <Widget>[
                    const Icon(
                      Icons.access_time,
                      size: 13,
                      color: AppColors.nbDisabledText,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'Dibuat: ${formatDateTimeId(order.createdAt)}',
                      style: AppTheme.bodySm(
                        AppColors.nbDisabledText,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
                if (order.isPending) ...<Widget>[
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: AppTheme.brutalBox(
                      color: AppColors.nbOrange,
                      borderColor: AppColors.nbBlack,
                      borderWidth: 1.5,
                      shadowOffset: 0,
                    ),
                    child: Row(
                      children: <Widget>[
                        const Icon(
                          Icons.timer_outlined,
                          size: 16,
                          color: AppColors.nbBlack,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'Selesaikan pembayaran sebelum:\n${formatDateTimeId(order.expiresAt)}',
                            style: const TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: AppColors.nbBlack,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(height: 16),

          // 2. Daftar E-Book
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: AppTheme.brutalBox(
              color: AppColors.nbWhite,
              borderColor: AppColors.nbBlack,
              borderWidth: AppTheme.borderDefault,
              shadowOffset: 4,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  'DAFTAR E-BOOK (${order.items.length})',
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 11,
                    fontWeight: FontWeight.w900,
                    color: AppColors.nbBlack,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 12),
                ...order.items.map((item) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        // Cover e-book
                        Container(
                          width: 48,
                          height: 64,
                          decoration: AppTheme.brutalBox(
                            color: AppColors.nbMuted,
                            borderColor: AppColors.nbBlack,
                            borderWidth: 1.5,
                            shadowOffset: 0,
                          ),
                          child:
                              item.coverUrl != null && item.coverUrl!.isNotEmpty
                              ? Image.network(
                                  item.coverUrl!,
                                  fit: BoxFit.cover,
                                  errorBuilder: (_, _, _) => const Icon(
                                    Icons.menu_book,
                                    size: 20,
                                    color: AppColors.nbBlack,
                                  ),
                                )
                              : const Icon(
                                  Icons.menu_book,
                                  size: 20,
                                  color: AppColors.nbBlack,
                                ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: <Widget>[
                              Text(
                                item.title,
                                style: AppTheme.labelMd(AppColors.nbBlack),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                item.author,
                                style: AppTheme.bodySm(
                                  AppColors.nbDisabledText,
                                  fontSize: 12,
                                ),
                              ),
                              if (item.categoryName != null) ...<Widget>[
                                const SizedBox(height: 2),
                                Text(
                                  item.categoryName!,
                                  style: const TextStyle(
                                    fontFamily: 'Inter',
                                    fontSize: 10,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.nbDisabledText,
                                  ),
                                ),
                              ],
                              const SizedBox(height: 4),
                              Text(
                                item.formattedUnitPrice,
                                style: const TextStyle(
                                  fontFamily: 'SpaceMono',
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.nbBlack,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                }),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // 3. Rincian Pembayaran
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: AppTheme.brutalBox(
              color: AppColors.nbWhite,
              borderColor: AppColors.nbBlack,
              borderWidth: AppTheme.borderDefault,
              shadowOffset: 4,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                const Text(
                  'RINCIAN PEMBAYARAN',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 11,
                    fontWeight: FontWeight.w900,
                    color: AppColors.nbBlack,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    const Text(
                      'Subtotal E-Book',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 13,
                        color: AppColors.nbBlack,
                      ),
                    ),
                    Text(
                      order.formattedTotalAmount,
                      style: const TextStyle(
                        fontFamily: 'SpaceMono',
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.nbBlack,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    Text(
                      'Biaya Layanan',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 13,
                        color: AppColors.nbBlack,
                      ),
                    ),
                    Text(
                      'Rp 0',
                      style: TextStyle(
                        fontFamily: 'SpaceMono',
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.nbBlack,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                const Divider(
                  color: AppColors.nbBlack,
                  height: 1,
                  thickness: 1,
                ),
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: AppTheme.brutalBox(
                    color: AppColors.nbYellow,
                    borderColor: AppColors.nbBlack,
                    borderWidth: 1.5,
                    shadowOffset: 0,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      const Text(
                        'Total Tagihan',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 14,
                          fontWeight: FontWeight.w900,
                          color: AppColors.nbBlack,
                        ),
                      ),
                      Text(
                        order.formattedTotalAmount,
                        style: const TextStyle(
                          fontFamily: 'SpaceMono',
                          fontSize: 15,
                          fontWeight: FontWeight.w900,
                          color: AppColors.nbBlack,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // 4. Tombol Aksi Bawah
          if (order.isPending)
            PtButton(
              key: const Key('detail_resume_payment_button'),
              label: 'Lanjutkan Pembayaran',
              icon: Icons.payment,
              color: AppColors.nbOrange,
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (_) => CheckoutScreen(
                      resumeOrder: order,
                      checkoutItems: const [],
                    ),
                  ),
                );
              },
            )
          else if (order.isPaid)
            PtButton(
              key: const Key('detail_open_library_button'),
              label: 'Buka di Pustaka',
              icon: Icons.auto_stories,
              color: AppColors.nbGreen,
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const LibraryScreen()),
                );
              },
            ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}
