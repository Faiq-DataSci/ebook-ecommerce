import 'package:flutter/material.dart';
import '../../../../core/utils/rupiah_formatter.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../../cart/domain/entities/cart_item.dart';
import '../../domain/entities/order_entity.dart';

class OrderSummaryCard extends StatelessWidget {
  final List<CartItem>? cartItems;
  final OrderEntity? order;

  const OrderSummaryCard({super.key, this.cartItems, this.order});

  @override
  Widget build(BuildContext context) {
    final int total =
        order?.totalAmount ??
        (cartItems?.fold<int>(0, (sum, i) => sum + i.price) ?? 0);
    final int count = order?.items.length ?? cartItems?.length ?? 0;

    return Container(
      key: const Key('order_summary_card'),
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
              Expanded(
                child: Text(
                  'RINGKASAN PESANAN',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: AppTheme.brutalBox(
                  color: AppColors.nbPaper,
                  borderColor: AppColors.nbBlack,
                  borderWidth: AppTheme.borderThin,
                  shadowOffset: 1,
                ),
                child: Text(
                  '$count E-BOOK',
                  style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 10),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Daftar Item
          if (order != null) ...[
            for (final item in order!.items)
              _buildItemRow(
                title: item.title,
                author: item.author,
                price: item.formattedUnitPrice,
              ),
          ] else if (cartItems != null) ...[
            for (final item in cartItems!)
              _buildItemRow(
                title: item.title,
                author: item.author,
                price: item.formattedPrice,
              ),
          ],

          const SizedBox(height: 12),
          const Divider(color: AppColors.nbBlack, thickness: 1.5),
          const SizedBox(height: 8),

          // Subtotal & Total
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Expanded(
                child: Text(
                  'Subtotal E-Book',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppTheme.bodySm(AppColors.nbTextMuted),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                formatRupiah(total),
                style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 13),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Expanded(
                child: Text(
                  'Biaya Layanan Gateway',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppTheme.bodySm(AppColors.nbTextMuted),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                'Rp 0 (Gratis)',
                style: AppTheme.dataMono(AppColors.nbGreen, fontSize: 12),
              ),
            ],
          ),
          const SizedBox(height: 8),
          const Divider(color: AppColors.nbBlack, thickness: 1.5),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Expanded(
                child: Text(
                  'TOTAL PEMBAYARAN',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppTheme.labelMd(AppColors.nbBlack),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                formatRupiah(total),
                key: const Key('order_summary_total_amount'),
                style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 16),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildItemRow({
    required String title,
    required String author,
    required String price,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          const Icon(
            Icons.menu_book_outlined,
            size: 16,
            color: AppColors.nbBlack,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: AppTheme.labelSm(AppColors.nbBlack, fontSize: 12),
                ),
                Text(
                  author,
                  style: AppTheme.bodySm(AppColors.nbTextMuted, fontSize: 11),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Text(
            price,
            style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 12),
          ),
        ],
      ),
    );
  }
}
