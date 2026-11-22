import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

class CartBulkSelectionBar extends StatelessWidget {
  final int totalItems;
  final int selectedCount;
  final bool isAllSelected;
  final VoidCallback onToggleSelectAll;
  final VoidCallback onDeleteSelected;

  const CartBulkSelectionBar({
    super.key,
    required this.totalItems,
    required this.selectedCount,
    required this.isAllSelected,
    required this.onToggleSelectAll,
    required this.onDeleteSelected,
  });

  @override
  Widget build(BuildContext context) {
    final canDelete = selectedCount > 0;

    return Container(
      key: const Key('cart_bulk_selection_bar'),
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: AppTheme.brutalBox(
        color: AppColors.nbWhite,
        borderColor: AppColors.nbBlack,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 3,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[
          Expanded(
            child: Semantics(
              checked: isAllSelected,
              button: true,
              label: 'Pilih Semua ($totalItems E-book)',
              child: InkWell(
                key: const Key('cart_select_all_checkbox'),
                onTap: onToggleSelectAll,
                child: ConstrainedBox(
                  constraints: const BoxConstraints(minHeight: 44),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      Container(
                        width: 22,
                        height: 22,
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          color: isAllSelected
                              ? AppColors.nbYellow
                              : AppColors.nbPaper,
                          border: Border.all(
                            color: AppColors.nbBlack,
                            width: AppTheme.borderDefault,
                          ),
                        ),
                        child: isAllSelected
                            ? const Icon(
                                Icons.check,
                                size: 15,
                                color: AppColors.nbBlack,
                              )
                            : null,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'PILIH SEMUA ($totalItems E-BOOK)',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: AppTheme.labelMd(AppColors.nbBlack),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(width: 8),
          Semantics(
            button: true,
            enabled: canDelete,
            label: 'Hapus Terpilih',
            child: InkWell(
              key: const Key('cart_delete_selected_button'),
              onTap: onDeleteSelected,
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 6),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: canDelete ? AppColors.nbPaper : AppColors.nbMuted,
                    border: Border.all(
                      color: AppColors.nbBlack,
                      width: AppTheme.borderDefault,
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      Icon(
                        Icons.delete_sweep_outlined,
                        size: 16,
                        color: canDelete
                            ? AppColors.nbBlack
                            : AppColors.nbDisabledText,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        'HAPUS TERPILIH',
                        style: AppTheme.labelSm(
                          canDelete
                              ? AppColors.nbBlack
                              : AppColors.nbDisabledText,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
