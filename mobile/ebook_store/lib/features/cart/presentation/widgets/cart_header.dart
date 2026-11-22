import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

class CartHeader extends StatelessWidget {
  final VoidCallback onBackTap;
  final VoidCallback onClearCartTap;
  final VoidCallback? onStateDebugTap;

  const CartHeader({
    super.key,
    required this.onBackTap,
    required this.onClearCartTap,
    this.onStateDebugTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(minHeight: 56),
      padding: const EdgeInsets.symmetric(
        horizontal: AppTheme.marginMobile,
        vertical: 6,
      ),
      color: AppColors.nbPaper,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[
          Expanded(
            child: Row(
              children: <Widget>[
                Semantics(
                  button: true,
                  label: 'Kembali',
                  child: InkWell(
                    key: const Key('cart_back_button'),
                    onTap: onBackTap,
                    child: Container(
                      width: 44,
                      height: 44,
                      alignment: Alignment.center,
                      decoration: AppTheme.brutalBox(
                        color: AppColors.nbWhite,
                        borderColor: AppColors.nbBlack,
                        borderWidth: AppTheme.borderDefault,
                        shadowOffset: 2,
                      ),
                      child: const Icon(
                        Icons.arrow_back,
                        size: 20,
                        color: AppColors.nbBlack,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: AppTheme.spaceSm),
                Expanded(
                  child: Text(
                    'KERANJANG BELANJA',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              if (onStateDebugTap != null) ...<Widget>[
                Semantics(
                  button: true,
                  label: 'Uji state keranjang belanja',
                  child: InkWell(
                    key: const Key('cart_state_menu_button'),
                    onTap: onStateDebugTap,
                    child: Container(
                      width: 44,
                      height: 44,
                      alignment: Alignment.center,
                      decoration: AppTheme.brutalBox(
                        color: AppColors.nbWhite,
                        borderColor: AppColors.nbBlack,
                        borderWidth: AppTheme.borderDefault,
                        shadowOffset: 2,
                      ),
                      child: const Icon(
                        Icons.tune,
                        size: 20,
                        color: AppColors.nbBlack,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
              ],
              Semantics(
                button: true,
                label: 'Hapus Keranjang',
                child: InkWell(
                  key: const Key('cart_clear_all_button'),
                  onTap: onClearCartTap,
                  child: Container(
                    width: 44,
                    height: 44,
                    alignment: Alignment.center,
                    decoration: AppTheme.brutalBox(
                      color: AppColors.nbPink,
                      borderColor: AppColors.nbBlack,
                      borderWidth: AppTheme.borderDefault,
                      shadowOffset: 2,
                    ),
                    child: const Icon(
                      Icons.delete_outline,
                      size: 20,
                      color: AppColors.nbBlack,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
