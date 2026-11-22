import 'package:flutter/material.dart';
import '../../../../core/constants/app_assets.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../domain/models/ebook.dart';

/// 2-Column Catalog E-Book Card (`Rilisan Terbaru`) matching Google Stitch:
/// - `2:3` cover image with `2px` border + `2px` hard shadow + floating top-left badge
/// - 2-line clamped title (`Space Grotesk` 700, `14px`)
/// - 1-line clamped author (`Inter` 400, `12px`)
/// - Rating box (`★ 4.6` / `★ 4.9`)
/// - Top-bordered price (`Rp 55.000` / `Rp 49.000` with `1px` border & `1px` shadow)
///   + `+ KERANJANG` CTA button
class BookCard extends StatelessWidget {
  final Ebook book;
  final NbPalette palette;
  final VoidCallback onCardTap;
  final VoidCallback onAddToCartTap;

  const BookCard({
    super.key,
    required this.book,
    required this.palette,
    required this.onCardTap,
    required this.onAddToCartTap,
  });

  Color _resolveBadgeColor() {
    switch (book.badgeColorKey) {
      case 'green':
        return AppColors.nbGreen;
      case 'lavender':
        return AppColors.nbLavender;
      case 'pink':
        return AppColors.nbPink;
      case 'yellow':
        return AppColors.nbYellow;
      case 'blue':
      default:
        return AppColors.nbBlue;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: AppTheme.brutalBox(
        color: AppColors.nbWhite,
        borderColor: AppColors.nbBlack,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 4,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          // Tappable Cover + Metadata area
          InkWell(
            key: Key('book_card_detail_${book.id}'),
            onTap: onCardTap,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                AspectRatio(
                  aspectRatio: 2 / 3,
                  child: Container(
                    decoration: AppTheme.brutalBox(
                      color: AppColors.surfaceContainer,
                      borderColor: AppColors.nbBlack,
                      borderWidth: AppTheme.borderDefault,
                      shadowOffset: 2,
                    ),
                    child: Stack(
                      fit: StackFit.expand,
                      children: <Widget>[
                        StitchBookCover(
                          assetKey: book.coverAssetKey,
                          title: book.title,
                        ),
                        Positioned(
                          top: 4,
                          left: 4,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 4,
                              vertical: 1.5,
                            ),
                            decoration: BoxDecoration(
                              color: _resolveBadgeColor(),
                              border: Border.all(
                                color: AppColors.nbBlack,
                                width: AppTheme.borderThin,
                              ),
                            ),
                            child: Text(
                              book.badgeLabel.toUpperCase(),
                              style: AppTheme.labelSm(
                                AppColors.nbBlack,
                                fontSize: 9,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                SizedBox(
                  height: 35,
                  child: Text(
                    book.title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: AppTheme.labelMd(
                      AppColors.nbBlack,
                    ).copyWith(height: 1.2),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  book.author,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppTheme.bodySm(AppColors.nbTextMuted, fontSize: 12),
                ),
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 4,
                    vertical: 1,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.nbPaper,
                    border: Border.all(
                      color: AppColors.nbBlack,
                      width: AppTheme.borderThin,
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      const Icon(
                        Icons.star,
                        size: 12,
                        color: AppColors.nbBlack,
                      ),
                      const SizedBox(width: 2),
                      Text(
                        book.rating.toStringAsFixed(1),
                        style: AppTheme.dataMono(
                          AppColors.nbBlack,
                          fontSize: 10,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          // Price + Add-to-Cart Footer (`mt-2.5 pt-2 border-t-2 border-nb-black`)
          Container(
            padding: const EdgeInsets.only(top: 8),
            decoration: const BoxDecoration(
              border: Border(
                top: BorderSide(
                  color: AppColors.nbBlack,
                  width: AppTheme.borderDefault,
                ),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 6,
                    vertical: 2,
                  ),
                  decoration: AppTheme.brutalBox(
                    color: AppColors.nbYellow,
                    borderColor: AppColors.nbBlack,
                    borderWidth: AppTheme.borderThin,
                    shadowOffset: 1,
                  ),
                  child: Text(
                    book.formattedPrice,
                    style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 12),
                  ),
                ),
                const SizedBox(height: 8),
                Semantics(
                  button: true,
                  label: 'Tambah ${book.title} ke keranjang',
                  child: InkWell(
                    key: Key('book_card_add_${book.id}'),
                    onTap: onAddToCartTap,
                    child: Container(
                      width: double.infinity,
                      constraints: const BoxConstraints(minHeight: 34),
                      alignment: Alignment.center,
                      padding: const EdgeInsets.symmetric(
                        vertical: 6,
                        horizontal: 6,
                      ),
                      decoration: AppTheme.brutalBox(
                        color: AppColors.nbWhite,
                        borderColor: AppColors.nbBlack,
                        borderWidth: AppTheme.borderDefault,
                        shadowOffset: 2,
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          const Icon(
                            Icons.add,
                            size: 14,
                            color: AppColors.nbBlack,
                          ),
                          const SizedBox(width: 4),
                          Flexible(
                            child: Text(
                              'KERANJANG',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: AppTheme.labelSm(
                                AppColors.nbBlack,
                                fontSize: 11,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
