import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../../checkout/domain/entities/order_entity.dart';

class OrderFilterChips extends StatelessWidget {
  final OrderStatusEnum? selectedStatus;
  final ValueChanged<OrderStatusEnum?> onSelected;

  const OrderFilterChips({
    super.key,
    required this.selectedStatus,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    final filters = <({String label, OrderStatusEnum? status})>[
      (label: 'Semua', status: null),
      (label: 'Lunas', status: OrderStatusEnum.paid),
      (label: 'Menunggu', status: OrderStatusEnum.pending),
      (label: 'Gagal', status: OrderStatusEnum.failed),
      (label: 'Kedaluwarsa', status: OrderStatusEnum.expired),
      (label: 'Dibatalkan', status: OrderStatusEnum.cancelled),
    ];

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: filters.map((item) {
          final isSelected = selectedStatus == item.status;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: Semantics(
              button: true,
              selected: isSelected,
              label: 'Filter pesanan: ${item.label}',
              child: InkWell(
                key: Key('filter_chip_${item.status?.name ?? 'all'}'),
                onTap: () => onSelected(item.status),
                child: Container(
                  height: 36,
                  padding: const EdgeInsets.symmetric(horizontal: 14),
                  alignment: Alignment.center,
                  decoration: AppTheme.brutalBox(
                    color: isSelected ? AppColors.nbYellow : AppColors.nbWhite,
                    borderColor: AppColors.nbBlack,
                    borderWidth: AppTheme.borderDefault,
                    shadowOffset: isSelected ? 2 : 0,
                  ),
                  child: Text(
                    item.label,
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 12,
                      fontWeight: isSelected
                          ? FontWeight.w800
                          : FontWeight.w600,
                      color: AppColors.nbBlack,
                    ),
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}
