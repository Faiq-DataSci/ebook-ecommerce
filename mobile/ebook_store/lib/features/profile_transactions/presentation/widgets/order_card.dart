import 'package:flutter/material.dart';
import '../../../../core/utils/date_formatter.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../../checkout/domain/entities/order_entity.dart';
import '../../../checkout/presentation/widgets/order_status_badge.dart';
import 'pt_controls.dart';

class OrderCard extends StatelessWidget {
  final OrderEntity order;
  final VoidCallback onTap;
  final VoidCallback? onResumePayment;
  final VoidCallback? onOpenLibrary;

  const OrderCard({
    super.key,
    required this.order,
    required this.onTap,
    this.onResumePayment,
    this.onOpenLibrary,
  });

  @override
  Widget build(BuildContext context) {
    final firstItem = order.items.isNotEmpty ? order.items.first : null;
    final otherItemsCount = order.items.length > 1 ? order.items.length - 1 : 0;

    return Semantics(
      button: true,
      label:
          'Pesanan ${order.orderNumber}, status ${order.status.label}, total ${order.formattedTotalAmount}',
      child: InkWell(
        key: Key('order_card_${order.id}'),
        onTap: onTap,
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(14),
          decoration: AppTheme.brutalBox(
            color: AppColors.nbWhite,
            borderColor: AppColors.nbBlack,
            borderWidth: AppTheme.borderDefault,
            shadowOffset: 3,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              // Header: Nomor pesanan (Space Mono) + Status Badge
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: <Widget>[
                  Expanded(
                    child: Text(
                      '#${order.orderNumber}',
                      key: Key('order_number_${order.id}'),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontFamily: 'SpaceMono',
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: AppColors.nbBlack,
                        letterSpacing: -0.2,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  OrderStatusBadge(orderStatus: order.status),
                ],
              ),
              const SizedBox(height: 6),
              // Tanggal pembuatan
              Row(
                children: <Widget>[
                  const Icon(
                    Icons.access_time,
                    size: 13,
                    color: AppColors.nbDisabledText,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    formatDateTimeId(order.createdAt),
                    style: AppTheme.bodySm(
                      AppColors.nbDisabledText,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              const Divider(color: AppColors.nbBlack, height: 1, thickness: 1),
              const SizedBox(height: 10),
              // Item snapshot
              if (firstItem != null) ...<Widget>[
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    // Cover thumbnail
                    Container(
                      width: 42,
                      height: 56,
                      decoration: AppTheme.brutalBox(
                        color: AppColors.nbMuted,
                        borderColor: AppColors.nbBlack,
                        borderWidth: 1.5,
                        shadowOffset: 0,
                      ),
                      child:
                          firstItem.coverUrl != null &&
                              firstItem.coverUrl!.isNotEmpty
                          ? Image.network(
                              firstItem.coverUrl!,
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
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Text(
                            firstItem.title,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: AppTheme.labelMd(AppColors.nbBlack),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            firstItem.author,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: AppTheme.bodySm(
                              AppColors.nbDisabledText,
                              fontSize: 12,
                            ),
                          ),
                          if (otherItemsCount > 0) ...<Widget>[
                            const SizedBox(height: 2),
                            Text(
                              '+$otherItemsCount e-book lainnya',
                              style: const TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: AppColors.nbDisabledText,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
              ],
              // Total Amount & Action
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: <Widget>[
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      const Text(
                        'Total Pesanan',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: AppColors.nbDisabledText,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        order.formattedTotalAmount,
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 15,
                          fontWeight: FontWeight.w900,
                          color: AppColors.nbBlack,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(width: 8),
                  if (order.isPending && onResumePayment != null)
                    PtButton(
                      key: Key('btn_resume_payment_${order.id}'),
                      label: 'Bayar Sekarang',
                      icon: Icons.payment,
                      color: AppColors.nbOrange,
                      expand: false,
                      onTap: onResumePayment,
                    )
                  else if (order.isPaid && onOpenLibrary != null)
                    PtButton(
                      key: Key('btn_open_library_${order.id}'),
                      label: 'Buka di Pustaka',
                      icon: Icons.auto_stories,
                      color: AppColors.nbGreen,
                      expand: false,
                      onTap: onOpenLibrary,
                    )
                  else
                    const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: <Widget>[
                        Text(
                          'Lihat Detail',
                          style: TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: AppColors.nbBlack,
                          ),
                        ),
                        SizedBox(width: 4),
                        Icon(
                          Icons.arrow_forward,
                          size: 14,
                          color: AppColors.nbBlack,
                        ),
                      ],
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
