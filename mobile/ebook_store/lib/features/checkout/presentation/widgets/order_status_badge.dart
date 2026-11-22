import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../domain/entities/order_entity.dart';
import '../../domain/entities/payment_entity.dart';

class OrderStatusBadge extends StatelessWidget {
  final OrderStatusEnum? orderStatus;
  final PaymentStatusEnum? paymentStatus;

  const OrderStatusBadge({super.key, this.orderStatus, this.paymentStatus})
    : assert(
        orderStatus != null || paymentStatus != null,
        'Harus menyediakan orderStatus atau paymentStatus',
      );

  @override
  Widget build(BuildContext context) {
    Color bg;
    IconData icon;
    String label;

    if (orderStatus != null) {
      switch (orderStatus!) {
        case OrderStatusEnum.paid:
          bg = AppColors.nbGreen;
          icon = Icons.check_circle_outline;
          label = 'Lunas';
          break;
        case OrderStatusEnum.pending:
          bg = AppColors.nbOrange;
          icon = Icons.access_time;
          label = 'Menunggu Pembayaran';
          break;
        case OrderStatusEnum.failed:
          bg = AppColors.nbPink;
          icon = Icons.highlight_off;
          label = 'Pesanan Gagal';
          break;
        case OrderStatusEnum.expired:
          bg = AppColors.nbPink;
          icon = Icons.timer_off_outlined;
          label = 'Kedaluwarsa';
          break;
        case OrderStatusEnum.cancelled:
          bg = AppColors.nbMuted;
          icon = Icons.remove_circle_outline;
          label = 'Dibatalkan';
          break;
      }
    } else {
      switch (paymentStatus!) {
        case PaymentStatusEnum.verified:
          bg = AppColors.nbGreen;
          icon = Icons.check_circle_outline;
          label = 'Lunas';
          break;
        case PaymentStatusEnum.pending:
          bg = AppColors.nbOrange;
          icon = Icons.access_time;
          label = 'Menunggu Pembayaran';
          break;
        case PaymentStatusEnum.failed:
          bg = AppColors.nbPink;
          icon = Icons.highlight_off;
          label = 'Gagal';
          break;
        case PaymentStatusEnum.expired:
          bg = AppColors.nbPink;
          icon = Icons.timer_off_outlined;
          label = 'Kedaluwarsa';
          break;
        case PaymentStatusEnum.cancelled:
          bg = AppColors.nbMuted;
          icon = Icons.remove_circle_outline;
          label = 'Dibatalkan';
          break;
      }
    }

    return Container(
      key: const Key('order_status_badge'),
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: AppTheme.brutalBox(
        color: bg,
        borderColor: AppColors.nbBlack,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 2,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Icon(icon, size: 14, color: AppColors.nbBlack),
          const SizedBox(width: 5),
          Flexible(
            child: Text(
              label.toUpperCase(),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 11),
            ),
          ),
        ],
      ),
    );
  }
}
