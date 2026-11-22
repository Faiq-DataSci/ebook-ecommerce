import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../domain/entities/cart_promo.dart';

class CartPromoSection extends StatelessWidget {
  final TextEditingController controller;
  final CartPromo? activePromo;
  final String? promoError;
  final ValueChanged<String> onChanged;
  final VoidCallback onApplyTap;
  final VoidCallback onRemovePromoTap;

  const CartPromoSection({
    super.key,
    required this.controller,
    required this.activePromo,
    required this.promoError,
    required this.onChanged,
    required this.onApplyTap,
    required this.onRemovePromoTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const Key('cart_promo_section'),
      width: double.infinity,
      padding: const EdgeInsets.all(12),
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
            children: <Widget>[
              const Icon(
                Icons.confirmation_number_outlined,
                size: 20,
                color: AppColors.nbBlack,
              ),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  'KUPON & KODE PROMO',
                  style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: <Widget>[
              Expanded(
                child: SizedBox(
                  height: 44,
                  child: TextField(
                    key: const Key('cart_promo_input'),
                    controller: controller,
                    onChanged: onChanged,
                    onSubmitted: (_) => onApplyTap(),
                    textCapitalization: TextCapitalization.characters,
                    style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 14),
                    decoration: InputDecoration(
                      hintText: 'Masukkan kode promo...',
                      hintStyle: AppTheme.bodySm(
                        AppColors.nbDisabledText,
                        fontSize: 13,
                      ),
                      filled: true,
                      fillColor: AppColors.nbPaper,
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 10,
                      ),
                      enabledBorder: const OutlineInputBorder(
                        borderRadius: BorderRadius.zero,
                        borderSide: BorderSide(
                          color: AppColors.nbBlack,
                          width: AppTheme.borderDefault,
                        ),
                      ),
                      focusedBorder: const OutlineInputBorder(
                        borderRadius: BorderRadius.zero,
                        borderSide: BorderSide(
                          color: AppColors.nbFocus,
                          width: AppTheme.borderMedium,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Semantics(
                button: true,
                label: 'Terapkan kode promo',
                child: InkWell(
                  key: const Key('cart_promo_apply_button'),
                  onTap: onApplyTap,
                  child: Container(
                    height: 44,
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    alignment: Alignment.center,
                    decoration: AppTheme.brutalBox(
                      color: AppColors.nbYellow,
                      borderColor: AppColors.nbBlack,
                      borderWidth: AppTheme.borderDefault,
                      shadowOffset: 2,
                    ),
                    child: Text(
                      'TERAPKAN',
                      style: AppTheme.labelMd(AppColors.nbBlack),
                    ),
                  ),
                ),
              ),
            ],
          ),
          if (promoError != null && promoError!.isNotEmpty) ...<Widget>[
            const SizedBox(height: 10),
            Container(
              key: const Key('cart_promo_error_banner'),
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
              decoration: BoxDecoration(
                color: AppColors.nbPink,
                border: Border.all(
                  color: AppColors.nbBlack,
                  width: AppTheme.borderDefault,
                ),
              ),
              child: Row(
                children: <Widget>[
                  const Icon(
                    Icons.cancel_outlined,
                    size: 16,
                    color: AppColors.nbBlack,
                  ),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      promoError!,
                      style: AppTheme.bodySm(AppColors.nbBlack, fontSize: 12),
                    ),
                  ),
                ],
              ),
            ),
          ],
          if (activePromo != null) ...<Widget>[
            const SizedBox(height: 12),
            Container(
              key: const Key('cart_active_promo_pill'),
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
              decoration: BoxDecoration(
                color: AppColors.nbPaper,
                border: Border.all(
                  color: AppColors.nbBlack,
                  width: AppTheme.borderDefault,
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: <Widget>[
                  Expanded(
                    child: Wrap(
                      spacing: 8,
                      runSpacing: 4,
                      crossAxisAlignment: WrapCrossAlignment.center,
                      children: <Widget>[
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.nbGreen,
                            border: Border.all(
                              color: AppColors.nbBlack,
                              width: AppTheme.borderThin,
                            ),
                          ),
                          child: Text(
                            activePromo!.badgeLabel,
                            style: AppTheme.dataMono(
                              AppColors.nbBlack,
                              fontSize: 11,
                            ),
                          ),
                        ),
                        Text(
                          activePromo!.code,
                          style: AppTheme.dataMono(
                            AppColors.nbBlack,
                            fontSize: 13.5,
                          ),
                        ),
                        Text(
                          '(-${activePromo!.formattedDiscount})',
                          style: AppTheme.bodySm(
                            AppColors.nbTextMuted,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 6),
                  Semantics(
                    button: true,
                    label: 'Hapus Kupon ${activePromo!.code}',
                    child: InkWell(
                      key: const Key('cart_remove_promo_button'),
                      onTap: onRemovePromoTap,
                      child: Container(
                        width: 44,
                        height: 36,
                        alignment: Alignment.centerRight,
                        child: Container(
                          width: 26,
                          height: 26,
                          alignment: Alignment.center,
                          decoration: BoxDecoration(
                            color: AppColors.nbPink,
                            border: Border.all(
                              color: AppColors.nbBlack,
                              width: AppTheme.borderThin,
                            ),
                          ),
                          child: const Icon(
                            Icons.close,
                            size: 15,
                            color: AppColors.nbBlack,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
