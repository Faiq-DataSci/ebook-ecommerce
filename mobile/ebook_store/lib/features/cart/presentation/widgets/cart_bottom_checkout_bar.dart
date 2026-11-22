import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

class CartBottomCheckoutBar extends StatelessWidget {
  final int selectedCount;
  final String formattedTotalPayable;
  final int appliedDiscount;
  final String formattedDiscount;
  final VoidCallback onCheckoutTap;

  const CartBottomCheckoutBar({
    super.key,
    required this.selectedCount,
    required this.formattedTotalPayable,
    required this.appliedDiscount,
    required this.formattedDiscount,
    required this.onCheckoutTap,
  });

  static const Color _stitchErrorColor = Color(0xFFBA1A1A);

  @override
  Widget build(BuildContext context) {
    final isEnabled = selectedCount > 0;

    return Container(
      key: const Key('cart_bottom_checkout_bar'),
      padding: const EdgeInsets.symmetric(
        horizontal: AppTheme.marginMobile,
        vertical: 10,
      ),
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
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: <Widget>[
            Flexible(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    'TOTAL BAYAR',
                    style: AppTheme.labelSm(
                      AppColors.nbTextMuted,
                      fontSize: 11.5,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    formattedTotalPayable,
                    key: const Key('cart_bottom_total_payable'),
                    style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 18),
                  ),
                  if (appliedDiscount > 0) ...<Widget>[
                    const SizedBox(height: 2),
                    Text(
                      'Hemat $formattedDiscount',
                      key: const Key('cart_bottom_savings_label'),
                      style: AppTheme.dataMono(_stitchErrorColor, fontSize: 11),
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Semantics(
                button: true,
                enabled: isEnabled,
                label: 'Checkout ($selectedCount E-book)',
                child: InkWell(
                  key: const Key('cart_checkout_button'),
                  onTap: onCheckoutTap,
                  child: Container(
                    height: 48,
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    alignment: Alignment.center,
                    decoration: AppTheme.brutalBox(
                      color: isEnabled ? AppColors.nbYellow : AppColors.nbMuted,
                      borderColor: isEnabled
                          ? AppColors.nbBlack
                          : AppColors.nbDisabledText,
                      borderWidth: AppTheme.borderDefault,
                      shadowOffset: isEnabled ? 4 : 0,
                    ),
                    child: FittedBox(
                      fit: BoxFit.scaleDown,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          Text(
                            'CHECKOUT',
                            style: AppTheme.headlineSmMobile(
                              isEnabled
                                  ? AppColors.nbBlack
                                  : AppColors.nbDisabledText,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Icon(
                            isEnabled
                                ? Icons.arrow_forward
                                : Icons.lock_outline,
                            size: 20,
                            color: isEnabled
                                ? AppColors.nbBlack
                                : AppColors.nbDisabledText,
                          ),
                        ],
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
