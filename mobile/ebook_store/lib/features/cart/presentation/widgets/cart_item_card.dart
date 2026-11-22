import 'package:flutter/material.dart';
import '../../../../core/constants/app_assets.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../domain/entities/cart_item.dart';

class CartItemCard extends StatelessWidget {
  final CartItem item;
  final VoidCallback onToggleSelect;
  final VoidCallback onDelete;
  final VoidCallback onTapDetail;

  const CartItemCard({
    super.key,
    required this.item,
    required this.onToggleSelect,
    required this.onDelete,
    required this.onTapDetail,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      key: Key('cart_item_card_${item.id}'),
      width: double.infinity,
      padding: const EdgeInsets.all(10),
      decoration: AppTheme.brutalBox(
        color: AppColors.nbWhite,
        borderColor: AppColors.nbBlack,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 4,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          // Checkbox with minimum 44x44 tap target
          Semantics(
            checked: item.isSelected,
            button: true,
            label: 'Pilih ${item.title}',
            child: InkWell(
              key: Key('cart_item_checkbox_${item.id}'),
              onTap: onToggleSelect,
              child: Container(
                width: 36,
                height: 44,
                alignment: Alignment.topLeft,
                padding: const EdgeInsets.only(top: 4),
                child: Container(
                  width: 22,
                  height: 22,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: item.isSelected
                        ? AppColors.nbYellow
                        : AppColors.nbPaper,
                    border: Border.all(
                      color: AppColors.nbBlack,
                      width: AppTheme.borderDefault,
                    ),
                  ),
                  child: item.isSelected
                      ? const Icon(
                          Icons.check,
                          size: 15,
                          color: AppColors.nbBlack,
                        )
                      : null,
                ),
              ),
            ),
          ),

          // 2:3 Aspect Ratio Thumbnail Cover with Format Strip
          GestureDetector(
            onTap: onTapDetail,
            child: Container(
              width: 78,
              height: 117,
              decoration: AppTheme.brutalBox(
                color: AppColors.nbMuted,
                borderColor: AppColors.nbBlack,
                borderWidth: AppTheme.borderDefault,
                shadowOffset: 2,
              ),
              child: Stack(
                fit: StackFit.expand,
                children: <Widget>[
                  StitchBookCover(
                    assetPath: item.coverUrl,
                    semanticLabel: 'Sampul ${item.title}',
                  ),
                  Positioned(
                    left: 0,
                    right: 0,
                    bottom: 0,
                    child: Container(
                      color: AppColors.nbBlack,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 4,
                        vertical: 2,
                      ),
                      child: Text(
                        item.formatLabel.toUpperCase(),
                        textAlign: TextAlign.center,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: AppTheme.labelSm(
                          AppColors.nbPaper,
                          fontSize: 9.5,
                        ).copyWith(letterSpacing: 0.8),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(width: 10),

          // Book Details & Price/Delete Row
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                // SAW Rank & Category Badges
                Wrap(
                  spacing: 6,
                  runSpacing: 4,
                  children: <Widget>[
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: item.isTopSawRank
                            ? AppColors.nbYellow
                            : AppColors.nbLavender,
                        border: Border.all(
                          color: AppColors.nbBlack,
                          width: AppTheme.borderDefault,
                        ),
                      ),
                      child: Text(
                        item.sawRankLabel,
                        style: AppTheme.dataMono(
                          AppColors.nbBlack,
                          fontSize: 10.5,
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceContainer,
                        border: Border.all(
                          color: AppColors.nbBlack,
                          width: AppTheme.borderDefault,
                        ),
                      ),
                      child: Text(
                        item.category.toUpperCase(),
                        style: AppTheme.labelSm(
                          AppColors.nbBlack,
                          fontSize: 10.5,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),

                // Title
                InkWell(
                  key: Key('cart_item_title_${item.id}'),
                  onTap: onTapDetail,
                  child: Text(
                    item.title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: AppTheme.headlineSmMobile(
                      AppColors.nbBlack,
                    ).copyWith(fontSize: 16, height: 1.25),
                  ),
                ),
                const SizedBox(height: 3),

                // Author • Page Count
                Text(
                  item.authorAndPagesLabel,
                  style: AppTheme.bodySm(AppColors.nbTextMuted, fontSize: 13),
                ),
                const SizedBox(height: 8),

                // Divider
                Container(
                  height: 2,
                  color: AppColors.nbBlack.withValues(alpha: 0.1),
                ),
                const SizedBox(height: 8),

                // Price + Digital License + Delete Button
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: <Widget>[
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Wrap(
                            spacing: 6,
                            runSpacing: 2,
                            crossAxisAlignment: WrapCrossAlignment.center,
                            children: <Widget>[
                              Text(
                                item.formattedPrice,
                                style: AppTheme.dataMono(
                                  AppColors.nbBlack,
                                  fontSize: 16,
                                ),
                              ),
                              if (item.hasDiscount)
                                Text(
                                  item.formattedOriginalPrice!,
                                  style:
                                      AppTheme.dataMono(
                                        AppColors.nbDisabledText,
                                        fontSize: 12,
                                      ).copyWith(
                                        decoration: TextDecoration.lineThrough,
                                      ),
                                ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 5,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: AppColors.surfaceContainer,
                              border: Border.all(
                                color: AppColors.nbBlack,
                                width: AppTheme.borderThin,
                              ),
                            ),
                            child: Text(
                              item.licenseLabel.toUpperCase(),
                              style: AppTheme.labelSm(
                                AppColors.nbBlack,
                                fontSize: 10,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    Semantics(
                      button: true,
                      label: 'Hapus ${item.title} dari keranjang',
                      child: InkWell(
                        key: Key('cart_item_delete_${item.id}'),
                        onTap: onDelete,
                        child: Container(
                          width: 44,
                          height: 44,
                          alignment: Alignment.center,
                          child: Container(
                            width: 36,
                            height: 36,
                            alignment: Alignment.center,
                            decoration: AppTheme.brutalBox(
                              color: AppColors.nbPaper,
                              borderColor: AppColors.nbBlack,
                              borderWidth: AppTheme.borderDefault,
                              shadowOffset: 2,
                            ),
                            child: const Icon(
                              Icons.delete_outline,
                              size: 18,
                              color: AppColors.nbBlack,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
