import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../domain/entities/order_entity.dart';
import '../providers/checkout_provider.dart';
import '../widgets/order_status_badge.dart';

class OrderHistoryScreen extends ConsumerStatefulWidget {
  const OrderHistoryScreen({super.key});

  @override
  ConsumerState<OrderHistoryScreen> createState() => _OrderHistoryScreenState();
}

class _OrderHistoryScreenState extends ConsumerState<OrderHistoryScreen> {
  late Future<List<OrderEntity>> _ordersFuture;

  @override
  void initState() {
    super.initState();
    _loadOrders();
  }

  void _loadOrders() {
    _ordersFuture = ref.read(checkoutRepositoryProvider).getMyOrders();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.nbPaper,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(56),
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
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: <Widget>[
                  Semantics(
                    button: true,
                    label: 'Kembali',
                    child: InkWell(
                      key: const Key('orders_back_button'),
                      onTap: () => Navigator.of(context).pop(),
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
                    child: Text(
                      'RIWAYAT PESANAN',
                      style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
      body: FutureBuilder<List<OrderEntity>>(
        future: _ordersFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(color: AppColors.nbBlack),
            );
          }

          if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    Text(
                      'GAGAL MEMUAT PESANAN',
                      style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      snapshot.error.toString(),
                      textAlign: TextAlign.center,
                      style: AppTheme.bodySm(AppColors.nbTextMuted),
                    ),
                    const SizedBox(height: 16),
                    InkWell(
                      onTap: () => setState(_loadOrders),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 10,
                        ),
                        decoration: AppTheme.brutalBox(
                          color: AppColors.nbYellow,
                          borderColor: AppColors.nbBlack,
                          borderWidth: AppTheme.borderDefault,
                          shadowOffset: 2,
                        ),
                        child: Text(
                          'COBA LAGI',
                          style: AppTheme.labelSm(AppColors.nbBlack),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }

          final orders = snapshot.data ?? <OrderEntity>[];
          if (orders.isEmpty) {
            return Center(
              child: Text(
                'Belum ada riwayat pesanan.',
                style: AppTheme.bodySm(AppColors.nbTextMuted),
              ),
            );
          }

          return ListView.separated(
            key: const Key('orders_list_view'),
            padding: const EdgeInsets.all(16),
            itemCount: orders.length,
            separatorBuilder: (context, index) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final order = orders[index];
              return Container(
                key: Key('order_card_${order.id}'),
                padding: const EdgeInsets.all(16),
                decoration: AppTheme.brutalBox(
                  color: AppColors.nbWhite,
                  borderColor: AppColors.nbBlack,
                  borderWidth: AppTheme.borderDefault,
                  shadowOffset: 3,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: <Widget>[
                        Text(
                          order.orderNumber,
                          style: AppTheme.dataMono(
                            AppColors.nbBlack,
                            fontSize: 13,
                          ),
                        ),
                        OrderStatusBadge(orderStatus: order.status),
                      ],
                    ),
                    const SizedBox(height: 8),
                    for (final item in order.items)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 4),
                        child: Text(
                          '\u2022 ${item.title}',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: AppTheme.bodySm(
                            AppColors.nbBlack,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    const SizedBox(height: 8),
                    const Divider(color: AppColors.nbBlack, thickness: 1),
                    const SizedBox(height: 4),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: <Widget>[
                        Text(
                          'TOTAL:',
                          style: AppTheme.labelSm(
                            AppColors.nbTextMuted,
                            fontSize: 11,
                          ),
                        ),
                        Text(
                          order.formattedTotalAmount,
                          style: AppTheme.dataMono(
                            AppColors.nbBlack,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}
